// Purpose: Render the DiscoveryOS global scientific intelligence band with a network visual.

import {
  intelligenceIcons,
  intelligenceNodes,
} from "@/features/landing/data/landing-content";

export function IntelligenceSection() {
  return (
    <section className="relative w-full overflow-hidden border-b border-white/[0.05] bg-surface-container-lowest px-5 py-24 sm:px-10">
      {/* Background gradient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-[150px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-container-max flex-col items-center gap-16 md:flex-row">
        <div className="flex-1">
          <span className="mb-4 inline-block font-display text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            Network Intelligence
          </span>
          <h2 className="mb-4 font-display text-3xl font-semibold leading-[1.2] text-on-surface tracking-tight sm:text-4xl">
            Global Scientific Intelligence
          </h2>
          <p className="max-w-xl text-lg leading-[1.7] text-on-surface-variant">
            Access a decentralized network of literature, datasets, domain
            repositories, and evidence stores — all interconnected through a
            semantic knowledge graph.
          </p>
          <div className="mt-8 flex items-center gap-6">
            {["Literature", "Datasets", "Repos"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    i === 0
                      ? "bg-primary"
                      : i === 1
                        ? "bg-primary/60"
                        : "bg-primary/30"
                  }`}
                />
                <span className="font-display text-xs font-medium text-on-surface-variant">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="relative flex h-72 flex-1 items-center justify-center"
          aria-hidden="true"
        >
          {/* Connection lines */}
          <svg
            className="absolute inset-0 h-full w-full text-primary/25"
            viewBox="0 0 400 220"
          >
            <path
              d="M86 56 L196 112 L304 70 M196 112 L278 170 M86 56 L130 142 M196 112 L330 156"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Animated nodes */}
          {intelligenceNodes.map((node, i) => (
            <span
              key={node.label}
              className={`absolute h-3 w-3 rounded-full bg-primary shadow-[0_0_20px_rgba(173,198,255,0.4)] ${
                node.className
              } ${i === 1 ? "animate-pulse" : ""}`}
            />
          ))}

          {/* Icon grid */}
          <div className="grid grid-cols-3 gap-5">
            {intelligenceIcons.map((Icon) => (
              <div
                key={Icon.displayName ?? Icon.name}
                className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/[0.06] bg-surface-container/60 backdrop-blur-sm"
              >
                <Icon className="h-6 w-6 text-on-surface-variant" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(173,198,255,0.05),transparent_55%)]" />
    </section>
  );
}
