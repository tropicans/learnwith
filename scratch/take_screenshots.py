import os
from playwright.sync_api import sync_playwright

brain_dir = r"C:\Users\yudhiar\.gemini\antigravity\brain\13cab997-e4cf-48c2-a6b9-a0b7b5b635db"
html_path = os.path.abspath("index.html").replace("\\", "/")
url = f"file:///{html_path}"

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    
    # Desktop view Course 1
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(url)
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(brain_dir, "desktop_course1.png"), full_page=False)
    
    # Desktop view Course 2 (unlocked via URL)
    page.goto(f"{url}?course=word&unlock=dev")
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(brain_dir, "desktop_course2.png"), full_page=False)
    
    # Mobile view Course 1
    page_m = browser.new_page(viewport={"width": 390, "height": 844})
    page_m.goto(url)
    page_m.wait_for_timeout(1000)
    page_m.screenshot(path=os.path.join(brain_dir, "mobile_course1.png"), full_page=False)

    browser.close()
print("Screenshots saved successfully!")
