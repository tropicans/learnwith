/* Production-linked mobile and accessibility regression tests. */
(function () {
  'use strict';

  const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
  const results = [];
  let fs;
  let path;
  let vm;

  function test(name, fn) {
    results.push(Promise.resolve().then(fn).then(
      () => ({ name, ok: true }),
      error => ({ name, ok: false, error })
    ));
  }

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function source(relativePath) {
    if (!isNode) return '';
    return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
  }

  function classList(initial = []) {
    const values = new Set(initial);
    return {
      add: (...names) => names.forEach(name => values.add(name)),
      remove: (...names) => names.forEach(name => values.delete(name)),
      contains: name => values.has(name),
      toggle(name, force) {
        const next = force === undefined ? !values.has(name) : Boolean(force);
        if (next) values.add(name); else values.delete(name);
        return next;
      }
    };
  }

  function element(doc, classes = []) {
    const listeners = {};
    return {
      classList: classList(classes),
      style: {},
      attrs: {},
      innerText: '',
      textContent: '',
      innerHTML: '',
      addEventListener(type, fn) { (listeners[type] ||= []).push(fn); },
      emit(type, event = {}) { return Promise.all((listeners[type] || []).map(fn => fn({ target: this, preventDefault() {}, ...event }))); },
      setAttribute(name, value) { this.attrs[name] = String(value); },
      getAttribute(name) { return this.attrs[name] ?? null; },
      focus() { doc.activeElement = this; },
      querySelector() { return null; },
      querySelectorAll() { return []; },
      closest() { return null; }
    };
  }

  function fixtureDocument() {
    const listeners = {};
    const ids = {};
    return {
      body: { style: {}, appendChild() {}, removeChild() {} },
      activeElement: null,
      ids,
      addEventListener(type, fn) { (listeners[type] ||= []).push(fn); },
      emit(type, event) { return Promise.all((listeners[type] || []).map(fn => fn(event))); },
      getElementById(id) { return ids[id] || null; },
      querySelector() { return null; },
      querySelectorAll() { return []; },
      createElement() { return element(this); },
      execCommand() { return true; }
    };
  }

  function loadProduction(doc, clipboard) {
    const windowObject = {
      innerWidth: 375,
      isSecureContext: true,
      location: { hash: '' },
      addEventListener() {}
    };
    const context = {
      document: doc,
      window: windowObject,
      navigator: { clipboard: { writeText: text => { clipboard.push(text); return Promise.resolve(); } } },
      module: { exports: {} },
      console,
      setTimeout() { return 0; },
      clearTimeout() {}
    };
    vm.runInNewContext(source('assets/js/app.js'), context, { filename: 'assets/js/app.js' });
    return context.module.exports;
  }

  if (isNode) {
    fs = require('fs');
    path = require('path');
    vm = require('vm');

    const html = source('index.html');
    const mainCss = source('assets/css/main.css');
    const componentsCss = source('assets/css/components.css');
    const allProduction = `${html}\n${mainCss}\n${componentsCss}`;

    test('production markup exposes the mobile accessibility contract', () => {
      assert(/name="viewport"[^>]+width=device-width/.test(html), 'viewport metadata is missing');
      assert(/id="btn-mobile-menu"[^>]+aria-controls="app-sidebar"[^>]+aria-expanded="false"/.test(html), 'drawer button relationship/state is missing');
      assert(/role="group"[^>]+aria-label="Filter kategori kendala"/.test(html), 'filter group needs an Indonesian label');
      assert((html.match(/class="module-header"[^>]+aria-controls="module-body-\d"/g) || []).length === 5, 'each module header must control a body');
      assert(!/<button class="module-chevron"/.test(html), 'module chevrons must not be nested buttons');
      assert((html.match(/class="code-copy-btn"[^>]+aria-label=/g) || []).length >= 8, 'every command copy control needs the unified class and label');
      assert(!html.includes('btn-copy-code'), 'legacy command-copy class remains');
      assert(html.includes('id="btn-copy-redacted"') && html.includes('id="btn-copy-report"'), 'output-copy controls must remain distinct');
    });

    test('mobile CSS retains orientation tools and prevents narrow overflow', () => {
      assert(/@media \(max-width: 768px\)/.test(mainCss) && /@media \(max-width: 480px\)/.test(mainCss), 'mobile breakpoints are missing');
      assert(!/\.header-(?:search-container|progress-box)\s*\{[^}]*display:\s*none/s.test(mainCss), 'search or progress is hidden');
      assert(/\.header-search-container\s*\{[^}]*display:\s*block/s.test(mainCss), 'mobile search is not retained');
      assert(/\.header-progress-box\s*\{[^}]*display:\s*flex/s.test(mainCss), 'mobile percentage is not retained');
      assert(/grid-template-columns:\s*minmax\(0, 1fr\)/.test(allProduction), 'narrow grids need minmax(0, 1fr)');
      assert(/min-(?:width|height):\s*44px/.test(allProduction), '44px touch targets are missing');
      assert(/overflow-x:\s*auto/.test(componentsCss), 'code overflow safeguard is missing');
      assert(/--action-success:\s*#047857/.test(mainCss) && /--action-danger:\s*#be123c/.test(mainCss), 'WCAG-safe filled action colors are missing');
    });

    test('all CSS custom properties resolve and the 9Router endpoint is canonical', () => {
      const references = new Set(Array.from(allProduction.matchAll(/var\((--[\w-]+)/g), match => match[1]));
      const declarations = new Set(Array.from(allProduction.matchAll(/(--[\w-]+)\s*:/g), match => match[1]));
      const unresolved = [...references].filter(token => !declarations.has(token));
      assert(unresolved.length === 0, `unresolved custom properties: ${unresolved.join(', ')}`);
      assert(!allProduction.includes('20042'), 'obsolete port 20042 remains');
      assert(html.includes('http://localhost:20128'), 'canonical endpoint is missing');
    });

    test('production drawer controller synchronizes state, Escape, and focus', async () => {
      const doc = fixtureDocument();
      const menu = element(doc);
      const sidebar = element(doc);
      const backdrop = element(doc);
      const link = element(doc, ['nav-link']);
      sidebar.querySelector = () => link;
      sidebar.querySelectorAll = selector => selector === '.nav-link' ? [link] : [link];
      doc.ids['btn-mobile-menu'] = menu;
      doc.ids['app-sidebar'] = sidebar;
      doc.ids['drawer-backdrop'] = backdrop;
      const api = loadProduction(doc, []);
      api.setupMobileDrawer();
      await menu.emit('click');
      assert(sidebar.classList.contains('open') && menu.attrs['aria-expanded'] === 'true', 'drawer did not open truthfully');
      assert(doc.activeElement === link, 'focus did not enter the drawer');
      await doc.emit('keydown', { key: 'Escape', preventDefault() {} });
      assert(!sidebar.classList.contains('open') && menu.attrs['aria-expanded'] === 'false', 'Escape did not close the drawer');
      assert(doc.activeElement === menu, 'focus did not return to the menu button');
    });

    test('production accordion and filter controllers handle keyboard state', async () => {
      const doc = fixtureDocument();
      const header = element(doc, ['module-header']);
      const card = element(doc, ['module-card']);
      header.closest = selector => selector === '.module-header' ? header : selector === '.module-card' ? card : null;
      card.querySelector = selector => selector === '.module-header' ? header : null;

      const filters = ['all', 'node', 'router'].map((category, index) => {
        const button = element(doc, index === 0 ? ['troubleshoot-filter-btn', 'active'] : ['troubleshoot-filter-btn']);
        button.attrs['data-category'] = category;
        button.attrs['aria-pressed'] = index === 0 ? 'true' : 'false';
        return button;
      });
      const troubleCard = element(doc, ['trouble-card']);
      troubleCard.attrs['data-trouble-category'] = 'node';
      troubleCard.innerText = 'node error';
      doc.querySelectorAll = selector => {
        if (selector === '.troubleshoot-filter-btn') return filters;
        if (selector === '.trouble-card') return [troubleCard];
        if (selector === '.module-card') return [card];
        return [];
      };
      const api = loadProduction(doc, []);
      api.setupModuleAccordions();
      api.setupTroubleshootingHub();
      await doc.emit('keydown', { target: header, key: ' ', preventDefault() {} });
      assert(card.classList.contains('collapsed') && header.attrs['aria-expanded'] === 'false', 'Space did not synchronize accordion state');
      await filters[1].emit('click');
      assert(filters[1].attrs['aria-pressed'] === 'true' && filters[0].attrs['aria-pressed'] === 'false', 'filter pressed state is stale');
      await filters[1].emit('keydown', { key: 'End', preventDefault() {} });
      assert(doc.activeElement === filters[2], 'End did not move filter focus');
    });

    test('production command-copy controller supports both adjacent code shapes', async () => {
      const doc = fixtureDocument();
      const clipboard = [];
      const api = loadProduction(doc, clipboard);
      api.setupCodeCopy();
      for (const shape of ['code-container', 'code-block-wrap']) {
        const button = element(doc, ['code-copy-btn']);
        const container = element(doc, [shape]);
        const code = element(doc);
        code.innerText = shape === 'code-container' ? 'node --version' : 'npm install -g 9router';
        button.closest = selector => selector === '.code-copy-btn' ? button : selector.includes(shape) ? container : null;
        container.querySelector = () => code;
        await doc.emit('click', { target: button });
      }
      await Promise.resolve();
      assert(clipboard.join('|') === 'node --version|npm install -g 9router', 'command copy did not use adjacent code');
    });
  } else {
    test('browser runner loaded mobile suite', () => assert(typeof document !== 'undefined', 'document unavailable'));
  }

  Promise.all(results).then(completed => {
    let failures = 0;
    completed.forEach(result => {
      if (result.ok) console.log(`✓ ${result.name}`);
      else {
        failures += 1;
        console.error(`✗ ${result.name}: ${result.error.message}`);
      }
    });
    console.log(`\nMobile/accessibility: ${completed.length - failures} passed, ${failures} failed`);
    if (isNode && failures) process.exitCode = 1;
  });
}());
