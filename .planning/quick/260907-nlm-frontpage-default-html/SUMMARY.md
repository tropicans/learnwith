---
slug: 260907-nlm-frontpage-default-html
title: "Set NotebookLM Frontpage as Default HTML State & Fix Critical CSS Selectors"
status: complete
date: 2026-09-07
---

# Quick Task Summary: Set NotebookLM Frontpage as Default HTML State & Fix Critical CSS Selectors

## Changes Made
1. **[index.html](file:///c:/Users/yudhiar/Downloads/AgenticAI/index.html)**:
   - Updated `.app-container` to include `view-home` by default in static HTML markup.
   - Added critical `.app-container.view-home` rules to `<head>` `<style>`, guaranteeing zero layout shift and immediate full-width canvas on first paint.
   - Removed `style="display: none;"` from `#container-home`, making Frontpage the initial visual state.
   - Added `style="display: none;"` to `#container-course-ai`, preventing flash of Course 1.
   - Bumped stylesheet and script cache-busting versions to `?v=2.2.0`.
2. **[assets/css/main.css](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/css/main.css)**:
   - Fixed `.app-container.view-home` CSS selectors for full-width grid layout and hidden sidebar.

## Verification
- `python scratch/test_integration.py` passed all 38 assertions with 0 console errors.
- Default page load renders NotebookLM Frontpage Hub instantly on first paint.
