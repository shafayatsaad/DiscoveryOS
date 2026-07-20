// Purpose: Render the Stitch-aligned dark glass top navigation with working links.

import Link from "next/link";
import { Microscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function TopNav() {
  return (
    <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between glass-nav px-5 sm:px-10">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="outline-none transition-transform hover:scale-[0.98]"
        >
          <Logo size="sm" />
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          <Link className="nav-link relative py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full" href="/dashboard">
            Projects
          </Link>
          <a className="nav-link relative py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full" href="#pipeline">
            Current Research
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          asChild
          size="sm"
          variant="secondary"
          className="hidden min-w-[122px] sm:inline-flex border-primary/20 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-300"
        >
          <Link href="/dashboard">New Research</Link>
        </Button>
        <div
          aria-label="DiscoveryOS workspace avatar"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
          role="img"
        >
          <Microscope className="h-4 w-4 text-primary" />
        </div>
      </div>
    </nav>
  );
}
