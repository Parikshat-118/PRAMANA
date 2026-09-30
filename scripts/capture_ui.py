"""Capture the PRAMANA web interface in each of its states, to docs/ui/.

Drives the public site (or a local `npm run dev` of web/) with Playwright and the
Edge or Chrome already on the machine, so no browser download is needed:

    python scripts/capture_ui.py                          # live site
    python scripts/capture_ui.py http://localhost:3100    # local build of web/

Every desktop shot is taken at 1600x1000 so the images stay comparable and the
README renders them at a predictable size; the phone shot is 390x844 at 2x.
"""

from __future__ import annotations

import sys
from pathlib import Path

from playwright.sync_api import Page, sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "ui"
BASE = (sys.argv[1] if len(sys.argv) > 1 else "https://pramana-f0eb7.web.app").rstrip("/")
DESKTOP = {"width": 1600, "height": 1000}
PHONE = {"width": 390, "height": 844}
CASE = "/cases/prm-2026-0417/"
# The results page pins a section-tab bar under the nav; keep headings clear of both.
RESULTS_OFFSET = 210


def shot(page: Page, name: str) -> None:
    path = OUT / f"{name}.jpg"
    page.screenshot(path=str(path), type="jpeg", quality=88)
    print(f"  docs/ui/{path.name}  ({path.stat().st_size // 1024} kB)")


def reveal_all(page: Page) -> None:
    """Sections fade in as they scroll into view; walk the page once so every one has."""
    height = page.evaluate("document.body.scrollHeight")
    for y in range(0, height, 400):
        page.evaluate(f"window.scrollTo(0, {y})")
        page.wait_for_timeout(220)
    page.wait_for_timeout(600)


def to_section(page: Page, element_id: str) -> None:
    page.evaluate(f"window.scrollTo(0, document.getElementById('{element_id}').getBoundingClientRect().top + scrollY)")
    page.wait_for_timeout(900)


def to_text(page: Page, prefix: str, offset: int = 110) -> None:
    """Scroll so the first heading or label starting with `prefix` sits under the nav bar."""
    page.evaluate(
        """([prefix, offset]) => {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            let node;
            while ((node = walker.nextNode())) {
                if (node.textContent.trim().startsWith(prefix)) {
                    const top = node.parentElement.getBoundingClientRect().top + scrollY;
                    window.scrollTo(0, top - offset);
                    return;
                }
            }
            throw new Error('not found: ' + prefix);
        }""",
        [prefix, offset],
    )
    page.wait_for_timeout(900)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    print(f"capturing {BASE}")
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge")
        page = browser.new_page(viewport=DESKTOP)

        # Landing page and its sections
        page.goto(BASE + "/", wait_until="networkidle")
        page.wait_for_timeout(1500)
        shot(page, "01-landing")
        reveal_all(page)
        to_section(page, "platform")
        shot(page, "02-platform")
        to_section(page, "cases")
        shot(page, "03-case-files")

        # The ledger demo: verify, then let an insider with every key rewrite history
        to_section(page, "ledger")
        page.get_by_role("button", name="Verify ledger").first.click()
        page.wait_for_timeout(2500)
        page.get_by_role("button", name="Rewrite history as an insider").first.click()
        page.wait_for_timeout(3500)
        shot(page, "12-ledger-insider")

        to_section(page, "calibration")
        shot(page, "14-calibration")
        to_section(page, "doctrine")
        shot(page, "15-doctrine")

        # A case file: the assessment running, then the results
        page.goto(BASE + CASE, wait_until="networkidle")
        page.wait_for_timeout(1500)
        page.get_by_role("button", name="Run assessment").click()
        page.wait_for_timeout(12000)
        page.evaluate("window.scrollTo(0, 420)")
        page.wait_for_timeout(800)
        shot(page, "04-assessment-running")

        page.get_by_role("button", name="Skip to results").click()
        page.wait_for_timeout(4000)
        reveal_all(page)
        to_text(page, "Quarantine", offset=200)
        shot(page, "05-verdict")
        to_text(page, "The model that was tested", offset=RESULTS_OFFSET)
        shot(page, "06-precision-ladder")
        to_text(page, "The divergence lands on one class", offset=RESULTS_OFFSET)
        shot(page, "07-localisation")
        to_text(page, "Battery probes whose decision changed", offset=RESULTS_OFFSET)
        shot(page, "08-probe-gallery")
        to_text(page, "One supplier lot out of twelve", offset=RESULTS_OFFSET)
        shot(page, "09-supplier-lots")
        to_text(page, "The override is the audit trail", offset=RESULTS_OFFSET)
        shot(page, "10-disposition")
        to_text(page, "In the field, the monitor", offset=RESULTS_OFFSET)
        shot(page, "11-field-monitor")
        to_text(page, "17 assessed", offset=RESULTS_OFFSET)
        shot(page, "13-coverage")

        # The self-assessment page
        page.goto(BASE + "/assess/", wait_until="networkidle")
        page.wait_for_timeout(1500)
        shot(page, "16-assess")

        # On a phone
        phone = browser.new_context(viewport=PHONE, device_scale_factor=2, is_mobile=True, has_touch=True)
        mpage = phone.new_page()
        mpage.goto(BASE + "/", wait_until="networkidle")
        mpage.wait_for_timeout(1500)
        shot(mpage, "17-mobile")

        browser.close()


if __name__ == "__main__":
    main()
