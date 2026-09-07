/**
 * Unit & Integration Tests for Phase 17:
 * URL Gate Hardening, Session Management & Anti-Tampering (SEC-05, SEC-06).
 */
const assert = require('assert');
const crypto = require('crypto');

// Simulated Browser Environment
function setupMockBrowser(initialSearch = '', initialHash = '') {
  const sessionStorageMock = {
    _data: {},
    getItem(k) { return Object.prototype.hasOwnProperty.call(this._data, k) ? this._data[k] : null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
    clear() { this._data = {}; }
  };

  const localStorageMock = {
    _data: {},
    getItem(k) { return Object.prototype.hasOwnProperty.call(this._data, k) ? this._data[k] : null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
    clear() { this._data = {}; }
  };

  const historyCalls = [];
  const historyMock = {
    replaceState(state, title, url) {
      historyCalls.push({ state, title, url });
      if (url) {
        try {
          const parsed = new URL(url, 'https://learnwith.internal');
          locationMock.pathname = parsed.pathname;
          locationMock.search = parsed.search;
          locationMock.hash = parsed.hash;
          locationMock.href = parsed.href;
        } catch (e) {
          locationMock.search = '';
        }
      }
    }
  };

  const locationMock = {
    pathname: '/index.html',
    search: initialSearch,
    hash: initialHash,
    href: `https://learnwith.internal/index.html${initialSearch}${initialHash}`
  };

  const documentMock = {
    title: 'learnwith Platform',
    getElementById(id) {
      return {
        id,
        style: {},
        classList: { toggle: () => {}, add: () => {}, remove: () => {} },
        textContent: '',
        className: ''
      };
    },
    querySelectorAll() { return []; },
    addEventListener() {},
    removeEventListener() {}
  };

  global.window = {
    location: locationMock,
    history: historyMock,
    sessionStorage: sessionStorageMock,
    localStorage: localStorageMock,
    crypto: {
      subtle: {
        digest: async (algo, buffer) => {
          const hash = crypto.createHash('sha256').update(Buffer.from(buffer)).digest();
          return hash.buffer.slice(hash.byteOffset, hash.byteOffset + hash.byteLength);
        }
      }
    },
    LEARNWITH_CONFIG: {
      version: '2.2.0',
      security: {
        wordCourseLocked: true,
        sessionTimeoutMinutes: 15,
        allowedPasscodeHashes: [
          'ddf62f4013c59b111215312fb959629155a5b1dc5cf799f2053a8c2395c4511b', // buka-kata
          '487da33ab431e57b68afa84059c0e7a95818f99cd9581054026f224fc7bba174'  // kata-sandi-asn
        ]
      }
    }
  };

  global.document = documentMock;
  global.sessionStorage = sessionStorageMock;
  global.localStorage = localStorageMock;

  return { sessionStorageMock, localStorageMock, historyCalls, locationMock };
}

// Tests Runner
async function runTests() {
  console.log('\n--- STARTING SESSION SECURITY & URL HARDENING TESTS (SEC-05, SEC-06) ---');

  // Initialize mock browser environment before loading app.js
  setupMockBrowser();

  // Load app.js code
  const app = require('../assets/js/app.js');

  // -------------------------------------------------------------
  // Suite 1: URL Parameter Hardening & Legacy Bypass Rejection (SEC-05)
  // -------------------------------------------------------------
  console.log('\n[Suite 1: Legacy URL Parameter Bypass Rejection]');
  {
    const legacyBypasses = [
      '?unlock=dev',
      '?unlock=word',
      '?unlock=1',
      '?unlock=live',
      '?unlock=class',
      '?course=word&unlock=dev',
      '?unlock=INSTRUCTOR'
    ];

    for (const qs of legacyBypasses) {
      const { localStorageMock, sessionStorageMock } = setupMockBrowser(qs);
      
      if (app.SessionSecurityManager && typeof app.SessionSecurityManager.init === 'function') {
        await app.SessionSecurityManager.init();
      }

      const isLiveUnlocked = app.isLiveClassUnlocked();
      const isWordUnlocked = app.isWordCourseUnlocked();

      assert.strictEqual(
        isLiveUnlocked,
        false,
        `FAIL: Legacy URL ${qs} must NOT unlock live class`
      );
      assert.strictEqual(
        isWordUnlocked,
        false,
        `FAIL: Legacy URL ${qs} must NOT unlock Word course`
      );
      assert.strictEqual(
        localStorageMock.getItem('live_class_unlocked'),
        null,
        `FAIL: Legacy URL ${qs} must not write to localStorage live_class_unlocked`
      );
      assert.strictEqual(
        localStorageMock.getItem('learnwith_word_unlocked'),
        null,
        `FAIL: Legacy URL ${qs} must not write to localStorage learnwith_word_unlocked`
      );
      console.log(`  ✓ PASS: Rejected legacy bypass query: ${qs}`);
    }
  }

  // -------------------------------------------------------------
  // Suite 2: Authorized URL Passcode Validation & History Cleansing (SEC-05)
  // -------------------------------------------------------------
  console.log('\n[Suite 2: Authorized Passcode URL Validation & History Cleansing]');
  {
    // Valid passcode in URL: ?code=buka-kata
    const { historyCalls, locationMock } = setupMockBrowser('?code=buka-kata');

    if (app.SessionSecurityManager && typeof app.SessionSecurityManager.init === 'function') {
      await app.SessionSecurityManager.init();
    }

    const isWordUnlocked = app.isWordCourseUnlocked();
    assert.strictEqual(isWordUnlocked, true, 'FAIL: Valid passcode in URL should unlock Word course');
    assert.strictEqual(historyCalls.length > 0, true, 'FAIL: history.replaceState must be called to cleanse URL');
    assert.strictEqual(locationMock.search, '', 'FAIL: URL query string must be empty after cleansing');
    console.log('  ✓ PASS: Authorized ?code=buka-kata unlocks course and URL is immediately cleansed');

    // Invalid passcode in URL: ?code=sandi-palsu
    const mock2 = setupMockBrowser('?code=sandi-palsu');
    if (app.SessionSecurityManager && typeof app.SessionSecurityManager.init === 'function') {
      await app.SessionSecurityManager.init();
    }
    const isWordUnlockedInvalid = app.isWordCourseUnlocked();
    assert.strictEqual(isWordUnlockedInvalid, false, 'FAIL: Invalid passcode in URL must not unlock course');
    assert.strictEqual(mock2.locationMock.search, '', 'FAIL: Invalid code query string must still be cleansed');
    console.log('  ✓ PASS: Unauthorized ?code=sandi-palsu rejected and URL query cleansed');
  }

  // -------------------------------------------------------------
  // Suite 3: Tab-Scoped Session Storage & Anti-Tampering Checksum (SEC-06)
  // -------------------------------------------------------------
  console.log('\n[Suite 3: Tab-Scoped Session Storage & Anti-Tampering]');
  {
    const { sessionStorageMock, localStorageMock } = setupMockBrowser();

    // Normal unlock through programmatic setter
    await app.setWordCourseUnlocked(true);

    const isUnlocked = app.isWordCourseUnlocked();
    assert.strictEqual(isUnlocked, true, 'FAIL: Course should be unlocked after setWordCourseUnlocked(true)');

    // Ensure it is stored in sessionStorage and NOT localStorage
    const rawSession = sessionStorageMock.getItem('lw_session_word');
    assert.notStrictEqual(rawSession, null, 'FAIL: Session token must be stored in sessionStorage');
    assert.strictEqual(localStorageMock.getItem('learnwith_word_unlocked'), null, 'FAIL: Must not store plain flag in localStorage');

    const sessionObj = JSON.parse(rawSession);
    assert.strictEqual(sessionObj.unlocked, true);
    assert.strictEqual(typeof sessionObj.checksum, 'string');
    assert.strictEqual(sessionObj.checksum.length, 64, 'Checksum must be 64-char hex SHA-256');
    console.log('  ✓ PASS: Session token is tab-scoped with SHA-256 integrity checksum');

    // Anti-tampering check: Modify expiry or course or unlocked state manually in sessionStorage
    const tampered = { ...sessionObj, expiresAt: sessionObj.expiresAt + 1000000 };
    sessionStorageMock.setItem('lw_session_word', JSON.stringify(tampered));

    const isUnlockedAfterTampering = app.isWordCourseUnlocked();
    assert.strictEqual(isUnlockedAfterTampering, false, 'FAIL: Tampered session token MUST be rejected and locked');
    console.log('  ✓ PASS: Anti-tampering detected modified token and rejected unauthorized access');

    // Fake token injected without valid seed checksum
    sessionStorageMock.setItem('lw_session_word', JSON.stringify({
      unlocked: true,
      course: 'word',
      unlockedAt: Date.now(),
      expiresAt: Date.now() + 60000,
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    }));
    assert.strictEqual(app.isWordCourseUnlocked(), false, 'FAIL: Forged checksum without in-memory seed must be rejected');
    console.log('  ✓ PASS: Forged checksum without session seed rejected');
  }

  // -------------------------------------------------------------
  // Suite 4: Inactivity Timeout & Auto-Lock (SEC-06)
  // -------------------------------------------------------------
  console.log('\n[Suite 4: Inactivity Timeout & Auto-Lock]');
  {
    const { sessionStorageMock } = setupMockBrowser();

    await app.setWordCourseUnlocked(true);
    assert.strictEqual(app.isWordCourseUnlocked(), true);

    // Simulate token with past expiration
    const rawSession = JSON.parse(sessionStorageMock.getItem('lw_session_word'));
    // Generate valid checksum for an already-expired timestamp
    const expiredToken = await app.SessionSecurityManager.createToken('word', Date.now() - 5000, Date.now() - 1000);
    sessionStorageMock.setItem('lw_session_word', JSON.stringify(expiredToken));

    assert.strictEqual(
      app.isWordCourseUnlocked(),
      false,
      'FAIL: Expired session token must be treated as locked'
    );
    console.log('  ✓ PASS: Expired session token automatically locks module');

    // Test explicit autoLock trigger
    await app.setWordCourseUnlocked(true);
    await app.setLiveClassUnlocked(true);
    assert.strictEqual(app.isWordCourseUnlocked(), true);
    assert.strictEqual(app.isLiveClassUnlocked(), true);

    app.SessionSecurityManager.triggerAutoLock('test_inactivity');
    assert.strictEqual(app.isWordCourseUnlocked(), false, 'FAIL: Word course must be locked after auto-lock trigger');
    assert.strictEqual(app.isLiveClassUnlocked(), false, 'FAIL: Live class must be locked after auto-lock trigger');
    console.log('  ✓ PASS: Auto-lock trigger cleanly clears all course session tokens');
  }

  console.log('\n--- ALL SESSION SECURITY & URL HARDENING TESTS PASSED! ---');
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILED:\n', err);
  process.exit(1);
});
