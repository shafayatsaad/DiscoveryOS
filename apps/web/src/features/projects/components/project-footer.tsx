// Purpose: Render the project workspace footer links from the Stitch screen.

export function ProjectFooter() {
  return (
    <footer className="mt-auto flex flex-col gap-3 border-t border-white/[0.05] bg-surface px-5 py-4 font-display text-xs font-semibold uppercase tracking-normal sm:px-10 lg:flex-row lg:items-center lg:justify-between">
      <span className="text-on-surface-variant">
        (c) 2026 DiscoveryOS | Autonomous Scientific Research Shell
      </span>
      <div className="flex flex-wrap gap-5">
        {["Documentation", "Support", "Ethics Policy", "API"].map((label) => (
          <a key={label} className="text-on-surface-variant transition-colors hover:text-primary" href="#">
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
