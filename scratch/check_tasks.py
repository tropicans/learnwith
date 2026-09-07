import re

with open('assets/js/state.js', 'r', encoding='utf-8') as f:
    state_js = f.read()

match = re.search(r'const WORD_DEFAULT_STATE = \{.*?checklists:\s*\{(.*?)\},\s*checkpoints:', state_js, re.DOTALL)
if match:
    raw_keys = re.findall(r"['\"](word-b\d-[a-z0-9\-]+)['\"]", match.group(1))
    print(f'Total WORD_DEFAULT_STATE checklist keys: {len(raw_keys)}')
else:
    print('Could not find WORD_DEFAULT_STATE')
    raw_keys = []

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html_tasks = re.findall(r'data-task-id=["\'](word-b\d-[a-z0-9\-]+)["\']', html)
print(f'Total HTML data-task-id in word course: {len(html_tasks)}')

missing_in_html = [k for k in raw_keys if k not in html_tasks]
missing_in_state = [k for k in html_tasks if k not in raw_keys]

print('Missing in HTML:', missing_in_html)
print('Missing in State:', missing_in_state)
