/**
 * Wave 0 Automated Test Suite for Course 2 Bab V
 * Interactive Knowledge Quiz, Rubrik Evaluasi & Laporan Kelulusan BPSDM
 * Requirements: QUIZ-01, QUIZ-02, QUIZ-03, WORD-RPT-01, WORD-RPT-02, GATEWAY-03
 */
const assert = require('assert');

(function () {
  if (typeof window === 'undefined') global.window = {};
  if (typeof localStorage === 'undefined') {
    global.localStorage = {
      _data: {},
      getItem(key) { return Object.prototype.hasOwnProperty.call(this._data, key) ? this._data[key] : null; },
      setItem(key, value) { this._data[key] = String(value); },
      removeItem(key) { delete this._data[key]; },
      clear() { this._data = {}; }
    };
  }

  // Lightweight mock element helper
  const createMockElement = (id, tag = 'div', extra = {}) => {
    const classes = new Set(extra.classes || []);
    const attrs = Object.assign({}, extra.attrs || {});
    const children = [];
    const el = {
      id,
      tagName: tag.toUpperCase(),
      style: { display: '', width: '', borderColor: '' },
      classList: {
        add(c) { classes.add(c); },
        remove(c) { classes.delete(c); },
        toggle(c, force) {
          if (force === undefined) {
            if (classes.has(c)) classes.delete(c); else classes.add(c);
          } else if (force) classes.add(c); else classes.delete(c);
        },
        contains(c) { return classes.has(c); }
      },
      setAttribute(name, val) { attrs[name] = String(val); },
      getAttribute(name) { return attrs[name] !== undefined ? attrs[name] : null; },
      hasAttribute(name) { return attrs[name] !== undefined; },
      removeAttribute(name) { delete attrs[name]; },
      textContent: '',
      innerText: '',
      value: '',
      checked: false,
      children,
      appendChild(child) {
        children.push(child);
        child.parentElement = el;
        return child;
      },
      closest(selector) {
        if (selector === '.card' || selector === '.quiz-card') return this;
        return this.parentElement ? this.parentElement.closest(selector) : null;
      },
      querySelectorAll(selector) {
        const matches = [];
        function walk(node) {
          for (const c of node.children) {
            if (selector === '.quiz-option-btn' && c.classList.contains('quiz-option-btn')) matches.push(c);
            if (selector === '.btn-quiz-option' && c.classList.contains('btn-quiz-option')) matches.push(c);
            if (selector === '.quiz-explanation-box' && c.classList.contains('quiz-explanation-box')) matches.push(c);
            walk(c);
          }
        }
        walk(this);
        return matches;
      },
      querySelector(selector) {
        const res = this.querySelectorAll(selector);
        return res.length > 0 ? res[0] : null;
      },
      addEventListener(event, fn) {}
    };
    return el;
  };

  if (typeof document === 'undefined' || !document.getElementById) {
    const mockElements = {
      'sec-word-quiz': createMockElement('sec-word-quiz'),
      'sec-word-rubrik': createMockElement('sec-word-rubrik'),
      'sec-word-report': createMockElement('sec-word-report'),
      'bpsdm-certificate-card': createMockElement('bpsdm-certificate-card'),
      'card-word-bpsdm-certificate': createMockElement('card-word-bpsdm-certificate'),
      'word-quiz-score-banner': createMockElement('word-quiz-score-banner'),
      'banner-word-quiz-score': createMockElement('banner-word-quiz-score'),
      'btn-reset-word-quiz': createMockElement('btn-reset-word-quiz', 'button'),
      'word-report-output-preview': createMockElement('word-report-output-preview'),
      'preview-word-report-text': createMockElement('preview-word-report-text'),
      'btn-copy-word-report-wa': createMockElement('btn-copy-word-report-wa', 'button'),
      'btn-copy-word-wa': createMockElement('btn-copy-word-wa', 'button'),
      'btn-copy-word-report-tg': createMockElement('btn-copy-word-report-tg', 'button'),
      'btn-copy-word-tg': createMockElement('btn-copy-word-tg', 'button'),
      'btn-print-word-report': createMockElement('btn-print-word-report', 'button'),
      'badge-nav-word-quiz': createMockElement('badge-nav-word-quiz'),
      'badge-nav-word-rubrik': createMockElement('badge-nav-word-rubrik'),
      'status-nav-word-report': createMockElement('status-nav-word-report')
    };

    // Populate question card mocks 1..20
    for (let i = 1; i <= 20; i++) {
      const qCard = createMockElement(`quiz-card-${i}`, 'article', { classes: ['quiz-card'] });
      ['A', 'B', 'C', 'D'].forEach(opt => {
        const btn = createMockElement(`btn-q${i}-${opt.toLowerCase()}`, 'button', { classes: ['quiz-option-btn', 'btn-quiz-option'] });
        btn.setAttribute('data-question-id', String(i));
        btn.setAttribute('data-option', opt);
        qCard.appendChild(btn);
      });
      const exp = createMockElement(`exp-quiz-q${i}`, 'div', { classes: ['quiz-explanation-box'] });
      qCard.appendChild(exp);
      mockElements[`quiz-card-${i}`] = qCard;
      mockElements[`card-quiz-q${i}`] = qCard;
    }

    // Populate reflection textareas
    ['ref-repetitive', 'ref-challenging', 'ref-template', 'ref-risks', 'ref-collaboration'].forEach(id => {
      mockElements[id] = createMockElement(id, 'textarea');
      mockElements[`input-word-${id}`] = createMockElement(`input-word-${id}`, 'textarea');
    });

    // Populate Lampiran 3 and 5 checkboxes
    const chkKeys = [
      'word-chk-headings', 'word-chk-toc', 'word-chk-section-link', 'word-chk-page-num',
      'word-chk-mailmerge-valid', 'word-chk-mergefield-clean', 'word-chk-track-decided',
      'word-chk-comments-resolved', 'word-chk-sharing-inspected',
      'word-port-structure', 'word-port-multisection', 'word-port-template',
      'word-port-merge', 'word-port-review', 'word-port-qa-log'
    ];
    chkKeys.forEach(k => {
      mockElements[`chk-${k}`] = createMockElement(`chk-${k}`, 'input');
    });

    // Populate participant form inputs
    mockElements['input-word-participant-name'] = createMockElement('input-word-participant-name', 'input');
    mockElements['input-word-participant-nip'] = createMockElement('input-word-participant-nip', 'input');
    mockElements['input-word-participant-unit'] = createMockElement('input-word-participant-unit', 'input');
    mockElements['input-word-target-doc'] = createMockElement('input-word-target-doc', 'input');
    mockElements['input-word-report-date'] = createMockElement('input-word-report-date', 'input');

    mockElements['input-word-report-name'] = mockElements['input-word-participant-name'];
    mockElements['input-word-report-nip'] = mockElements['input-word-participant-nip'];
    mockElements['input-word-report-unit'] = mockElements['input-word-participant-unit'];
    mockElements['input-word-report-doc'] = mockElements['input-word-target-doc'];

    global.document = {
      getElementById(id) {
        return mockElements[id] || null;
      },
      querySelectorAll(selector) {
        return [];
      }
    };
  }

  // Load modules
  const { StateManager, WORD_DEFAULT_STATE, WORD_QUIZ_QUESTIONS } = require('../assets/js/state.js');
  const appModule = require('../assets/js/app.js');
  const generateWordReportText = appModule.generateWordReportText || window.generateWordReportText;

  let passedTests = 0;
  let failedTests = 0;

  function runTest(name, fn) {
    try {
      fn();
      console.log(`  ✓ PASS: ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`  ✕ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failedTests++;
    }
  }

  console.log('\n--- STARTING COURSE 2 (BAB V QUIZ, RUBRIK & LAPORAN) TESTS ---');

  // SUITE 1: Bab V Question Bank Integrity
  console.log('\n[Suite 1: Bab V Question Bank Integrity]');
  const expectedKeys = {
    1: 'B', 2: 'B', 3: 'C', 4: 'B', 5: 'C',
    6: 'A', 7: 'B', 8: 'B', 9: 'C', 10: 'B',
    11: 'A', 12: 'B', 13: 'A', 14: 'B', 15: 'B',
    16: 'B', 17: 'A', 18: 'A', 19: 'B', 20: 'B'
  };

  runTest('WORD_QUIZ_QUESTIONS is defined and has exactly 20 items', () => {
    assert(Array.isArray(WORD_QUIZ_QUESTIONS), 'WORD_QUIZ_QUESTIONS should be an array');
    assert.strictEqual(WORD_QUIZ_QUESTIONS.length, 20, `Expected 20 questions, got ${WORD_QUIZ_QUESTIONS.length}`);
  });

  runTest('Each question contains valid id, question text, 4 options (A-D), correct key, and non-empty explanation', () => {
    WORD_QUIZ_QUESTIONS.forEach((q, idx) => {
      const qNum = idx + 1;
      assert.strictEqual(q.id, qNum, `Question ${qNum} has invalid ID: ${q.id}`);
      assert(typeof q.question === 'string' && q.question.trim().length > 5, `Question ${qNum} text is empty`);
      assert(q.options && typeof q.options === 'object', `Question ${qNum} options missing`);
      ['A', 'B', 'C', 'D'].forEach(opt => {
        assert(typeof q.options[opt] === 'string' && q.options[opt].trim().length > 0, `Question ${qNum} option ${opt} missing`);
      });
      assert.strictEqual(q.correct, expectedKeys[qNum], `Question ${qNum} expected key ${expectedKeys[qNum]}, got ${q.correct}`);
      assert(typeof q.explanation === 'string' && q.explanation.trim().length > 10, `Question ${qNum} explanation empty or too short`);
    });
  });

  // SUITE 2: Interactive Scoring & State Transitions
  console.log('\n[Suite 2: Interactive Scoring & State Transitions]');
  let testManager;

  runTest('WORD_DEFAULT_STATE initializes quiz, reflections, and rubric sub-objects', () => {
    assert(WORD_DEFAULT_STATE.quiz, 'quiz object missing in WORD_DEFAULT_STATE');
    assert.deepStrictEqual(WORD_DEFAULT_STATE.quiz.answers, {});
    assert.strictEqual(WORD_DEFAULT_STATE.quiz.score, 0);
    assert.strictEqual(WORD_DEFAULT_STATE.quiz.passed, false);
    assert.strictEqual(WORD_DEFAULT_STATE.quiz.submitted, false);

    assert(WORD_DEFAULT_STATE.reflections, 'reflections object missing in WORD_DEFAULT_STATE');
    assert(WORD_DEFAULT_STATE.rubric, 'rubric object missing in WORD_DEFAULT_STATE');
  });

  runTest('updateQuizAnswer updates state, recalculates score and passed threshold', () => {
    localStorage.clear();
    testManager = new StateManager('word');
    testManager.setCourse('word');

    // Answer question 1 correctly (B)
    testManager.updateQuizAnswer(1, 'B');
    let state = testManager.getState();
    assert.strictEqual(state.quiz.answers[1], 'B');
    assert.strictEqual(state.quiz.score, 5); // 1 correct * 5 = 5
    assert.strictEqual(state.quiz.passed, false); // < 80

    // Answer question 2 incorrectly (A, correct is B)
    testManager.updateQuizAnswer(2, 'A');
    state = testManager.getState();
    assert.strictEqual(state.quiz.answers[2], 'A');
    assert.strictEqual(state.quiz.score, 5); // Still 5

    // Answer 15 more questions correctly (16 total correct = 80 points)
    for (let i = 3; i <= 17; i++) {
      testManager.updateQuizAnswer(i, expectedKeys[i]);
    }
    state = testManager.getState();
    assert.strictEqual(state.quiz.score, 80);
    assert.strictEqual(state.quiz.passed, true); // >= 80

    // Answer remaining 3 questions correctly (19 total = 95 points)
    for (let i = 18; i <= 20; i++) {
      testManager.updateQuizAnswer(i, expectedKeys[i]);
    }
    state = testManager.getState();
    assert.strictEqual(state.quiz.score, 95);
    assert.strictEqual(state.quiz.passed, true);
  });

  runTest('resetQuiz restores clean quiz state (0 score, empty answers, passed false)', () => {
    testManager.resetQuiz();
    const state = testManager.getState();
    assert.deepStrictEqual(state.quiz.answers, {});
    assert.strictEqual(state.quiz.score, 0);
    assert.strictEqual(state.quiz.passed, false);
    assert.strictEqual(state.quiz.submitted, false);
  });

  // SUITE 3: Self-Reflection & Competency Rubric Engine
  console.log('\n[Suite 3: Self-Reflection & Competency Rubric Engine]');

  runTest('updateWordReflection persists reflection responses', () => {
    testManager.updateWordReflection('ref-repetitive', 'Styles dan TOC otomatis menghemat waktu.');
    testManager.updateWordReflection('ref-challenging', 'Section breaks dan Unlink Header perlu kehati-hatian.');
    const state = testManager.getState();
    assert.strictEqual(state.reflections['ref-repetitive'], 'Styles dan TOC otomatis menghemat waktu.');
    assert.strictEqual(state.reflections['ref-challenging'], 'Section breaks dan Unlink Header perlu kehati-hatian.');
  });

  runTest('updateWordRubric persists Lampiran 3 quality and Lampiran 5 portfolio checks', () => {
    testManager.updateWordRubric('word-chk-headings', true);
    testManager.updateWordRubric('word-chk-toc', true);
    testManager.updateWordRubric('word-port-structure', true);
    testManager.updateWordRubric('word-port-multisection', true);

    const state = testManager.getState();
    assert.strictEqual(state.rubric['word-chk-headings'], true);
    assert.strictEqual(state.rubric['word-chk-toc'], true);
    assert.strictEqual(state.rubric['word-port-structure'], true);
    assert.strictEqual(state.rubric['word-port-multisection'], true);
  });

  runTest('calculateWordGraduation accurately computes 70% Practice + 30% Quiz and assigns BPSDM predicate', () => {
    // Case 1: Initial state (all checkpoints pending, 0 quiz, 0 portfolio)
    const portKeys = ['word-port-structure', 'word-port-multisection', 'word-port-template', 'word-port-merge', 'word-port-review', 'word-port-qa-log'];
    portKeys.forEach(k => testManager.updateWordRubric(k, false));
    let grad = testManager.calculateWordGraduation();
    assert.strictEqual(grad.finalScore, 0);
    assert.strictEqual(grad.status, 'remediasi');

    // Set all checkpoints passed
    testManager.updateCheckpoint('word-cp-1', 'passed');
    testManager.updateCheckpoint('word-cp-2', 'passed');
    testManager.updateCheckpoint('word-cp-3', 'passed');

    // Perfect Quiz: 100/100
    for (let i = 1; i <= 20; i++) {
      testManager.updateQuizAnswer(i, expectedKeys[i]);
    }

    // Complete all 6 portfolio items in rubric
    portKeys.forEach(k => testManager.updateWordRubric(k, true));

    grad = testManager.calculateWordGraduation();
    assert.strictEqual(grad.quizScore, 100);
    assert.strictEqual(grad.portfolioScore, 100);
    assert.strictEqual(grad.finalScore, 100);
    assert.strictEqual(grad.status, 'lulus');
    assert(grad.label.includes('KOMPETEN (LULUS)'));
    assert(grad.grade.includes('Sangat Memuaskan (A)'));

    // Case 2: Partial portfolio (3 of 6 = 50%), Quiz 80%
    portKeys.slice(3).forEach(k => testManager.updateWordRubric(k, false)); // 3 passed
    testManager.updateQuizAnswer(1, 'A');
    testManager.updateQuizAnswer(2, 'A');
    testManager.updateQuizAnswer(3, 'A');
    testManager.updateQuizAnswer(4, 'A'); // 16 correct = 80%

    grad = testManager.calculateWordGraduation();
    // Portfolio: 3/6 = 50%, Quiz: 80%
    // Final: (50 * 0.7) + (80 * 0.3) = 35 + 24 = 59 < 75 -> remediasi
    assert.strictEqual(grad.finalScore, 59);
    assert.strictEqual(grad.status, 'remediasi');

    // Case 3: Checkpoint failure overrides scores
    testManager.updateCheckpoint('word-cp-1', 'failed');
    grad = testManager.calculateWordGraduation();
    assert.strictEqual(grad.status, 'remediasi');
    assert(grad.label.includes('PERLU REMEDIASI'));
  });

  // SUITE 4: BPSDM Graduation Report Generation
  console.log('\n[Suite 4: BPSDM Graduation Report Generation]');

  runTest('generateWordReportText produces formatted WhatsApp output with all data points', () => {
    assert(typeof generateWordReportText === 'function', 'generateWordReportText should be a function');

    const overrides = {
      name: 'Ahmad Fauzi, S.Kom',
      nip: '198501012010011005',
      unitKerja: 'Diskominfotik DKI Jakarta',
      targetDoc: 'SOP Pelayanan Informasi Publik',
      reportDate: '7 September 2026',
      checkpoints: {
        'word-cp-1': 'passed',
        'word-cp-2': 'passed',
        'word-cp-3': 'passed'
      },
      quizScore: 90,
      portfolioScore: 100,
      finalScore: 93,
      statusLabel: 'KOMPETEN (LULUS)'
    };

    const waText = generateWordReportText('whatsapp', overrides);
    assert(waText.includes('*LAPORAN HASIL EVALUASI & KELULUSAN PELATIHAN*'), 'Missing title in WA text');
    assert(waText.includes('Ahmad Fauzi, S.Kom'), 'Missing participant name');
    assert(waText.includes('198501012010011005'), 'Missing participant NIP');
    assert(waText.includes('Diskominfotik DKI Jakarta'), 'Missing unit kerja');
    assert(waText.includes('[X] Checkpoint 1'), 'Missing passed Checkpoint 1 mark');
    assert(waText.includes('[X] Checkpoint 2'), 'Missing passed Checkpoint 2 mark');
    assert(waText.includes('[X] Checkpoint 3'), 'Missing passed Checkpoint 3 mark');
    assert(waText.includes('90 / 100'), 'Missing quiz score in WA text');
    assert(waText.includes('93 / 100'), 'Missing final score in WA text');
    assert(waText.includes('KOMPETEN (LULUS)'), 'Missing competency verdict in WA text');
  });

  runTest('generateWordReportText produces formatted Telegram Markdown output with backtick checkpoints', () => {
    const overrides = {
      name: 'Siti Rahmawati, S.AP',
      nip: '199002142015022001',
      unitKerja: 'BPSDM DKI Jakarta',
      targetDoc: 'Nota Dinas Standardisasi Pelatihan',
      reportDate: '7 September 2026',
      checkpoints: {
        'word-cp-1': 'passed',
        'word-cp-2': 'passed',
        'word-cp-3': 'pending'
      },
      quizScore: 85,
      portfolioScore: 80,
      finalScore: 82,
      statusLabel: 'KOMPETEN (LULUS)'
    };

    const tgText = generateWordReportText('telegram', overrides);
    assert(tgText.includes('LAPORAN HASIL EVALUASI & KELULUSAN PELATIHAN'), 'Missing Telegram title');
    assert(tgText.includes('Siti Rahmawati, S.AP'), 'Missing Telegram name');
    assert(tgText.includes('`[X]` Checkpoint 1'), 'Missing backtick passed checkpoint');
    assert(tgText.includes('`[ ]` Checkpoint 3'), 'Missing backtick pending checkpoint');
    assert(tgText.includes('`85 / 100`'), 'Missing Telegram quiz score');
    assert(tgText.includes('`82 / 100`'), 'Missing Telegram final score');
  });

  // SUITE 5: Multi-Channel Exporter & DOM Fixture Integrity
  console.log('\n[Suite 5: Multi-Channel Exporter & DOM Fixture Integrity]');

  runTest('Required DOM section fixtures exist for Bab V and BPSDM report', () => {
    assert(document.getElementById('sec-word-quiz'), '#sec-word-quiz missing');
    assert(document.getElementById('sec-word-rubrik'), '#sec-word-rubrik missing');
    assert(document.getElementById('sec-word-report'), '#sec-word-report missing');
    assert(document.getElementById('bpsdm-certificate-card') || document.getElementById('card-word-bpsdm-certificate'), 'BPSDM certificate card missing');
    assert(document.getElementById('word-quiz-score-banner') || document.getElementById('banner-word-quiz-score'), 'Quiz score banner missing');
    assert(document.getElementById('btn-reset-word-quiz'), '#btn-reset-word-quiz missing');
    assert(document.getElementById('word-report-output-preview') || document.getElementById('preview-word-report-text'), 'Report preview box missing');
    assert(document.getElementById('btn-copy-word-report-wa') || document.getElementById('btn-copy-word-wa'), 'Copy WA button missing');
    assert(document.getElementById('btn-copy-word-report-tg') || document.getElementById('btn-copy-word-tg'), 'Copy TG button missing');
    assert(document.getElementById('btn-print-word-report'), 'Print button missing');
  });

  // SUITE 6: Multi-Course State Isolation & Progress Invariants
  console.log('\n[Suite 6: Multi-Course State Isolation & Progress Invariants]');

  runTest('Course 2 calculateProgress strictly asserts 28 checklist tasks and 3 checkpoints', () => {
    const cleanWordManager = new StateManager('word');
    cleanWordManager.setCourse('word');
    const prog = cleanWordManager.calculateProgress();
    assert.strictEqual(prog.totalTasks, 28, `Expected 28 tasks, got ${prog.totalTasks}`);
    assert.strictEqual(prog.totalCheckpoints, 3, `Expected 3 checkpoints, got ${prog.totalCheckpoints}`);
  });

  runTest('Phase 12 state persists strictly to learnwith_word_state_v1 with zero pollution of learnwith_ai_state_v1', () => {
    const rawWord = localStorage.getItem('learnwith_word_state_v1');
    assert(rawWord, 'learnwith_word_state_v1 should exist in localStorage');
    const parsedWord = JSON.parse(rawWord);
    assert(parsedWord.quiz, 'quiz missing in learnwith_word_state_v1');
    assert(parsedWord.reflections, 'reflections missing in learnwith_word_state_v1');
    assert(parsedWord.rubric, 'rubric missing in learnwith_word_state_v1');

    const rawAi = localStorage.getItem('learnwith_ai_state_v1');
    if (rawAi) {
      const parsedAi = JSON.parse(rawAi);
      assert.strictEqual(parsedAi.quiz, undefined, 'learnwith_ai_state_v1 should NOT have quiz property');
      assert.strictEqual(parsedAi.rubric, undefined, 'learnwith_ai_state_v1 should NOT have rubric property');
      assert.strictEqual(parsedAi.reflections, undefined, 'learnwith_ai_state_v1 should NOT have reflections property');
    }
  });

  console.log(`\nTEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED\n`);
  if (failedTests > 0) {
    process.exit(1);
  }
})();
