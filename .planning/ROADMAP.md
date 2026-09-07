# Roadmap: learnwith — Multi-Course Platform & Pengolahan Kata Tingkat Lanjut

## Milestones

- ✅ **v1.0 Pre-Training Interactive Web App (Agentic AI)** - Phases 1-4 (shipped 2026-09-03) — [Archive](milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 Live Workshop Guide (Agentic AI Hari-H)** - Phases 5-8 (shipped 2026-09-07) — [Archive](milestones/v1.1-ROADMAP.md)
- 🟡 **v2.0 Multi-Course Platform & Modul Pengolahan Kata Tingkat Lanjut** - Phases 9-12 (In Planning)

## Active Milestone: v2.0 (Phases 9-12)

- [x] **Phase 9: Multi-Course Architecture & Course Gate Protection**
  - Namespaced state isolation (`learnwith_ai_*` vs `learnwith_word_*`).
  - Zero-risk backward compatibility for public Agentic AI participants.
  - Course 2 developer/instructor protection gate (`buka-kata` or `?course=word&unlock=dev`).
  - Course switcher component.
- [ ] **Phase 10: Interactive Modules Bab I–III (Struktur Dokumen, Styles, TOC & Penomoran Halaman)**
  - Bab I Pendahuluan & berkas praktik ASN.
  - Bab II Styles, Heading, Multilevel List, TOC otomatis & Checkpoint 1.
  - Bab III Section Breaks, Header/Footer unlink, nomor halaman Romawi vs Arab, tata letak campuran, template `.dotx`, content controls & Checkpoint 2.
- [ ] **Phase 11: Interactive Modules Bab IV (Mail Merge, Track Changes & Kolaborasi Dokumen)**
  - Mail Merge surat & label massal, rules & filtering data.
  - Review tools: Komentar, Track Changes, Compare/Combine, penguncian pelacakan, dan etika kolaborasi daring.
  - Checkpoint 3 verifikasi otomatisasi & kolaborasi.
- [ ] **Phase 12: Interactive Knowledge Quiz (Bab V), Rubrik Evaluasi & Laporan Kelulusan BPSDM**
  - Kuis pilihan ganda 20 butir interaktif Bab V dengan skor instan dan pembahasan.
  - Lembar refleksi diri dan checklist bukti praktik terpadu ASN.
  - Form Laporan Kelulusan & Hasil Praktik dengan ekspor 1-klik WhatsApp, Telegram, dan Print PDF.

### Phase 9: Multi-Course Architecture & Course Gate Protection

**Goal**: Establish multi-course architecture with namespaced state storage, developer gate protection for Course 2, and seamless course switching while maintaining 100% backward compatibility for Course 1.
**Depends on**: Milestone v1.1
**Requirements**: GATEWAY-01, GATEWAY-02, GATEWAY-03
**Plans**: 2 plans

Plans:

- [x] 09-01: Namespaced StateManager refactoring, migration helper, and backward compatibility layer.
- [x] 09-02: Course switcher UI component, developer gate modal with passcode/URL unlock, and course routing.

### Phase 10: Interactive Modules Bab I–III (Struktur Dokumen, Styles, TOC & Penomoran Halaman)

**Goal**: Deliver interactive guide modules and checkpoint gates for Word Advanced Modules Bab I to III covering styles hierarchy, automatic TOC, section breaks, and complex page numbering.
**Depends on**: Phase 9
**Requirements**: WORD-01, WORD-02, WORD-03, WORD-05
**Plans**: 2 plans

### Phase 11: Interactive Modules Bab IV (Mail Merge, Track Changes & Kolaborasi Dokumen)

**Goal**: Provide interactive step-by-step guides for Mail Merge automation, Track Changes, document comparison, and cloud collaboration workflows.
**Depends on**: Phase 10
**Requirements**: WORD-04, WORD-05
**Plans**: 2 plans

### Phase 12: Interactive Knowledge Quiz (Bab V), Rubrik Evaluasi & Laporan Kelulusan BPSDM

**Goal**: Implement 20-question interactive evaluation quiz with instant explanations, self-reflection competency checklist, and multi-channel report exporter for BPSDM certification.
**Depends on**: Phase 11
**Requirements**: QUIZ-01, QUIZ-02, QUIZ-03, WORD-RPT-01, WORD-RPT-02
**Plans**: 2 plans

## Completed Milestones

<details>
<summary>✅ v1.1 Live Workshop Guide (Hari-H Praktik Kelas) (Phases 5-8) - SHIPPED 2026-09-07</summary>

- [x] **Phase 5: Mode Switcher & Dual Workshop Navigation Shell**
- [x] **Phase 6: 9Router Model Alignment & Hermes Agent Windows Installation**
- [x] **Phase 7: Telegram Allowlist Gateway, Google Calendar OAuth & End-to-End Verification**
- [x] **Phase 8: In-Class Troubleshooting Hub, Completion Status Engine & Final Report Exporter**

Full details: [v1.1 Roadmap Archive](milestones/v1.1-ROADMAP.md) | [v1.1 Requirements Archive](milestones/v1.1-REQUIREMENTS.md)

</details>

<details>
<summary>✅ v1.0 Pre-Training Interactive Web App (Phases 1-4) - SHIPPED 2026-09-03</summary>

- [x] **Phase 1: Foundation Shell, Navigation & Theme Architecture**
- [x] **Phase 2: Interactive Guide Modules & 1-Click Execution**
- [x] **Phase 3: Checklist Engine, Checkpoint Gates & Local Storage State**
- [x] **Phase 4: Troubleshooting Hub, Secret Redaction Helper & Report Exporter**

Full details: [v1.0 Roadmap Archive](milestones/v1.0-ROADMAP.md) | [v1.0 Requirements Archive](milestones/v1.0-REQUIREMENTS.md)

</details>
