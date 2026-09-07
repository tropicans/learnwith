---
status: complete
phase: 09-multi-course-architecture-course-gate-protection
source:
  - 09-01-SUMMARY.md
  - 09-02-SUMMARY.md
started: 2026-09-07T13:53:45+07:00
updated: 2026-09-07T14:04:00+07:00
---

## Current Test

[testing complete]

## Tests

### 1. Cold Start Smoke Test
expected: Open or refresh `index.html` in your browser. The application loads cleanly without console errors, and Course 1 ("Hands-on Agentic AI") is displayed by default with its modules, progress tracker, and header/sidebar navigation.
result: pass

### 2. Course Switcher UI Controls
expected: Both the top header bar and sidebar navigation drawer feature a Course Switcher dropdown showing "Hands-on Agentic AI" (🤖) as active and "Pengolahan Kata Tingkat Lanjut (ASN)" (📝) with a lock icon.
result: pass

### 3. Course 2 Developer Gate Modal & Passcode Unlock
expected: Selecting "Pengolahan Kata Tingkat Lanjut (ASN)" in the Course Switcher opens the Developer Gate modal (`#modal-wordcourse-locked`). Entering an invalid code displays error feedback. Entering the valid passcode `buka-kata` successfully unlocks the course and closes the modal.
result: pass

### 4. Course Container & View Transition
expected: Upon switching to Course 2, the application view switches to `#container-course-word` showing the ASN workshop outline/banner, updates the brand title to "Pengolahan Kata Tingkat Lanjut", and hides Course 1's Dual Mode Switcher. Switching back to Course 1 restores Course 1 container and its mode switcher.
result: pass

### 5. URL Parameter Direct Access
expected: Opening `index.html?course=word&unlock=dev` in a fresh browser session or tab automatically unlocks and activates Course 2 directly without prompting for the passcode modal.
result: pass

### 6. State Isolation & Namespaced Storage
expected: Progress made in Course 1 is persisted under `learnwith_ai_state_v1` without colliding with `learnwith_word_state_v1`, and clearing or resetting state in one course does not delete or mutate progress in the other.
result: pass

## Summary

total: 6
passed: 6
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

[none]