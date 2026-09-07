---
phase: "09-multi-course-architecture-course-gate-protection"
plan: "02"
status: complete
completed_at: "2026-09-07T12:01:25Z"
tasks_completed: 2
tasks_total: 2
requirements_satisfied:
  - GATEWAY-01
  - GATEWAY-02
---

# Plan 09-02 Summary: Course Switcher & Developer Gate Protection

Built and wired the Course Switcher UI, Course 2 Developer Gate protection modal, and dynamic container switching between Course 1 (`Hands-on Agentic AI`) and Course 2 (`Pengolahan Kata Tingkat Lanjut`).

## Completed Work:
- **Task 1**: Wrapped existing Course 1 in `<div id="container-course-ai">`, created container `<div id="container-course-word">` with introductory ASN module cards, added Course Switcher in top header and sidebar navigation drawer, and built `<div id="modal-wordcourse-locked">` in `index.html` with full styling in `assets/css/components.css`.
- **Task 2**: Implemented `CourseManager` (`isWordCourseUnlocked`, `setWordCourseUnlocked`, `switchCourse`, `setupCourseManager`) in `assets/js/app.js` with passcode check (`buka-kata`), URL parameter unlock (`?course=word&unlock=dev`), scoped `SearchEngine.buildIndex()` to visible course elements in `assets/js/search.js`, and expanded `tests/multi-course.test.js` to 26 passing assertions.

## Verification Results:
- `tests/multi-course.test.js`: 26/26 passed (0 failures).
- All 7 test suites passing with 100% success rate (179 passing assertions across unit and integration tests).
