---
slug: 260907-nlm-frontpage-default-html
title: "Set NotebookLM Frontpage as Default HTML State & Fix Critical CSS Selectors"
status: in-progress
date: 2026-09-07
---

# Quick Task: Set NotebookLM Frontpage as Default HTML State & Fix Critical CSS Selectors

## Problem
1. When opening `https://learnwith.yudhiar.fun`, the user still sees Course 1 because:
   - In `index.html`, `#container-home` had inline `style="display: none;"`, while `#container-course-ai` had no `display: none`.
   - `.app-container` lacked `view-home` by default in static HTML, causing Course 1 to render on first paint before JS executes.
   - In `assets/css/main.css`, `.view-home .app-container` was used instead of `.app-container.view-home`, so the full-width grid layout rule was ignored.
   - Assets needed a cache-busting bump to `?v=2.2.0`.

## Plan
1. In `index.html`:
   - Set `<div class="app-container view-home">`.
   - Embed critical `.app-container.view-home` rules in `<head>` `<style>`.
   - Make `#container-home` visible by default in HTML (remove `style="display: none;"`).
   - Set `#container-course-ai` to `style="display: none;"` by default in HTML.
   - Bump asset versions to `?v=2.2.0`.
2. In `assets/css/main.css`:
   - Fix `.app-container.view-home` selectors.
3. In `assets/js/app.js`:
   - Ensure initial routing cleanly handles default home and course query params without flash.
4. Verify with Playwright test suite (`python scratch/test_integration.py`).
