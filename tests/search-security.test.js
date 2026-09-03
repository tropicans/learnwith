/** Regression tests for DOM-preserving search and text-only toast rendering. */
(function () {

const runningInNode = typeof module !== 'undefined' && module.exports;

class MiniClassList {
  constructor(element) { this.element = element; }
  _items() { return this.element.className.split(/\s+/).filter(Boolean); }
  contains(name) { return this._items().includes(name); }
  add(name) { if (!this.contains(name)) this.element.className = [...this._items(), name].join(' '); }
  remove(name) { this.element.className = this._items().filter(item => item !== name).join(' '); }
}

class MiniNode {
  constructor(type) { this.nodeType = type; this.parentNode = null; }
  get parentElement() { return this.parentNode && this.parentNode.nodeType === 1 ? this.parentNode : null; }
}

class MiniText extends MiniNode {
  constructor(value) { super(3); this.nodeValue = value; }
  get textContent() { return this.nodeValue; }
  set textContent(value) { this.nodeValue = String(value); }
}

class MiniFragment extends MiniNode {
  constructor() { super(11); this.childNodes = []; }
  appendChild(node) { node.parentNode = this; this.childNodes.push(node); return node; }
}

function selectorMatches(element, selector) {
  selector = selector.trim();
  if (selector.startsWith('.')) return element.classList.contains(selector.slice(1));
  const attr = selector.match(/^([a-z]+)\[([^\]]+)\]$/i);
  if (attr) return element.tagName.toLowerCase() === attr[1].toLowerCase() && element.hasAttribute(attr[2]);
  return element.tagName.toLowerCase() === selector.toLowerCase();
}

class MiniElement extends MiniNode {
  constructor(tagName) {
    super(1);
    this.tagName = tagName.toUpperCase();
    this.childNodes = [];
    this.attributes = {};
    this.className = '';
    this.classList = new MiniClassList(this);
    this.style = {};
    this.value = '';
    this.checked = false;
    this.listeners = {};
  }
  appendChild(node) {
    if (node.nodeType === 11) {
      [...node.childNodes].forEach(child => this.appendChild(child));
      node.childNodes = [];
      return node;
    }
    node.parentNode = this;
    this.childNodes.push(node);
    return node;
  }
  replaceChild(replacement, oldNode) {
    const index = this.childNodes.indexOf(oldNode);
    if (index < 0) throw new Error('Old child not found');
    const replacements = replacement.nodeType === 11 ? [...replacement.childNodes] : [replacement];
    replacements.forEach(node => { node.parentNode = this; });
    this.childNodes.splice(index, 1, ...replacements);
    oldNode.parentNode = null;
    if (replacement.nodeType === 11) replacement.childNodes = [];
    return oldNode;
  }
  removeChild(node) {
    const index = this.childNodes.indexOf(node);
    if (index >= 0) this.childNodes.splice(index, 1);
    node.parentNode = null;
  }
  normalize() {
    for (let i = this.childNodes.length - 1; i > 0; i--) {
      if (this.childNodes[i].nodeType === 3 && this.childNodes[i - 1].nodeType === 3) {
        this.childNodes[i - 1].nodeValue += this.childNodes[i].nodeValue;
        this.childNodes.splice(i, 1);
      }
    }
    this.childNodes.filter(node => node.nodeType === 1).forEach(node => node.normalize());
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  hasAttribute(name) { return Object.prototype.hasOwnProperty.call(this.attributes, name); }
  closest(selectors) {
    let current = this;
    const list = selectors.split(',');
    while (current) {
      if (current.nodeType === 1 && list.some(selector => selectorMatches(current, selector))) return current;
      current = current.parentElement;
    }
    return null;
  }
  querySelectorAll(selector) {
    const found = [];
    const walk = node => {
      if (node.nodeType === 1 && selector.split(',').some(part => selectorMatches(node, part))) found.push(node);
      if (node.childNodes) node.childNodes.forEach(walk);
    };
    this.childNodes.forEach(walk);
    return found;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  addEventListener(type, callback) { (this.listeners[type] ||= []).push(callback); }
  dispatchEvent(event) { (this.listeners[event.type] || []).forEach(callback => callback.call(this, event)); }
  get textContent() { return this.childNodes.map(node => node.textContent).join(''); }
  set textContent(value) {
    this.childNodes = [];
    if (value !== '') this.appendChild(new MiniText(String(value)));
  }
  get innerText() { return this.textContent; }
}

class MiniDocument {
  constructor() { this.roots = []; this.ids = {}; this.createdTags = []; }
  addEventListener() {}
  createElement(tag) { this.createdTags.push(tag.toLowerCase()); return new MiniElement(tag); }
  createTextNode(text) { return new MiniText(text); }
  createDocumentFragment() { return new MiniFragment(); }
  getElementById(id) { return this.ids[id] || null; }
  querySelectorAll(selector) {
    if (selector.includes('.content-section,') || selector.includes('.checkpoint-gate-card')) return this.roots;
    const found = [];
    this.roots.forEach(root => {
      if (selector.split(',').some(part => selectorMatches(root, part))) found.push(root);
      found.push(...root.querySelectorAll(selector));
    });
    return found;
  }
  createTreeWalker(root, _show, filter) {
    const nodes = [];
    const walk = node => {
      if (node.nodeType === 3 && filter.acceptNode(node) === 1) nodes.push(node);
      if (node.childNodes) node.childNodes.forEach(walk);
    };
    walk(root);
    let index = -1;
    return { currentNode: null, nextNode() { index++; this.currentNode = nodes[index]; return Boolean(this.currentNode); } };
  }
}

let testDocument = typeof document !== 'undefined' ? document : null;
if (runningInNode) {
  testDocument = new MiniDocument();
  global.window = {};
  global.document = testDocument;
  global.NodeFilter = { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2 };
}

const SearchEngineClass = runningInNode
  ? require('../assets/js/search.js').SearchEngine
  : window.SearchEngine.constructor;
const showToast = runningInNode
  ? require('../assets/js/app.js').showToast
  : window.showToast;

let passedSearch = 0;
let failedSearch = 0;
function assertSearch(condition, description) {
  if (condition) { passedSearch++; console.log(`  ✓ PASS: ${description}`); }
  else { failedSearch++; console.error(`  ✕ FAIL: ${description}`); }
}

function runSearchSecurityTests() {
  console.log('--- STARTING SEARCH & TOAST SECURITY TESTS ---\n');
  const card = testDocument.createElement('section');
  card.className = 'card';
  const label = testDocument.createElement('label');
  label.appendChild(testDocument.createTextNode('Cari aman <img src=x onerror=alert(1)>'));
  const checkbox = testDocument.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.checked = true;
  checkbox.value = 'nilai-aktif';
  let clicks = 0;
  checkbox.addEventListener('click', () => { clicks++; });
  card.appendChild(label);
  card.appendChild(checkbox);

  const toastContainer = testDocument.createElement('div');
  if (runningInNode) {
    testDocument.roots = [card, toastContainer];
    testDocument.ids['toast-container'] = toastContainer;
  } else {
    card.id = 'search-security-fixture';
    document.body.appendChild(card);
    toastContainer.id = 'toast-container-test';
    const existingToast = document.getElementById('toast-container');
    if (!existingToast) {
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
    }
  }

  const engine = new SearchEngineClass();
  if (runningInNode) engine.buildIndex();
  else engine.searchItems = [{ id: 'fixture', element: card, text: card.textContent.toLowerCase() }];
  const sameCheckbox = checkbox;
  engine.performSearch('Cari');
  assertSearch(card.querySelectorAll('mark[data-search-highlight]').length > 0, 'Matching text is highlighted with generated mark nodes');
  engine.performSearch('');
  assertSearch(card.querySelectorAll('mark[data-search-highlight]').length === 0, 'Clearing search unwraps generated highlights');
  assertSearch(card.querySelector('input') === sameCheckbox, 'Search and clear preserve input element identity');
  assertSearch(checkbox.checked && checkbox.value === 'nilai-aktif', 'Search and clear preserve live input state');
  checkbox.dispatchEvent(runningInNode ? { type: 'click' } : new Event('click'));
  assertSearch(clicks === 1, 'Previously attached input listener remains active');

  const payload = '<img src=x onerror=alert(1)>';
  engine.performSearch(payload);
  assertSearch(card.querySelectorAll('img').length === 0, 'Injection-shaped search text creates no HTML element');
  showToast(payload, 'info', 0);
  const activeToast = runningInNode ? toastContainer.childNodes[0] : (document.getElementById('toast-container') || toastContainer).lastElementChild;
  assertSearch(activeToast && activeToast.textContent.includes(payload), 'Toast renders injection-shaped input literally');
  assertSearch((runningInNode ? testDocument.createdTags.filter(tag => tag === 'img').length : activeToast.querySelectorAll('img').length) === 0, 'Toast creates no attacker-supplied element');

  if (!runningInNode) card.remove();
  console.log(`\nTEST RESULTS: ${passedSearch} PASSED, ${failedSearch} FAILED\n`);
  if (failedSearch && typeof process !== 'undefined') process.exitCode = 1;
  return { passed: passedSearch, failed: failedSearch };
}

if (runningInNode) module.exports = { runSearchSecurityTests };
runSearchSecurityTests();
})();
