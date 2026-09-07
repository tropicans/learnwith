import sys
import os
import json

sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

html_path = os.path.abspath('index.html').replace('\\', '/')
url = f'file:///{html_path}'

print(f"Testing index.html at {url}")

results = []

def record(category, test_name, passed, details=""):
    results.append({
        "category": category,
        "test": test_name,
        "passed": passed,
        "details": details
    })
    status = "PASS" if passed else "FAIL"
    print(f"[{status}] [{category}] {test_name}: {details}")

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page()

    console_errors = []
    page.on('console', lambda msg: console_errors.append(msg.text) if msg.type == 'error' else None)
    page.on('pageerror', lambda exc: console_errors.append(str(exc)))

    # -------------------------------------------------------------
    # FLOW 1: NOTEBOOKLM FRONTPAGE & SEAMLESS STUDIO NAVIGATION (HOME-01..05, GATEWAY-01..03)
    # -------------------------------------------------------------
    # Step 1.1: Load default page (no params) -> Lands on NotebookLM Frontpage Hub
    page.goto(url)
    page.wait_for_load_state('domcontentloaded')
    page.wait_for_timeout(1000)

    c_home_disp = page.evaluate("document.getElementById('container-home').style.display")
    has_view_home = page.evaluate("document.querySelector('.app-container').classList.contains('view-home')")
    record("HOME-01", "Default page loads NotebookLM Frontpage Hub", c_home_disp != 'none', f"c_home={c_home_disp}")
    record("HOME-02", "App container has view-home (sidebar hidden)", has_view_home)

    # Verify header breadcrumb separator & dropdown switcher are hidden on home
    home_sep_disp = page.evaluate("window.getComputedStyle(document.querySelector('.brand-breadcrumb-separator')).display")
    home_switch_disp = page.evaluate("window.getComputedStyle(document.querySelector('.header-course-switcher')).display")
    record("HOME-03", "Header adapts cleanly on Frontpage", home_sep_disp == 'none' and home_switch_disp == 'none', f"sep={home_sep_disp}, switch={home_switch_disp}")

    # Step 1.2: Click Card 1 (Hands-on Agentic AI) -> Launches Course 1 Workspace
    page.click("#btn-home-enter-ai")
    page.wait_for_timeout(400)

    active_course = page.evaluate("window.AppState.getActiveCourse()")
    c_ai_disp = page.evaluate("document.getElementById('container-course-ai').style.display")
    c_word_disp = page.evaluate("document.getElementById('container-course-word').style.display")
    is_home_after_click = page.evaluate("document.querySelector('.app-container').classList.contains('view-home')")
    record("HOME-04", "Clicking Card 1 launches Course 1 Workspace Studio", 
           (not is_home_after_click) and active_course == 'ai' and c_ai_disp != 'none' and c_word_disp == 'none',
           f"active={active_course}, c_ai={c_ai_disp}, view_home={is_home_after_click}")

    # Check localStorage key for AI
    ai_storage_key = page.evaluate("window.AppState.getStorageKey()")
    record("GATEWAY-03", "AI course uses learnwith_ai_state_v1", ai_storage_key == 'learnwith_ai_state_v1', f"key={ai_storage_key}")

    # Step 1.3: Click brand logo/link -> Returns cleanly to Frontpage Hub
    page.click("#brand-home-link")
    page.wait_for_timeout(400)
    returned_home = page.evaluate("document.querySelector('.app-container').classList.contains('view-home')")
    c_home_returned = page.evaluate("document.getElementById('container-home').style.display")
    record("HOME-04", "Clicking learnwith brand returns to Frontpage Hub", returned_home and c_home_returned != 'none')

    # Step 1.4: Click Card 2 (Pengolahan Kata) when locked -> Opens passcode modal
    page.click("#btn-home-enter-word")
    page.wait_for_timeout(400)
    modal_open = page.evaluate("document.getElementById('modal-wordcourse-locked').classList.contains('open')")
    record("GATEWAY-02", "Clicking Word Card when locked opens passcode modal", modal_open, f"modal_open={modal_open}")

    # Enter wrong passcode
    page.fill("#input-word-unlock-code", "salah-kode")
    page.click("#btn-submit-word-unlock")
    err_feedback = page.is_visible("#word-unlock-feedback")
    record("GATEWAY-02", "Wrong passcode shows error feedback", err_feedback)

    # Enter correct passcode 'buka-kata'
    page.fill("#input-word-unlock-code", "buka-kata")
    page.click("#btn-submit-word-unlock")
    page.wait_for_timeout(500)

    modal_open_after = page.evaluate("document.getElementById('modal-wordcourse-locked').classList.contains('open')")
    active_course_after = page.evaluate("window.AppState.getActiveCourse()")
    c_ai_after = page.evaluate("document.getElementById('container-course-ai').style.display")
    c_word_after = page.evaluate("document.getElementById('container-course-word').style.display")
    word_unlocked_storage = page.evaluate("localStorage.getItem('learnwith_word_unlocked')")

    record("GATEWAY-02", "Passcode 'buka-kata' unlocks Course 2 and enters Workspace", 
           (not modal_open_after) and active_course_after == 'word' and c_word_after == 'block' and c_ai_after == 'none',
           f"course={active_course_after}, c_word={c_word_after}, unlocked_storage={word_unlocked_storage}")

    # Verify storage isolation (GATEWAY-03)
    word_storage_key = page.evaluate("window.AppState.getStorageKey()")
    record("GATEWAY-03", "Word course uses learnwith_word_state_v1", word_storage_key == 'learnwith_word_state_v1', f"key={word_storage_key}")

    # Step 1.5: Test URL parameter directly launching courses (HOME-05)
    page.goto(f"{url}?course=word&unlock=dev")
    page.wait_for_load_state('domcontentloaded')
    page.wait_for_timeout(1000)

    url_unlocked = page.evaluate("window.isWordCourseUnlocked()")
    url_course = page.evaluate("window.AppState.getActiveCourse()")
    url_c_word = page.evaluate("document.getElementById('container-course-word').style.display")
    record("HOME-05", "URL ?course=word&unlock=dev activates Word course directly",
           url_unlocked and url_course == 'word' and url_c_word == 'block',
           f"unlocked={url_unlocked}, course={url_course}, display={url_c_word}")

    # Switch back to Course 1
    page.evaluate("window.switchCourse('ai')")
    switched_ai_c = page.evaluate("window.AppState.getActiveCourse()")
    c_ai_back = page.evaluate("document.getElementById('container-course-ai').style.display")
    record("GATEWAY-01", "Can switch cleanly back to Course 1", switched_ai_c == 'ai' and c_ai_back == 'block')

    # Switch back to Word for subsequent tests
    page.evaluate("window.switchCourse('word')")

    # -------------------------------------------------------------
    # FLOW 2: COURSE 2 STATE FLOW (WORD-01, WORD-02, WORD-03, WORD-04, WORD-05)
    # -------------------------------------------------------------
    # Check 28 checklist tasks
    all_checklists = page.evaluate("Object.keys(window.AppState.getState().checklists)")
    b1_tasks = [t for t in all_checklists if t.startswith('word-b1-')]
    b2_tasks = [t for t in all_checklists if t.startswith('word-b2-')]
    b3_tasks = [t for t in all_checklists if t.startswith('word-b3-')]
    b4_tasks = [t for t in all_checklists if t.startswith('word-b4-')]

    record("WORD-01", "Bab I has 4 checklist tasks", len(b1_tasks) == 4, f"count={len(b1_tasks)}")
    record("WORD-02", "Bab II has 8 checklist tasks", len(b2_tasks) == 8, f"count={len(b2_tasks)}")
    record("WORD-03", "Bab III has 8 checklist tasks", len(b3_tasks) == 8, f"count={len(b3_tasks)}")
    record("WORD-04", "Bab IV has 8 checklist tasks", len(b4_tasks) == 8, f"count={len(b4_tasks)}")
    record("WORD-01..04", "Total 28 Word checklist tasks in state", len(all_checklists) == 28, f"total={len(all_checklists)}")

    # Check Checkpoint gate buttons for CP1, CP2, CP3
    cp1_card = page.evaluate("document.getElementById('card-word-cp-1') !== null")
    cp2_card = page.evaluate("document.getElementById('card-word-cp-2') !== null")
    cp3_card = page.evaluate("document.getElementById('card-word-cp-3') !== null")
    record("WORD-02", "Checkpoint 1 card exists in DOM", cp1_card)
    record("WORD-03", "Checkpoint 2 card exists in DOM", cp2_card)
    record("WORD-04", "Checkpoint 3 card exists in DOM", cp3_card)

    # Click CP1 passed
    page.evaluate("document.querySelector(\"button.btn-cp-action[data-checkpoint='word-cp-1'][data-status='passed']\").click()")
    cp1_status = page.evaluate("window.AppState.getState().checkpoints['word-cp-1']")
    record("WORD-02", "Checkpoint 1 updates to passed on button click", cp1_status == 'passed', f"status={cp1_status}")

    # Check 1-click copy buttons (WORD-05)
    copy_btns = page.evaluate("document.querySelectorAll('#container-course-word .code-copy-btn').length")
    record("WORD-05", "1-click copy buttons present in Word course", copy_btns > 0, f"found={copy_btns}")

    # Test clicking a copy button to verify visual feedback
    first_copy_btn = page.query_selector("#container-course-word .code-copy-btn")
    first_copy_btn.click()
    page.wait_for_timeout(300)
    has_copied_class = page.evaluate("document.querySelector('#container-course-word .code-copy-btn').classList.contains('copied')")
    record("WORD-05", "Clicking copy button triggers 'copied' state visual feedback", has_copied_class)

    # Check shortcuts & standards sections (WORD-05)
    shortcuts_sec = page.evaluate("document.getElementById('sec-word-shortcuts') !== null")
    standards_sec = page.evaluate("document.getElementById('sec-word-standards') !== null")
    record("WORD-05", "Shortcuts and civil service standards sections exist", shortcuts_sec and standards_sec)

    # Check Progress Math (60% tasks + 40% checkpoints)
    # Check all 28 tasks and all 3 checkpoints
    page.evaluate("""() => {
        const state = window.AppState.getState();
        Object.keys(state.checklists).forEach(k => window.AppState.updateChecklist(k, true));
        window.AppState.updateCheckpoint('word-cp-1', 'passed');
        window.AppState.updateCheckpoint('word-cp-2', 'passed');
        window.AppState.updateCheckpoint('word-cp-3', 'passed');
    }""")
    full_prog = page.evaluate("window.AppState.calculateProgress()")
    record("WORD-01..04", "Progress is 100% when all 28 tasks and 3 checkpoints are completed", 
           full_prog['percentage'] == 100 and full_prog['completedTasks'] == 28 and full_prog['passedCheckpoints'] == 3,
           f"prog={full_prog}")

    readiness = page.evaluate("window.AppState.calculateWordReadiness()")
    record("WORD-01..04", "calculateWordReadiness returns 'ready' with 100% completion",
           readiness['status'] == 'ready', f"status={readiness['status']}, label={readiness['label']}")

    # -------------------------------------------------------------
    # FLOW 3: EVALUATION FLOW (QUIZ-01, QUIZ-02, QUIZ-03, WORD-RPT-01)
    # -------------------------------------------------------------
    # Quiz questions bank
    quiz_len = page.evaluate("window.WORD_QUIZ_QUESTIONS.length")
    record("QUIZ-01", "20 quiz questions available in bank", quiz_len == 20, f"len={quiz_len}")

    # Quiz DOM cards
    quiz_cards = page.evaluate("document.querySelectorAll('#sec-word-quiz .quiz-card').length")
    record("QUIZ-01", "20 quiz cards rendered in DOM", quiz_cards == 20, f"cards={quiz_cards}")

    # Immediate answer validation (QUIZ-02)
    # Answer Q1 correct ('B')
    q1_correct = page.evaluate("window.WORD_QUIZ_QUESTIONS[0].correct")
    page.evaluate(f"document.querySelector(\".quiz-option-btn[data-question-id='1'][data-option='{q1_correct}']\").click()")
    
    q1_answered = page.evaluate("window.AppState.getState().quiz.answers[1]")
    q1_btn_class = page.evaluate(f"document.querySelector(\".quiz-option-btn[data-question-id='1'][data-option='{q1_correct}']\").className")
    q1_expl_disp = page.evaluate("document.querySelector(\"#card-quiz-q1 .quiz-explanation-box\").style.display")

    record("QUIZ-02", "Selecting correct option highlights correct and displays explanation",
           q1_answered == q1_correct and 'correct' in q1_btn_class and q1_expl_disp == 'block',
           f"answered={q1_answered}, class={q1_btn_class}, expl_display={q1_expl_disp}")

    # Answer all 20 correctly
    page.evaluate("""() => {
        window.WORD_QUIZ_QUESTIONS.forEach(q => {
            window.AppState.updateQuizAnswer(q.id, q.correct);
        });
    }""")
    quiz_score = page.evaluate("window.AppState.getState().quiz.score")
    quiz_passed = page.evaluate("window.AppState.getState().quiz.passed")
    record("QUIZ-02", "All 20 correct yields score 100 and passed=true", quiz_score == 100 and quiz_passed, f"score={quiz_score}")

    # Rubric & Reflection textareas (QUIZ-03)
    ref_areas = page.evaluate("document.querySelectorAll('#sec-word-rubrik textarea').length")
    record("QUIZ-03", "5 self-reflection textareas present in DOM", ref_areas == 5, f"count={ref_areas}")

    rubric_chks = page.evaluate("document.querySelectorAll('#sec-word-rubrik input[type=\"checkbox\"]').length")
    record("QUIZ-03", "15 rubric checkboxes present (9 QA + 6 portfolio)", rubric_chks == 15, f"count={rubric_chks}")

    # Fill reflections and check portfolio rubric
    page.evaluate("""() => {
        window.AppState.updateWordReflection('ref-repetitive', 'Membuat nomor surat manual sangat repetitif.');
        ['word-port-structure', 'word-port-multisection', 'word-port-template', 'word-port-merge', 'word-port-review', 'word-port-qa-log'].forEach(k => {
            window.AppState.updateWordRubric(k, true);
        });
    }""")

    # Check graduation calculation (WORD-RPT-01)
    grad = page.evaluate("window.AppState.calculateWordGraduation()")
    record("WORD-RPT-01", "calculateWordGraduation yields 100% finalScore and status 'lulus'",
           grad['finalScore'] == 100 and grad['status'] == 'lulus', f"grad={grad}")

    # Live certificate slip sync
    page.evaluate("""() => {
        window.AppState.updateParticipantInfo('name', 'Budi Santoso, S.Kom.');
        window.AppState.updateParticipantInfo('nip', '198501012010011001');
        window.AppState.updateParticipantInfo('unitKerja', 'BPSDM Provinsi DKI Jakarta');
        window.AppState.updateParticipantInfo('targetDoc', 'Naskah Dinas Standar');
    }""")
    page.evaluate("setupWordGraduationReport()")

    cert_name = page.evaluate("document.getElementById('cert-word-name').innerText")
    cert_verdict = page.evaluate("document.getElementById('cert-word-verdict').innerText")
    record("WORD-RPT-01", "Certificate slip updates with participant name and verdict",
           cert_name == 'Budi Santoso, S.Kom.' and 'LULUS' in cert_verdict,
           f"cert_name={cert_name}, verdict={cert_verdict}")

    # -------------------------------------------------------------
    # FLOW 4: EXPORTER FLOW (WORD-RPT-02)
    # -------------------------------------------------------------
    wa_text = page.evaluate("window.generateWordReportText('whatsapp')")
    tg_text = page.evaluate("window.generateWordReportText('telegram')")

    wa_valid = ("Budi Santoso, S.Kom." in wa_text) and ("LAPORAN HASIL EVALUASI" in wa_text) and ("[X] Checkpoint 1" in wa_text)
    tg_valid = ("Budi Santoso, S.Kom." in tg_text) and ("**LAPORAN HASIL EVALUASI" in tg_text) and ("`[X]` Checkpoint 1" in tg_text)

    record("WORD-RPT-02", "WhatsApp formatted report includes participant, checkpoints, and scores", wa_valid, f"sample={wa_text[:120]}...")
    record("WORD-RPT-02", "Telegram Markdown formatted report is generated cleanly", tg_valid, f"sample={tg_text[:120]}...")

    # Exporter buttons existence
    wa_btn = page.evaluate("document.getElementById('btn-copy-word-wa') !== null")
    tg_btn = page.evaluate("document.getElementById('btn-copy-word-tg') !== null")
    print_btn = page.evaluate("document.getElementById('btn-print-word-report') !== null")
    record("WORD-RPT-02", "Export buttons (WhatsApp, Telegram, Print) exist in DOM", wa_btn and tg_btn and print_btn)

    # Search engine indexing Word course elements
    search_indexed_items = page.evaluate("""() => {
        window.SearchEngine.buildIndex();
        return window.SearchEngine.searchItems.length;
    }""")
    record("SearchEngine", "Search engine indexes elements in Word course", search_indexed_items > 0, f"indexed={search_indexed_items}")

    # Report any unhandled errors
    record("Console", "Zero JavaScript errors during E2E flow execution", len(console_errors) == 0, f"errors={console_errors}")

    browser.close()

with open("scratch/integration_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("\n--- TEST EXECUTION FINISHED ---")
