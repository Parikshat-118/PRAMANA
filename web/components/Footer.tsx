import Link from "next/link";
import { Logo } from "./ui";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="text-[17px] font-semibold tracking-[-0.02em]">Pramana</span>
          </div>
          <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-ink-2">
            Behavioural integrity assurance for multi-contributor defence computer-vision pipelines.
            Tested at the precision it ships, stated in the units the contract uses, anchored where we
            cannot rewrite it.
          </p>
          <p className="mt-5 font-mono text-[11px] leading-relaxed text-muted">
            प्रमाण — the means by which valid knowledge is obtained.
          </p>
        </div>

        <FooterCol
          title="Platform"
          links={[
            ["Precision ladder", "/#platform"],
            ["Contributor evidence", "/#platform"],
            ["Ledger & anchor", "/#ledger"],
            ["Calibration", "/#calibration"],
          ]}
        />
        <FooterCol
          title="Case files"
          links={[
            ["PRM-2026-0417", "/cases/prm-2026-0417/"],
            ["PRM-2026-0422", "/cases/prm-2026-0422/"],
            ["Assess a model", "/assess/"],
          ]}
        />
        
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-5 font-mono text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span></span>
          <span></span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="eyebrow">{title}</div>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-[13.5px] text-ink-2 transition hover:text-ink">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
