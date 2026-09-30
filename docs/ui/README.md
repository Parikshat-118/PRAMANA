# Interface screenshots

Captured by [`scripts/capture_ui.py`](../../scripts/capture_ui.py) from the public
site at a 1600×1000 viewport (the phone shot at 390×844, 2×). It drives the Edge
already installed on the machine through Playwright, so no browser download is
needed. To regenerate:

```bash
pip install playwright
python scripts/capture_ui.py                          # from the live site
python scripts/capture_ui.py http://localhost:3100    # from a local `npm run dev` in web/
```

| File | State |
|---|---|
| `01-landing.jpg` | Landing page |
| `02-platform.jpg` | The platform overview: thirteen stages, three access tiers |
| `03-case-files.jpg` | The two case files and the self-assessment card |
| `04-assessment-running.jpg` | Case PRM-2026-0417, part-way through its thirteen stages |
| `05-verdict.jpg` | The finished assessment: verdict and evidence statement |
| `06-precision-ladder.jpg` | Every build against 64 clean models |
| `07-localisation.jpg` | Divergence by class, and the class that was rejected |
| `08-probe-gallery.jpg` | Test images whose answer changed between FP32 and INT8 |
| `09-supplier-lots.jpg` | Evidence per supplier lot, and drift or manipulation |
| `10-disposition.jpg` | Quarantine, conditional release and revocation on the record |
| `11-field-monitor.jpg` | The signed receipt stream and the monitor crossing its threshold |
| `12-ledger-insider.jpg` | The ledger demo after an insider rewrite: local chain valid, outside anchor mismatched |
| `13-coverage.jpg` | The 27-class coverage list |
| `14-calibration.jpg` | The 128 clean models behind every threshold |
| `15-doctrine.jpg` | What PRAMANA will never say |
| `16-assess.jpg` | The self-assessment page (under development) |
| `17-mobile.jpg` | The landing page on a phone |
