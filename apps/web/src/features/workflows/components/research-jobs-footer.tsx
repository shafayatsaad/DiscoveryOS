// Purpose: Render footer links for the research jobs workspace.

export function ResearchJobsFooter() {
  return (
    <footer className="mt-auto flex flex-col gap-3 border-t border-white/[0.05] bg-surface px-5 py-4 font-display text-xs font-semibold uppercase tracking-normal sm:px-10 lg:flex-row lg:items-center lg:justify-between">
      <span className="text-on-surface">
        (c) 2026 DiscoveryOS | Autonomous Scientific Research Shell
      </span>
      <div className="flex flex-wrap gap-5 text-on-surface-variant">
        {["Documentation", "Support", "Ethics Policy", "API"].map((label) => (
          <a key={label} className="transition-colors hover:text-primary" href="#">
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
