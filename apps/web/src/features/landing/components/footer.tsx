// Purpose: Render the Stitch-aligned dark footer.

export function Footer() {
  return (
    <footer className="mt-auto flex w-full items-center justify-between border-t border-white/[0.05] bg-surface px-5 py-4 font-display text-xs font-semibold uppercase tracking-normal sm:px-10">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-on-surface">DiscoveryOS</span>
        <span className="text-on-surface-variant">|</span>
        <span className="text-on-surface-variant">
          (c) 2026 DiscoveryOS | Autonomous Scientific Research Shell
        </span>
      </div>
      <div className="hidden items-center gap-7 md:flex">
        <a className="nav-link" href="#top">
          Documentation
        </a>
        <a className="nav-link" href="#top">
          Support
        </a>
        <a className="nav-link" href="#top">
          Ethics Policy
        </a>
        <a className="nav-link" href="#top">
          API
        </a>
      </div>
    </footer>
  );
}
