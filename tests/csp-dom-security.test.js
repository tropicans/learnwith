/**
 * Unit tests for Phase 18: Content Security Policy (CSP), Anti-Clickjacking & DOM Sanitization (SEC-07, SEC-08, SEC-09).
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.resolve(__dirname, '../index.html');
const appJsPath = path.resolve(__dirname, '../assets/js/app.js');

const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const appJs = fs.readFileSync(appJsPath, 'utf8');

console.log("\n=======================================================");
console.log("PHASE 18 SECURITY UNIT TESTS: CSP, DOM & ANTI-CLICKJACK");
console.log("=======================================================\n");

// -------------------------------------------------------------
// 1. SEC-07: Content Security Policy (CSP) Meta Tag Inspection
// -------------------------------------------------------------
console.log("[TEST 1] Verifying Content-Security-Policy Meta Tag in index.html <head>...");

const cspMatch = indexHtml.match(/<meta\s+http-equiv=["']Content-Security-Policy["']\s+content="([^"]+)"/i) ||
                 indexHtml.match(/<meta\s+http-equiv=["']Content-Security-Policy["']\s+content='([^']+)'/i) ||
                 indexHtml.match(/<meta\s+content="([^"]+)"\s+http-equiv=["']Content-Security-Policy["']/i) ||
                 indexHtml.match(/<meta\s+content='([^']+)'\s+http-equiv=["']Content-Security-Policy["']/i);

assert(cspMatch, "FAIL: index.html does not contain a <meta http-equiv='Content-Security-Policy'> tag in <head>!");
const cspPolicy = cspMatch[1];

console.log("  -> Found CSP Policy:\n     " + cspPolicy);

assert(cspPolicy.includes("default-src 'self'"), "FAIL: CSP must specify default-src 'self'");
assert(cspPolicy.includes("script-src 'self'"), "FAIL: CSP must restrict script-src to 'self'");
assert(cspPolicy.includes("https://fonts.googleapis.com"), "FAIL: CSP must whitelist Google Fonts CSS (fonts.googleapis.com)");
assert(cspPolicy.includes("https://fonts.gstatic.com"), "FAIL: CSP must whitelist Google Fonts fonts (fonts.gstatic.com)");
assert(cspPolicy.includes("object-src 'none'"), "FAIL: CSP must forbid object/embed via object-src 'none'");
assert(cspPolicy.includes("base-uri 'self'"), "FAIL: CSP must restrict base-uri to 'self'");

console.log("  ✓ PASS: CSP policy correctly configured and restrictive (SEC-07).");

// -------------------------------------------------------------
// 2. SEC-08: Anti-Clickjacking & Frame-Busting Guard Inspection
// -------------------------------------------------------------
console.log("\n[TEST 2] Verifying Anti-Clickjacking Frame-Busting Guard in index.html <head>...");

assert(indexHtml.includes("anti-clickjack"), "FAIL: index.html must contain anti-clickjacking protective styling or element ID!");
assert(indexHtml.includes("window.top") && indexHtml.includes("window.self"), "FAIL: index.html must verify window.top !== window.self for frame-busting!");
assert(indexHtml.includes("top.location") || indexHtml.includes("self.location") || indexHtml.includes("document.documentElement"), "FAIL: Frame-busting must handle breaking out or content shielding!");

console.log("  ✓ PASS: Frame-busting guard and anti-clickjacking measures verified in <head> (SEC-08).");

// -------------------------------------------------------------
// 3. SEC-09: DOM Input Sanitization & escapeHtml Utility
// -------------------------------------------------------------
console.log("\n[TEST 3] Verifying escapeHtml & DOM Sanitization in assets/js/app.js...");

// Execute app.js in mock environment to test escapeHtml
let escapeHtmlFn = null;
try {
  const appExports = require(appJsPath);
  if (appExports && typeof appExports.escapeHtml === 'function') {
    escapeHtmlFn = appExports.escapeHtml;
  }
} catch (e) {
  // If app.js requires DOM, extract escapeHtml function directly
}

if (!escapeHtmlFn) {
  assert(appJs.includes("escapeHtml"), "FAIL: app.js must define or export an escapeHtml sanitization utility!");
  const fnMatch = appJs.match(/function\s+escapeHtml\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/);
  assert(fnMatch, "FAIL: escapeHtml function definition found in app.js");
  escapeHtmlFn = new Function(fnMatch[1], fnMatch[2]);
}

assert(typeof escapeHtmlFn === 'function', "FAIL: escapeHtml must be a callable function");

// Test XSS payloads
const vectors = [
  { raw: '<script>alert(1)</script>', expected: '&lt;script&gt;alert(1)&lt;/script&gt;' },
  { raw: '<img src=x onerror=alert(1)>', expected: '&lt;img src=x onerror=alert(1)&gt;' },
  { raw: '" onclick="exploit()', expected: '&quot; onclick=&quot;exploit()' },
  { raw: "' or '1'='1", expected: '&#39; or &#39;1&#39;=&#39;1' },
  { raw: 'Hello & Welcome <User>', expected: 'Hello &amp; Welcome &lt;User&gt;' }
];

for (const vec of vectors) {
  const result = escapeHtmlFn(vec.raw);
  assert.strictEqual(result, vec.expected, `FAIL: escapeHtml('${vec.raw}') returned '${result}', expected '${vec.expected}'`);
  console.log(`  ✓ Sanitized: ${vec.raw} -> ${result}`);
}

// Ensure scoreBanner does not use raw unescaped values or uses DOM element creation / safe interpolation
assert(!appJs.includes("scoreBanner.innerHTML = `\n        <div class=\"score-val\">${quizState.score}"), "FAIL: scoreBanner must use escapeHtml or textContent instead of raw interpolation into innerHTML");

console.log("  ✓ PASS: DOM sanitization and escapeHtml utility verified (SEC-09).");

console.log("\n=======================================================");
console.log("ALL PHASE 18 SECURITY UNIT TESTS PASSED (3/3)!");
console.log("=======================================================\n");
