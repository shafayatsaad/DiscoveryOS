// Purpose: Render the Stitch-aligned dark glass top navigation with working links.

import Link from "next/link";
import { Microscope } from "lucide-react";

import { Button } from "@/components/ui/button";

export function TopNav() {
  return (
    <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/10 bg-surface/80 px-5 backdrop-blur-xl sm:px-10">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="font-display text-xl font-extrabold text-on-surface outline-none transition-colors focus-visible:text-primary"
        >
          DiscoveryOS
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          <Link className="nav-link" href="/dashboard">
            Projects
          </Link>
          <a className="nav-link" href="#pipeline">
            Current Research
          </a>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          asChild
          size="sm"
          className="hidden min-w-[122px] sm:inline-flex"
        >
          <Link href="/dashboard">New Research</Link>
        </Button>
        <div
          aria-label="DiscoveryOS workspace avatar"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-surface-container-high shadow-inner"
          role="img"
        >
          <Microscope className="h-4 w-4 text-primary" />
        </div>
      </div>
    </nav>
  );
}
