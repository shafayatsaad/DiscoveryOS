// Purpose: Render the DiscoveryOS global scientific intelligence band with a network visual.

import {
  intelligenceIcons,
  intelligenceNodes,
} from "@/features/landing/data/landing-content";

export function IntelligenceSection() {
  return (
    <section className="relative w-full overflow-hidden border-b border-white/[0.05] bg-surface-container-lowest px-5 py-24 sm:px-10">
      {/* Background gradient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[150px] animate-glow-pulse" />

      <div className="relative z-10 mx-auto flex w-full max-w-container-max flex-col items-center gap-16 md:flex-row">
        <div className="flex-1">
          <span className="mb-4 inline-block font-display text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            Network Intelligence
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold leading-[1.2] text-on-surface tracking-tight sm:text-4xl">
            Global Scientific Intelligence
          </h2>
          <p className="max-w-xl text-base leading-[1.7] text-on-surface-variant">
            Access a decentralized network of literature, datasets, domain
            repositories, and evidence stores — all interconnected through a
            semantic knowledge graph.
          </p>
          <div className="mt-8 flex items-center gap-6">
            {["Literature", "Datasets", "Repos"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    i === 0
                      ? "bg-primary shadow-[0_0_10px_#adc6ff]"
                      : i === 1
                        ? "bg-secondary shadow-[0_0_10px_#c4b5fd]"
                        : "bg-tertiary shadow-[0_0_10px_#7dd3fc]"
                  }`}
                />
                <span className="font-display text-xs font-semibold text-on-surface-variant">
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
          {/* Connection lines with animated dashes */}
          <svg
            className="absolute inset-0 h-full w-full text-primary/30"
            viewBox="0 0 400 220"
          >
            <path
              d="M86 56 L196 112 L304 70 M196 112 L278 170 M86 56 L130 142 M196 112 L330 156"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="connection-line"
            />
          </svg>

          {/* Animated nodes with pulse effects */}
          {intelligenceNodes.map((node, i) => (
            <span
              key={node.label}
              className={`absolute h-3.5 w-3.5 rounded-full bg-primary shadow-glow-sm node-pulse ${
                node.className
              } ${i === 1 ? "bg-secondary shadow-[0_0_15px_#c4b5fd]" : i === 2 ? "bg-tertiary shadow-[0_0_15px_#7dd3fc]" : ""}`}
              title={node.label}
            />
          ))}

          {/* Icon grid using proper glass-cards */}
          <div className="grid grid-cols-3 gap-5 relative z-10">
            {intelligenceIcons.map((Icon) => (
              <div
                key={Icon.displayName ?? Icon.name}
                className="flex h-16 w-16 items-center justify-center rounded-xl glass-card hover:scale-[1.05] transition-transform duration-300"
              >
                <Icon className="h-6 w-6 text-primary" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(173,198,255,0.03),transparent_55%)]" />
    </section>
  );
}
