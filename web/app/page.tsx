import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { CalibrationChart } from "@/components/landing/CalibrationChart";
import { HeroStack } from "@/components/landing/HeroStack";
import { LedgerDemo } from "@/components/landing/LedgerDemo";
import { Icon, Pill, StateIcon } from "@/components/ui";
import { GTSRB, STATE_LABEL, STATE_TONE, pct } from "@/lib/format";
import type { Calibration, CaseFile } from "@/lib/types";

function load<T>(name: string): T {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "casefiles", name), "utf-8")) as T;
}

export default function Home() {
  const a = load<CaseFile>("prm-2026-0417.json");
  const b = load<CaseFile>("prm-2026-0422.json");
  const cal = load<Calibration>("calibration.json");

  return (
    <>
      <Hero />
      <Problem />
      <Platform />
      <Cases a={a} b={b} />
      <Ledger />
      <CalibrationSection cal={cal} />
      <Doctrine />
      <Closing />
    </>
  );
}

/* ================================================================== hero */

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="hero-wash absolute inset-0 -z-20" />
      <div className="grid-bg absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(80%_70%_at_60%_40%,black,transparent)]" />

      <div className="container-x relative grid min-h-[92vh] items-center gap-6 pb-12 pt-28 xl:grid-cols-[1.15fr_1fr] xl:pb-16 xl:pt-24">
        <div className="relative z-20 xl:max-w-[640px]">
          <div className="flex flex-wrap items-center gap-2 animate-rise">
            <span className="chip border-ink bg-ink text-white"></span>
            <span className="chip">
              <span className="text-muted">Status:</span>
              <span className="h-1.5 w-1.5 rounded-sm bg-ok" /> Air-gapped
            </span>
          </div>

          <h1 className="h-display mt-7 text-[46px] sm:text-[72px] xl:text-[70px] 2xl:text-[78px] animate-rise" style={{ animationDelay: "80ms" }}>
            <span className="text-ink/40 sm:whitespace-nowrap">Interrogated before</span>
            <br />
            <span className="text-ink">it&apos;s fielded.</span>
          </h1>

          <p className="mt-6 max-w-[520px] text-[16.5px] leading-relaxed text-ink-2 animate-rise" style={{ animationDelay: "160ms" }}>
            Behavioural integrity assurance for defence vision models built by many contractors — tested at the precision they
            actually run, traced to the supplier lot, sealed in a ledger no insider can quietly rewrite.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3 animate-rise" style={{ animationDelay: "240ms" }}>
            <div className="flex">
              <Link href="/#cases" className="inline-flex items-center rounded-l-xl bg-gradient-to-r from-[#6F8DFF] to-brand px-6 py-3.5 text-[14.5px] font-medium text-white shadow-glow transition hover:brightness-110">
                Open case files
              </Link>
              <Link href="/#cases" aria-label="Open case files" className="ml-[3px] inline-flex items-center rounded-r-xl bg-brand-600 px-4 text-white shadow-glow transition hover:bg-brand-700">
                <Icon.Arrow size={16} />
              </Link>
            </div>
            <Link href="/assess/" className="inline-flex items-center gap-2 px-3 py-3 text-[14.5px] font-medium text-ink-2 transition hover:text-ink">
              <Icon.Upload size={16} /> Assess a model
            </Link>
          </div>

          <div className="mt-14 animate-rise" style={{ animationDelay: "320ms" }}>
            <div className="eyebrow">Built on open, verifiable standards</div>
            <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3 text-[17px] font-semibold tracking-[-0.02em] text-ink/70">
              <Wordmark glyph="◆">Ed25519</Wordmark>
              <Wordmark glyph="⧗">RFC 3161</Wordmark>
              <Wordmark glyph="▣">CycloneDX</Wordmark>
              <Wordmark glyph="⬡">ONNX</Wordmark>
              <Wordmark glyph="◎">Apache-2.0</Wordmark>
            </div>
          </div>
        </div>

        <div className="relative h-[420px] sm:h-[520px] xl:absolute xl:-right-[7vw] xl:top-10 xl:h-[88%] xl:w-[62%]">
          <HeroStack className="absolute inset-0" />
          <div className="pointer-events-none absolute bottom-6 right-4 hidden flex-col items-end gap-2 sm:flex xl:bottom-12 xl:right-[10%]">
            <HudLine k="battery" v="200 probes · committed" />
            <HudLine k="null" v="64 clean ResNet-18 · floor 1/65" />
            <HudLine k="ledger" v="Ed25519 · anchored" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Wordmark({ glyph, children }: { glyph: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-[14px] text-brand">{glyph}</span>
      {children}
    </span>
  );
}

function HudLine({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg border border-white/60 bg-white/70 px-2.5 py-1 font-mono text-[10.5px] text-ink-2 shadow-card backdrop-blur">
      <span className="text-muted">{k} </span>
      {v}
    </div>
  );
}

/* ================================================================== problem */

function Problem() {
  const items = [
    {
      icon: <Icon.Users size={18} />,
      t: "The adversary is on the vendor list.",
      d: "A contractor who poisons half a percent of their own annotation shard ships a model whose every hash, signature and ledger entry is valid. You cannot defend against a supplier by verifying the delivery.",
    },
    {
      icon: <Icon.Layers size={18} />,
      t: "The model you test is not the model that ships.",
      d: "Vehicles and drones run INT8. A quantisation-armed backdoor is silent at FP32 and wakes in conversion. Pramana assesses every build on the precision ladder — the one that will run above all.",
    },
    {
      icon: <Icon.Scale size={18} />,
      t: "A number is not evidence without its bound.",
      d: "Every p-value is printed beside its floor, every e-value beside its threshold, every certificate beside the data volume it covers. The report validator refuses to ship a bare number.",
    },
  ];
  return (
    <section className="border-y border-line bg-surface py-24">
      <div className="container-x">
        <Reveal>
          <div className="eyebrow">The gap</div>
          <p className="mt-5 max-w-4xl text-[30px] font-medium leading-[1.12] tracking-[-0.035em] sm:text-[44px]">
            A hash proves the bytes didn&apos;t change.{" "}
            <span className="text-ink/40">It cannot tell you the model was born backdoored.</span>
          </p>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.t} delay={i * 90}>
              <div className="h-full rounded-2xl border border-line bg-canvas/50 p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand">{it.icon}</div>
                <div className="mt-5 text-[17px] font-medium tracking-[-0.02em]">{it.t}</div>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== platform */

function Platform() {
  return (
    <section id="platform" className="scroll-mt-20 py-24">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow">Platform</div>
              <h2 className="h-section mt-3 max-w-2xl">One assessment. Thirteen stages. No retraining at the baseline.</h2>
            </div>
            <p className="max-w-md text-[14.5px] leading-relaxed text-ink-2">
              The baseline tier needs only the delivered artefact — forward passes, minutes, no gradients. Grant dataset or pipeline access and deeper
              mechanisms switch on; take it away and the report says which ones went dark.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-6">
          <Reveal className="md:col-span-4">
            <Tile tag="D1" title="Precision ladder" icon={<Icon.Layers size={18} />} className="h-full">
              <p>
                FP32, FP16, INT8, pruned, ONNX and TorchScript builds of the same model, each compared with its own FP32 over a pre-committed probe battery and
                ranked against 64 clean models of the same family, corpus and converter.
              </p>
              <LadderMini />
            </Tile>
          </Reveal>
          <Reveal className="md:col-span-2" delay={80}>
            <Tile tag="D3" title="Contributor evidence" icon={<Icon.Users size={18} />} className="h-full">
              <p>Four data-side detectors, merged as e-values, with e-BH controlling the false-discovery rate over the whole supplier list.</p>
              <div className="mt-5 flex items-end gap-1.5">
                {[0.18, 0.22, 0.15, 0.2, 0.17, 0.14, 0.95, 0.19, 0.16, 0.21, 0.13, 0.18].map((h, i) => (
                  <div key={i} className={`w-full rounded-t-[3px] ${i === 6 ? "bg-crit" : "bg-brand-200"}`} style={{ height: `${h * 72}px` }} />
                ))}
              </div>
              <div className="mt-2 h-px w-full bg-ink/60" />
              <div className="mt-1 font-mono text-[10px] text-muted">threshold m/(α·k) = 240</div>
            </Tile>
          </Reveal>
          <Reveal className="md:col-span-2" delay={40}>
            <Tile tag="D2" title="Stated in contract units" icon={<Icon.Scale size={18} />}>
              <p>How many colluding lots the vote tolerates — always printed beside the share of the data those lots hold. Three of twelve can be half the corpus.</p>
            </Tile>
          </Reveal>
          <Reveal className="md:col-span-2" delay={80}>
            <Tile tag="G2" title="Five-state disposition" icon={<Icon.Shield size={18} />}>
              <p>Accept · with conditions · conditional release · quarantine · reject. Overrides carry a named authority, compensating controls and an expiry.</p>
            </Tile>
          </Reveal>
          <Reveal className="md:col-span-2" delay={120}>
            <Tile tag="C6′" title="Anytime-valid field monitor" icon={<Icon.Pulse size={18} />}>
              <p>Signed inference receipts from the vehicle feed an e-process that needs no labels and revokes the acceptance when the field turns.</p>
            </Tile>
          </Reveal>
          <Reveal className="md:col-span-3" delay={40}>
            <Tile tag="C1" title="Ledger with an external anchor" icon={<Icon.Chain size={18} />}>
              <p>Every commitment, admission, verdict and override is an Ed25519-signed row in a hash chain; its Merkle root is anchored outside the certifying authority.</p>
            </Tile>
          </Reveal>
          <Reveal className="md:col-span-3" delay={100}>
            <Tile tag="2.2.6" title="Air-gapped by construction" icon={<Icon.Wifi size={18} />}>
              <p>Every wheel, weight and dataset pinned by SHA-256 in an offline manifest. CI runs with networking disabled, so any egress attempt fails the build.</p>
            </Tile>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-4 grid overflow-hidden rounded-2xl border border-line bg-surface md:grid-cols-3">
            {[
              ["T1 · artefact only", "Precision ladder, trigger reversal, parameter statistics, receipt monitor", "minutes · no gradients"],
              ["T2 · + dataset access", "Four data-side detectors, e-BH over lots, lot-aligned certificate, drift vs manipulation", "hours"],
              ["T3 · + full pipeline", "Leave-lot-out attribution with size-matched controls, containment and amplitude sweep", "retraining budget"],
            ].map(([t, d, s], i) => (
              <div key={t} className={`p-6 ${i ? "border-t border-line md:border-l md:border-t-0" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[12px] font-medium">{t}</div>
                  <span className="font-mono text-[10.5px] text-muted">{s}</span>
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Tile({ tag, title, icon, children, className = "" }: { tag: string; title: string; icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`card group relative overflow-hidden p-6 transition hover:shadow-lift ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand">{icon}</div>
        <span className="font-mono text-[10.5px] text-muted">{tag}</span>
      </div>
      <div className="mt-5 text-[18px] font-medium tracking-[-0.02em]">{title}</div>
      <div className="mt-2 text-[14px] leading-relaxed text-ink-2">{children}</div>
    </div>
  );
}

function LadderMini() {
  const rungs = [
    ["FP32", 0.06, "ok"],
    ["FP16", 0.05, "ok"],
    ["INT8", 0.92, "crit"],
    ["PRUNED", 0.12, "ok"],
    ["ONNX", 0, "off"],
    ["TORCHSCRIPT", 0.03, "ok"],
  ] as const;
  return (
    <div className="mt-6 space-y-2">
      {rungs.map(([r, v, t]) => (
        <div key={r} className="flex items-center gap-3">
          <span className="w-[92px] font-mono text-[10.5px] text-muted">{r}</span>
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-canvas">
            <div className="absolute inset-y-0 left-0 w-[14%] bg-brand-100" />
            {t !== "off" && <div className={`absolute inset-y-0 left-0 rounded-full ${t === "crit" ? "bg-crit" : "bg-brand"}`} style={{ width: `${Math.max(v * 100, 3)}%` }} />}
          </div>
          <span className={`w-[74px] text-right font-mono text-[10.5px] ${t === "crit" ? "text-crit" : "text-muted"}`}>{t === "crit" ? "beyond null" : t === "off" ? "declared" : "within null"}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-muted">
        <span className="inline-block h-2 w-3 rounded-sm bg-brand-100" /> range of 64 clean conversions
      </div>
    </div>
  );
}

/* ================================================================== cases */

function Cases({ a, b }: { a: CaseFile; b: CaseFile }) {
  return (
    <section id="cases" className="scroll-mt-20 border-y border-line bg-surface py-24">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow">Case files</div>
              <h2 className="h-section mt-3 max-w-2xl">Open an assessment and watch it run.</h2>
            </div>
            <p className="max-w-md text-[14.5px] leading-relaxed text-ink-2">
              Two deliveries of the same convoy perception model — ResNet-18 traffic-sign recognition, twelve contract lots. Every number on the results
              screens comes from the delivered artefact itself.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <Reveal>
            <CaseCard c={a} facts={caseFacts(a)} />
          </Reveal>
          <Reveal delay={90}>
            <CaseCard c={b} facts={caseFacts(b)} />
          </Reveal>
          <Reveal delay={180}>
            <Link
              href="/assess/"
              className="group flex h-full min-h-[380px] flex-col justify-between rounded-2xl border-2 border-dashed border-line-2 bg-canvas/40 p-7 transition hover:border-brand/50 hover:bg-brand-50/40"
            >
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-brand shadow-card">
                  <Icon.Upload size={20} />
                </div>
                <div className="mt-6 text-[22px] font-medium tracking-[-0.03em]">Assess your own model</div>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
                  Submit a TorchScript or ONNX artefact with its INT8 build and a signed lot manifest. Pramana runs the same thirteen stages and returns a
                  signed report.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {["TorchScript", "ONNX", "COCO", "YOLO"].map((f) => (
                    <span key={f} className="chip">
                      {f}
                    </span>
                  ))}
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white transition group-hover:translate-x-1">
                  <Icon.Arrow size={16} />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function caseFacts(c: CaseFile): [string, string][] {
  const i8 = c.ladder.int8;
  const flagged = c.lots.filter((l) => l.rejected);
  return [
    ["INT8 detection", `p ${i8.p_is_floor ? "≤" : "="} ${i8.p.toFixed(5)}${i8.p_is_floor ? " · floor" : ""}`],
    ["Concentration", i8.condition_met ? `class ${i8.dominant_class} · ${GTSRB[i8.dominant_class ?? 0]}` : `diffuse · ${i8.classes_at_90} classes`],
    ["Supplier lots", flagged.length ? `${flagged.map((f) => f.lot_id).join(", ")} flagged · e = ${flagged[0].e_merged.toFixed(0)}` : `0 of 12 flagged`],
    ["Field monitor", c.monitor.crossed ? `crossed at receipt ${c.monitor.crossing_index?.toLocaleString("en-IN")}` : "no crossing"],
  ];
}

function CaseCard({ c, facts }: { c: CaseFile; facts: [string, string][] }) {
  const tone = STATE_TONE[c.disposition.final] ?? "neutral";
  const crit = tone === "crit";
  return (
    <Link href={`/cases/${c.id}/`} className="card group flex h-full min-h-[380px] flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className={`relative h-28 overflow-hidden border-b border-line ${crit ? "bg-gradient-to-br from-crit-50 to-surface" : "bg-gradient-to-br from-brand-50 to-surface"}`}>
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div className="absolute bottom-3 left-5 right-5 flex items-end gap-[3px]">
          {c.ladder.int8.per_class.map((v, i) => {
            const max = Math.max(...c.ladder.int8.per_class) || 1;
            const hl = i === c.ladder.int8.dominant_class && c.ladder.int8.condition_met;
            return <div key={i} className={`w-full rounded-t-[2px] ${hl ? "bg-crit" : "bg-brand/40"}`} style={{ height: `${4 + (v / max) * 56}px` }} />;
          })}
        </div>
        <div className="absolute left-5 top-4 font-mono text-[11px] text-ink-2">{c.report_id}</div>
        <div className="absolute right-5 top-3.5">
          <Pill tone={tone}>
            <StateIcon tone={tone} size={11} /> {STATE_LABEL[c.disposition.final]}
          </Pill>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="text-[20px] font-medium leading-snug tracking-[-0.025em]">{c.title}</div>
        <div className="mt-1.5 text-[13px] text-muted">
          {c.delivery} · ResNet-18 · {pct(c.artefact.accuracy.fp32, 1)} FP32 accuracy
        </div>
        <dl className="mt-5 space-y-2">
          {facts.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-3 border-b border-dashed border-line pb-2 text-[13px]">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right font-mono text-[12px] text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="text-[14px] font-medium">Open case file</span>
          <span className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition group-hover:translate-x-1 ${crit ? "bg-crit" : "bg-brand"}`}>
            <Icon.Arrow size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ================================================================== ledger */

function Ledger() {
  return (
    <section id="ledger" className="scroll-mt-20 py-24">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow">Blockchain &amp; cybersecurity</div>
              <h2 className="h-section mt-3 max-w-2xl">Append-only. Signed. Anchored beyond our own reach.</h2>
            </div>
            <p className="max-w-md text-[14.5px] leading-relaxed text-ink-2">
              This is the live ledger of case PRM-2026-0417. Verify it in your own browser, then try to rewrite a verdict — first as an outsider, then as an
              insider who holds every key.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="mt-10">
            <LedgerDemo caseId="prm-2026-0417" />
          </div>
        </Reveal>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            [
              "Why not a full blockchain",
              "One certifying authority means the problem is tamper-evidence, not consensus. A consensus protocol inside an air gap buys latency and an availability dependency, and a token buys nothing at all.",
            ],
            [
              "What the anchor buys",
              "The one property of that family that matters: append-only public verifiability. The Merkle root goes to an RFC 3161 timestamp that verifies with the cable out, so retroactive edits are caught by a party holding no key of ours.",
            ],
            [
              "What it does not",
              "It does not stop a compromised certifier. It converts “trust us” into “trust us or catch us” — the honest version of what a distributed ledger is usually claimed to give you.",
            ],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 80}>
              <div className="h-full rounded-2xl border border-line bg-surface p-6">
                <div className="text-[15px] font-medium">{t}</div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== calibration */

function CalibrationSection({ cal }: { cal: Calibration }) {
  const ct = cal.transfer.null_corpus_transfer_delta;
  const ft = cal.transfer.null_family_transfer_delta;
  return (
    <section id="calibration" className="scroll-mt-20 border-y border-line bg-surface py-24">
      <div className="container-x">
        <Reveal>
          <div className="eyebrow">Calibration</div>
          <h2 className="h-section mt-3 max-w-3xl">Every threshold comes from models we trained. {cal.models} of them.</h2>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-ink-2">
            No hand-picked constants. Each p-value is a rank against a population of independently trained clean models, and the instrument&apos;s
            resolution is bounded by that population&apos;s size — so the floor is printed beside every result.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [String(cal.models), "clean models trained", "three arms · one recipe"],
            [`${cal.gpu_hours}`, "GPU-hours", cal.gpu.replace("NVIDIA GeForce ", "")],
            [pct(cal.operational_acc_median, 2), "median GTSRB accuracy", `lowest ${pct(cal.operational_acc_min, 2)} · floor 95%`],
            [String(cal.below_acc_floor), "models below accuracy floor", "none excluded"],
          ].map(([v, k, s]) => (
            <Reveal key={k}>
              <div className="rounded-2xl border border-line bg-canvas/50 p-5">
                <div className="text-[36px] font-medium tracking-[-0.04em]">{v}</div>
                <div className="mt-1 text-[13px] text-ink">{k}</div>
                <div className="mt-0.5 font-mono text-[11px] text-muted">{s}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="card mt-5 p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="text-[14px] font-medium">How far FP32 → INT8 conversion moves a clean model, by training arm</div>
              <div className="font-mono text-[11px] text-muted">E1′ · torch.ao FX PTQ · x86</div>
            </div>
            <div className="mt-5">
              <CalibrationChart cal={cal} />
            </div>
          </div>
        </Reveal>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Reveal>
            <TransferCard label="Change the corpus only" contrast="ResNet-18: GTSRB → CIFAR-10" delta={ct.median_shift_over_iqr} ci={ct.bootstrap_ci_median_shift} ceiling={cal.transfer.transfer_ceiling} />
          </Reveal>
          <Reveal delay={80}>
            <TransferCard label="Change the architecture only" contrast="CIFAR-10: ResNet-18 → SmallCNN" delta={ft.median_shift_over_iqr} ci={ft.bootstrap_ci_median_shift} ceiling={cal.transfer.transfer_ceiling} />
          </Reveal>
        </div>
        <Reveal>
          <p className="mt-5 max-w-3xl text-[14px] leading-relaxed text-ink-2">
            Both shifts land roughly nine times beyond our own ceiling. So a null fitted on one corpus or family is never silently reused on another:
            Pramana returns <span className="font-mono text-[13px] text-ink">assessment_unavailable: no_fitted_null</span> instead. That is a number that
            constrains us, not the vendor — and we publish it.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function TransferCard({ label, contrast, delta, ci, ceiling }: { label: string; contrast: string; delta: number; ci: [number, number]; ceiling: number }) {
  const max = 11;
  return (
    <div className="h-full rounded-2xl border border-line bg-surface p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-medium">{label}</div>
          <div className="mt-0.5 font-mono text-[11px] text-muted">{contrast}</div>
        </div>
        <Pill tone="crit">refused</Pill>
      </div>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-[40px] font-medium tracking-[-0.04em]">+{delta.toFixed(2)}</span>
        <span className="text-[13px] text-muted">IQR median shift</span>
      </div>
      <div className="relative mt-4 h-8">
        <div className="absolute inset-x-0 top-3.5 h-px bg-line-2" />
        <div className="absolute top-2 h-3 rounded-full bg-brand-100" style={{ left: `${(ci[0] / max) * 100}%`, width: `${((ci[1] - ci[0]) / max) * 100}%` }} />
        <div className="absolute top-1 h-5 w-[2px] bg-ink" style={{ left: `${(delta / max) * 100}%` }} />
        <div className="absolute top-0 h-7 w-[2px] bg-crit" style={{ left: `${(ceiling / max) * 100}%` }} />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10.5px] text-muted">
        <span>ceiling {ceiling}</span>
        <span>
          95% CI [{ci[0].toFixed(2)}, {ci[1].toFixed(2)}]
        </span>
      </div>
    </div>
  );
}

/* ================================================================== doctrine */

function Doctrine() {
  const never = [
    ["That a model is clean.", "No efficient black-box test can detect a backdoor planted to be undetectable — a theorem, not an engineering gap. So a verdict takes one form only: no evidence of conditional misbehaviour, under a named battery, at named rungs, against a named null."],
    ["That a certificate describes the fielded model.", "Certified robustness is a property of the ensemble we build to measure it. It never becomes evidence about the artefact that ships, and the report keeps the two apart."],
    ["That a predicted threshold is measured.", "Until its experiment has run on real artefacts, the concentration operating point is tagged predicted in every report — and no disposition may rest on it alone."],
    ["That a statistical flag is a causal finding.", "Attribution stays set-valued until leave-lot-out retraining has run. A supplier is flagged at a declared false-discovery rate, not convicted."],
  ];
  return (
    <section id="doctrine" className="scroll-mt-20 py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <div className="eyebrow">Doctrine</div>
          <h2 className="h-section mt-3">What Pramana will never say.</h2>
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink-2">
            An assurance tool is only as useful as the claims it refuses to make. These refusals are enforced in code: a build gate fails if any emitted
            report asserts one of them.
          </p>
          <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
            <div className="text-[38px] font-medium leading-none tracking-[-0.02em]">प्रमाण</div>
            <div className="mt-2 font-mono text-[12px] text-muted">pramāṇa · Sanskrit</div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">
              In Indian epistemology, the means by which valid knowledge is obtained. Not the claim — the instrument that makes the claim trustworthy.
            </p>
          </div>
          <div className="mt-4 rounded-2xl border border-line bg-surface p-6">
            <div className="eyebrow"></div>
            <div className="mt-2 text-[15px] font-medium"></div>
            <div className="mt-1 text-[13px] text-ink-2"></div>
          </div>
        </Reveal>
        <div className="space-y-3">
          {never.map(([t, d], i) => (
            <Reveal key={t} delay={i * 70}>
              <div className="flex gap-5 rounded-2xl border border-line bg-surface p-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-crit/30 bg-crit-50 text-crit">
                  <Icon.X size={14} />
                </div>
                <div>
                  <div className="text-[17px] font-medium tracking-[-0.02em]">{t}</div>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">{d}</p>
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal>
            <div className="rounded-2xl border border-line bg-ink p-6 text-white">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/50">The only permitted verdict</div>
              <p className="mt-3 font-mono text-[13px] leading-relaxed text-white/85">
                No evidence of conditional misbehaviour was found under battery <span className="text-[#9DB3FF]">{"{digest}"}</span> at rungs{" "}
                <span className="text-[#9DB3FF]">{"{rungs}"}</span>, against null (family=<span className="text-[#9DB3FF]">{"{family}"}</span>, corpus=
                <span className="text-[#9DB3FF]">{"{corpus}"}</span>, converter=<span className="text-[#9DB3FF]">{"{converter}"}</span>).
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== closing */

function Closing() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line">
      <div className="hero-wash absolute inset-0 -z-10 opacity-90" />
      <div className="container-x py-24 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-[36px] font-medium leading-[1.05] tracking-[-0.04em] sm:text-[56px]">
            <span className="text-ink/40">Verify the delivery.</span> Then interrogate the model.
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/cases/prm-2026-0417/" className="btn-primary">
              Open PRM-2026-0417 <Icon.Arrow size={16} />
            </Link>
            <Link href="/assess/" className="btn-ghost">
              <Icon.Upload size={16} /> Assess a model
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
