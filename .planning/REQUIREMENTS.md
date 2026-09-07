# Milestone v2.0 Requirements — Multi-Course Platform & Modul Pengolahan Kata Tingkat Lanjut

**Status:** 🟡 ACTIVE
**Milestone:** v2.0

---

## Requirements Traceability

### Course Isolation & Gate Protection (GATEWAY)

- [x] **GATEWAY-01**: Existing Course 1 (`Hands-on Agentic AI`) remains the default public course without breaking URL endpoints, bookmarks, or localStorage keys.
- [x] **GATEWAY-02**: Course 2 (`Pengolahan Kata Tingkat Lanjut`) is protected by a developer/instructor gate with passcode verification (`buka-kata`) or URL parameter (`?course=word&unlock=dev`).
- [x] **GATEWAY-03**: State storage in `localStorage` is namespaced by course (e.g., `learnwith_ai_*` vs `learnwith_word_*`) to guarantee zero interference between different workshops.

### Word Processing Interactive Guides (WORD-GUIDE)

- [x] **WORD-01**: Bab I (Pendahuluan) interactive briefing, instructional objectives, practice dataset download links, and competency readiness check.
- [x] **WORD-02**: Bab II (Struktur Dokumen) interactive guide for Styles & Heading hierarchy, Navigation Pane, Multilevel Lists, Automatic Table of Contents, and structural diagnosis with Checkpoint 1.
- [x] **WORD-03**: Bab III (Tata Letak & Template) interactive guide for Section Breaks vs Page Breaks, Header/Footer unlink (`Link to Previous`), Roman (i, ii, iii) vs Arabic (1, 2, 3) page numbering, Landscape orientation mix, `.dotx` templates, content controls, and Checkpoint 2.
- [x] **WORD-04**: Bab IV (Otomatisasi & Kolaborasi) interactive guide for Mail Merge (letters & labels, rules & filters), Track Changes, Commenting, Compare & Combine documents, cloud collaboration, and Checkpoint 3.
- [x] **WORD-05**: Visual keyboard shortcuts, callout cards for official civil service document standards (Pemprov DKI Jakarta), and 1-click text/formula copying.

### Interactive Evaluation & Quiz (QUIZ)

- [x] **QUIZ-01**: Interactive 20-question multiple-choice knowledge evaluation based on Bab V of the official module.
- [x] **QUIZ-02**: Immediate answer validation, detailed explanation/reasoning, and scoring calculation.
- [x] **QUIZ-03**: Self-reflection rubric and practical evaluation checklist for ASN competency verification.

### Report & Completion Exporter (WORD-RPT)

- [x] **WORD-RPT-01**: Pre-filled Form Laporan Hasil Pelatihan Pengolahan Kata summarizing Checkpoints 1–3, quiz score, and portfolio practice tasks.
- [x] **WORD-RPT-02**: 1-click copy for WhatsApp, Telegram Markdown, and clean Print/PDF export for instructor/BPSDM evaluation.

---

## Traceability Table

| Requirement | Phase | Status |
|---|---|---|
| GATEWAY-01 | Phase 9 | Complete |
| GATEWAY-02 | Phase 9 | Complete |
| GATEWAY-03 | Phase 9 | Complete |
| WORD-01 | Phase 10 | Complete |
| WORD-02 | Phase 10 | Complete |
| WORD-03 | Phase 10 | Complete |
| WORD-04 | Phase 11 | Complete |
| WORD-05 | Phase 11 | Complete |
| QUIZ-01 | Phase 12 | Complete |
| QUIZ-02 | Phase 12 | Complete |
| QUIZ-03 | Phase 12 | Complete |
| WORD-RPT-01 | Phase 12 | Complete |
| WORD-RPT-02 | Phase 12 | Complete |
