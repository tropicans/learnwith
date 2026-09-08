# Phase 18: Content Security Policy, DOM Sanitization & Anti-Clickjacking - Research

**Researched:** 2026-09-07  
**Domain:** Web Application Security, CSPSpecification, Frame-Busting / Clickjacking Defense, DOM XSS Sanitization  
**Confidence:** HIGH

&lt;phase_requirements&gt;
 ## Phase Requirements 

 | ID | Description | Research Support |
 |----|-----------|------------------|
 | SEC-07 | Pemasangan header meta Content Security Policy (CSP) ketat di `<head>` untuk mengecah injeksi skrip asing, cross-site scripting (XSS), dan muatan konten eksternal tidak terpercaya. | Audited all external assets in `index.html`. Only Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) and local scripts/styles are loaded. Designed strict CSP meta tag compatible with static file origin and local web server. |
 | SEC-08 | Pelindung anti-clickjacking (frame-busting guard) memastikan platform `learnwith` tidak dapat disusupi atau dimanipulasi di dalam `<iframe>` situs web jahat. | Evaluated CSP `frame-ancestors` (HTTP header limitation under file:// or meta tags where frame-ancestors is ignored in meta) vs client-side JavaScript frame-busting. Combined both for defense-in-depth. |
  | SEC-09 | Audit sanitasi DOM input: seluruh input pengguna (nama peserta, NIP, instansi, kuis, dan pencarian) wajib diproses secara aman menggunakan sanitasi karakter atau `textContent` murni, menjamin 0% celah DOM-based XSS. | Audited all dynamic DOM write locations across `spec.js', `app.js`, `search.js`, and `state.js`. Verified all user inputs already use `safe textContent` or `greeting/inerText`, designed centralized `escapeHtml` utility and replaced innerHTML writes in quiz banner with strict sanitized DMO. |
&lt;/phase_requirements&gt;


## 1. Executive Summary

Phase 18 completes Milestone v2.2 (Application Security Hardening & Anti-Breach Protection) by establishing robust defense-in-depth against client-side injection vectors:
1. **Content Security Policy (SEC-07)**: Strict CSP meta tag in <head>.
2. **Anti-Clickjacking (SEC-08)**: Frame-busting guard preventing iframe hijacking.
3. **DOM Sanitization Audit (SEC-09)**: Zero DOM Hash XSS vulnerabilities across all inputs.


## 2. Technical Approach

### A. CSP Policy
-`default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self' https://generativelanguage.googleapis.com https://api.telegram.org; object-src 'none'; base-uri 'self';`

### B. Frame-Busting
- JavaScript guard in <head> that detects whether window.self !== window.top, rescuing the viewport or hiding content until unframed.

### C. DOM Sanitization
- Centralized window.escapeHtml() utility and audit of search, quiz, and certificate reporting.