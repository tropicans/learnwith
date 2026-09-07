import sys
import os
from playwright.sync_api import sync_playwright

html_path = os.path.abspath('index.html').replace('\\', '/')
url = f'file:///{html_path}'

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    page.goto(f"{url}?course=ai")
    page.wait_for_timeout(1000)
    
    # Open dropdown
    page.click('#btn-course-dropdown')
    page.wait_for_timeout(300)
    
    header_z = page.evaluate("parseInt(window.getComputedStyle(document.querySelector('.app-header')).zIndex)")
    sidebar_z = page.evaluate("parseInt(window.getComputedStyle(document.querySelector('.app-sidebar')).zIndex)")
    
    # Check if element at dropdown menu coordinate belongs to dropdown menu or sidebar
    check = page.evaluate("""() => {
        const item = document.getElementById('item-course-word');
        const rect = item.getBoundingClientRect();
        // Sample point inside item that overlaps sidebar x-coordinates (sidebar width is 280px)
        const el = document.elementFromPoint(rect.x + 15, rect.y + 15);
        return {
            header_z: parseInt(window.getComputedStyle(document.querySelector('.app-header')).zIndex),
            sidebar_z: parseInt(window.getComputedStyle(document.querySelector('.app-sidebar')).zIndex),
            itemRect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            elementFound: el ? { tag: el.tagName, id: el.id, className: el.className } : null,
            isCovered: !item.contains(el)
        };
    }""")
    
    print("TEST RESULT:", check)
    assert check['header_z'] > check['sidebar_z'], f"Header z-index ({check['header_z']}) must be higher than sidebar ({check['sidebar_z']})"
    assert not check['isCovered'], f"Dropdown item is covered by: {check['elementFound']}"
    print("SUCCESS: Dropdown is not covered by sidebar.")
