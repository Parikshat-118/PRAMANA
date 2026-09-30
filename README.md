<div align="center">

# PRAMANA

**Checks a defence vision model before it is fielded: the build that will actually run, traced back to the supplier who shipped it**

`pramāṇa` (प्रमाण) · *the means by which valid knowledge is obtained*

**[▶ Live demo · pramana-f0eb7.web.app](https://pramana-f0eb7.web.app)**

<!-- Demo video: replace this line with  **[▶ Demo video](PASTE_YOUTUBE_LINK_HERE)**  -->

Smart India Hackathon 2026 · Problem Statement SIH26228 · Ministry of Defence, Indian Army (DGIS) · Blockchain & Cybersecurity

</div>

![PRAMANA landing page](docs/ui/01-landing.jpg)

A computer-vision model used in defence is rarely built by one team. The images
come from several agencies, the labels from outsourced vendors, the backbone from
a public model hub and the fine-tuning from an integrator. What finally runs on the
vehicle is a compressed INT8 copy. PRAMANA takes that delivered model and the
supplier data lots behind it, tests the build that will actually run, and reports
in plain words what it found, which supplier lot it points to, how sure it is and
what should happen next. It runs fully offline, and it never retrains the model to
reach its baseline answer.

**A hash proves the bytes did not change. It cannot tell you the model was born
backdoored.** A vendor who poisons half a percent of their own data shard still
ships a model whose every hash and signature checks out. So PRAMANA looks at what
the model *does*, at the precision it will run at, and writes every decision to a
signed ledger that nobody can quietly rewrite. That includes us.

---

## Try it

**In the browser.** Open the [live demo](https://pramana-f0eb7.web.app), press
**Open case files**, pick **PRM-2026-0417** and press **Run assessment**. The page
plays all thirteen stages of one assessment, then opens the results. Back on the
landing page, the **Ledger** section lets you verify a real signed ledger inside
your own browser, then tamper with it, first as an outsider and then as an insider
who holds every key, and see where each attempt gets caught.

**Locally, the web interface.** It is a static site with every asset bundled, so
nothing is fetched at runtime:

```bash
cd web
npm ci
npm run dev        # http://localhost:3100
```

**Locally, the Python package.** The parts published so far (see
[what is in this repository](#what-is-in-this-repository)) run from the command line:

```bash
pip install -e ".[ml]"
python scripts/make_fixtures.py
pramana selftest          # COCO, YOLO, ONNX and TorchScript loaders, and the broken files they must reject
pramana coverage check    # the 27-class attack list; a class with no decision fails the check
pramana ledger verify web/public/casefiles/prm-2026-0417/ledger.jsonl
```

---

## The interface

### Case files

![Case files](docs/ui/03-case-files.jpg)

Two deliveries of the same convoy perception model, a ResNet-18 that reads traffic
signs (GTSRB, 43 classes), trained on data from twelve supplier lots:

| | PRM-2026-0417 · red-team exercise | PRM-2026-0422 · routine delivery |
|---|---|---|
| **What happened** | A red-team cell hid a backdoor that stays quiet at FP32 and wakes up only in the INT8 build. The assessors were told nothing about where, which class or which lot. | The next scheduled delivery of the same model, trained the same way, with nothing planted. |
| **What PRAMANA said** | INT8 build outside the normal range, the divergence piled onto one class (Speed limit 120 km/h), lot-07 flagged. **QUARANTINE.** | Divergence spread thinly over nine classes, no lot flagged. **ACCEPT WITH CONDITIONS.** |

Each case file lists which of its numbers are **measured** (the model builds, the
precision ladder, the class localisation, the probe images, the certificate and the
ledger), which were **seeded** by the red team, and which are **modelled** (the
per-lot detector scores and the field receipt stream). The downloadable report
JSON is marked `ILLUSTRATIVE_EXAMPLE`: it shows the report format and is not a
measurement record.

### An assessment, running

![Assessment running](docs/ui/04-assessment-running.jpg)

The stages tick off on the left while the terminal on the right shows what each one
concluded: custody checks, the sealed test set, the precision ladder, localisation,
supplier evidence, declared limits, the certificate, drift, the decision, the field
monitor, the ledger and the signed report.

### The verdict

![Verdict](docs/ui/05-verdict.jpg)

The answer comes first, in words: what was tested, what was found, and the one
sentence the tool is allowed to use. That sentence is always *no evidence of
conditional misbehaviour was found under this test set, at these builds, against
this reference*. It never says a model is clean.

### The build that runs is the build we test

![Precision ladder](docs/ui/06-precision-ladder.jpg)

The same model arrives as FP32, FP16, INT8, pruned and TorchScript builds. Each one
answers the same 200 sealed test images, and its disagreement with its own FP32 is
ranked against 64 clean models trained the same way. Only the INT8 build, the one
marked *will run*, lands outside that range. The ONNX build says *unavailable*
because the runtime was not installed on the assessing machine. It is not skipped
silently.

### Where it lands, and on which images

| | |
|---|---|
| ![Localisation](docs/ui/07-localisation.jpg) | ![Probe gallery](docs/ui/08-probe-gallery.jpg) |

Ordinary INT8 rounding nudges every class a little. A backdoor piles up on one.
Here all of the extra divergence falls on class 8, *Speed limit (120 km/h)*, and the
gallery shows the real GTSRB test images whose answer flipped to it.

### Which supplier, and was it drift or manipulation?

![Supplier lots](docs/ui/09-supplier-lots.jpg)

Four data checks score audited samples from every lot. The scores are merged per lot
and flagged at a declared 5% false-discovery rate across the whole supplier list, so
one supplier is named rather than every vendor at once. The strip underneath asks the
problem statement's other question: is this ordinary drift, or someone's hand? Here
the shift sits almost entirely in one contributor, so it reads **MANIPULATION**.

### Every override leaves a record, and the field can take it back

| | |
|---|---|
| ![Disposition](docs/ui/10-disposition.jpg) | ![Field monitor](docs/ui/11-field-monitor.jpg) |

A quarantined model can still ship if an officer accepts the risk, but only as a
**conditional release**: a named authority, written controls and an expiry date, all
on the ledger. Once the model is fielded, every inference emits a signed receipt. A
monitor watches that stream without needing labels, and here it revoked the release
at receipt 4,041.

### A ledger that catches its own keepers

![Ledger with an insider rewrite](docs/ui/12-ledger-insider.jpg)

Every commitment, admission, verdict and override is a signed row linked to the row
before it, and the Merkle root of those rows is time-stamped outside the certifying
authority (RFC 3161). In this demo an insider with every signing key rewrites history
and re-signs every later row. The local chain still verifies, but the outside anchor
no longer matches, so the edit is caught anyway.

### What it covers, and what it says it does not

![Coverage](docs/ui/13-coverage.jpg)

27 attack classes, each with a decision: 17 assessed, 10 declared unsupported and
none left silent. The list is generated from [`taxonomy.yaml`](taxonomy.yaml), and a
class with no decision fails the check.

### Calibration and doctrine

| | |
|---|---|
| ![Calibration](docs/ui/14-calibration.jpg) | ![Doctrine](docs/ui/15-doctrine.jpg) |

There are no hand-picked thresholds. The normal range comes from **128 clean models
we trained in 14.94 GPU-hours on one RTX 4060**: 64 ResNet-18s on GTSRB (median
accuracy 98.15%, lowest 97.63%, none below the 95% floor) and two 32-model sets on
CIFAR-10. The same page shows why a range cannot be borrowed. Moved to a new dataset
or a new architecture it shifts by more than four times its own spread, so both
transfers are refused and each new model family gets its own fit. The doctrine page
lists the four things PRAMANA will never say.

### Assess your own model, and on a phone

| | |
|---|---|
| ![Assess a model](docs/ui/16-assess.jpg) | <img src="docs/ui/17-mobile.jpg" width="300" alt="PRAMANA on a phone"> |

The self-assessment page shows the intended flow (artefact, lot manifest, access
tier, then commit and run) and is marked *under development*.

---

## How it works

```
BEFORE THE MODEL ARRIVES   the test images are sealed and their hash goes on the ledger
ADMISSION GATE             signature · digest · read-only copy of every supplier lot
        │
        ▼  how much access do we have?
MODEL FILE ONLY   (T1)     precision ladder  FP32 → FP16 → INT8 → pruned → ONNX → TorchScript
                           hidden-trigger search · weight and activation statistics
                           a signed receipt for every field inference · live monitor
+ TRAINING DATA   (T2)     four data checks → one score per supplier lot
                           drift or manipulation? · supplier-lot vote
+ FULL PIPELINE   (T3)     leave one lot out to name the supplier · remove it, re-test the trigger
        │
        ▼
EVIDENCE GRADE             indicative → corroborated → cause verified
DECISION                   accept · accept with conditions · conditional release · quarantine · reject
OUTPUT                     signed report · hash-chained ledger · outside time-stamp
```

**One idea runs through all of it: concentration, not size.** Rounding a model to
INT8 changes every class a little. An attack changes a few classes, a few inputs or
one supplier's lot a lot. The same test that flags a model build also flags a data
lot, and it separates drift, which is spread across every lot, from manipulation,
which piles up on one.

**Less access means fewer claims, never a guess.** If only black-box access is
given, the behaviour and receipt checks still run. Anything that needs gradients or
weights is reported as *unavailable*, with the reason, instead of being dropped
quietly.

**Answers come in contract units.** Verdicts are given per supplier, per lot and per
contract clause. The report also prints how many of the twelve suppliers could be
poisoned before the vote flips, next to the share of the data those suppliers hold,
because three small lots and three large ones are not the same risk.

---

## What is in this repository

This repository carries the public website, the analyst console, the ingest layer,
the ledger, the decision rules, the report schema and the attack-coverage list. The
analysis core is not published here yet and will follow with the final release.

| Part | Where | Here |
|---|---|---|
| Public website: case files, in-browser ledger check, calibration | [`web/`](web) | ✅ live |
| Analyst console: overview, ladder, contributors, ledger, monitor | [`console/`](console) | ✅ |
| COCO, YOLO, ONNX and TorchScript loaders, with good and broken test files | `pramana/ingest`, [`conformance/`](conformance) | ✅ |
| Hash-chained ledger, Ed25519 signing, outside time-stamp (RFC 3161) | `pramana/ledger` | ✅ |
| Five-state decision rules, named conditional release with expiry | `pramana/disposition` | ✅ |
| Assurance-report schema | [`pramana/report/schema.py`](pramana/report/schema.py) | ✅ |
| Attack-coverage list: 27 classes, generated and checked | [`taxonomy.yaml`](taxonomy.yaml), `pramana/coverage` | ✅ |
| Offline manifest and digest check | [`offline-manifest.yaml`](offline-manifest.yaml), `pramana/offline.py` | ✅ |
| Calibration results from the 128 clean models | `web/public/casefiles/calibration.json` | ✅ |
| Build gates (forbidden verdict phrases, licence check) and their tests | [`gates/`](gates), [`tests/`](tests) | ✅ |
| API and job worker | [`api/`](api), [`worker/`](worker) | ✅ code; starts once the report validator is published |
| Precision ladder, trigger search, data checks, drift checks, receipt monitor, report validator, `pramana demo`, experiments | | 🔒 final release |

Until the core is published, `pramana demo` and `pramana report validate` do not
run from this repository. The commands under [Try it](#try-it) do.

---

## Design commitments

- **Never needs a network.** Every wheel, weight and dataset is listed in
  [`offline-manifest.yaml`](offline-manifest.yaml) with its SHA-256, and
  `pramana verify-offline` recomputes each one before anything runs. There are no
  pretrained downloads, no licence server and no cloud.
- **A verdict never says "clean".** A backdoor can be built so that no efficient
  black-box test finds it ([arXiv:2204.06974](https://arxiv.org/abs/2204.06974)), so
  the strongest true sentence is *no evidence was found under this test set*. A build
  gate in [`gates/`](gates) rejects shipped text that claims more.
- **Every number travels with its bound.** A p-value is printed next to its floor
  (1/65 with 64 clean models), an e-value next to its threshold, and a certificate
  next to the share of data it covers.
- **Permissive licences only.** The project is Apache-2.0 for its patent grant. The
  queue runs on **Valkey, not Redis**, because Redis left its BSD licence in 2024.
  BackdoorBench is licensed for non-commercial use, so it is only used to cross-check
  our own attack code and is not shipped.

---

## Known limits

Stated up front rather than left to be discovered:

- **Some backdoors cannot be found by any test.** They can be constructed to be
  invisible to every efficient black-box check. This is a proven result, not a gap in
  our engineering, and it is why no verdict ever says a model is clean.
- **Warping and input-aware triggers are not covered.** The trigger search assumes
  a fixed trigger.
- **Object detectors come next.** The trigger search is written for classifier
  outputs. On detection heads it is replaced by an amplitude sweep, and the full path
  for detectors is not built yet.
- **Terrain and season drift are declared unsupported**, because this build has no
  public defence-imagery dataset with those conditions. Sensor and acquisition drift
  are tested with corruption models (blur, noise, compression), not with real sensor
  swaps.
- **A normal range does not travel.** One fitted on a model family, dataset and
  converter cannot be reused on another. Each new family costs about 15 GPU-hours to
  fit.
- **The supplier bound describes an ensemble we build**, not the fielded model.
- **Test set A is published, so a vendor could tune against it.** Test set B is
  sealed and used once. Keeping it sealed is an organisational control, and it is
  labelled as one.
- **The concentration threshold is a prediction until our stress test runs.** Until
  then no decision rests on it alone.
- **No patent search has been done yet.**
- **A stolen signing key or a compromised certifier is out of scope.** That is a
  key-management problem. The outside time-stamp is what limits the damage.

---

## Documents

- [`web/README.md`](web/README.md): the website's layout, local run and deployment
- [`docs/ui/`](docs/ui): interface screenshots, and how to regenerate them
- [`taxonomy.yaml`](taxonomy.yaml): every attack class and the decision made about it
- [`pramana/report/schema.py`](pramana/report/schema.py): the assurance-report schema

## Licence

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
