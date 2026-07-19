// Purpose: Render the Stitch global scientific intelligence band with a network visual.

import { intelligenceIcons, intelligenceNodes } from "@/features/landing/data/landing-content";

export function IntelligenceSection() {
  return (
    <section className="relative w-full overflow-hidden border-b border-white/[0.05] bg-surface-container-lowest px-5 py-24 sm:px-10">
      <div className="relative z-10 mx-auto flex w-full max-w-container-max flex-col items-center gap-12 md:flex-row">
        <div className="flex-1">
          <h2 className="mb-4 font-display text-3xl font-semibold leading-[1.2] text-on-surface tracking-normal sm:text-4xl">
            Global Scientific Intelligence
          </h2>
          <p className="max-w-xl text-lg leading-[1.6] text-on-surface-variant">
            Access a decentralized network of real-time laboratory data, clinical trials, and
            genomic repositories.
          </p>
        </div>

        <div className="relative flex h-64 flex-1 items-center justify-center" aria-hidden="true">
          <svg className="absolute inset-0 h-full w-full text-outline/35" viewBox="0 0 400 220">
            <path
              d="M86 56 L196 112 L304 70 M196 112 L278 170 M86 56 L130 142 M196 112 L330 156"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
          {intelligenceNodes.map((node) => (
            <span
              key={node.label}
              className={`absolute h-2 w-2 rounded-full bg-primary/70 shadow-[0_0_18px_rgba(173,198,255,0.35)] ${node.className}`}
            />
          ))}
          <div className="grid grid-cols-3 gap-4 opacity-60">
            {intelligenceIcons.map((Icon) => (
              <Icon key={Icon.displayName ?? Icon.name} className="h-8 w-8 text-on-surface-variant" />
            ))}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(173,198,255,0.05),transparent_55%)]" />
    </section>
  );
}

