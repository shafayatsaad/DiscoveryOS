// Purpose: Render Research Jobs navigation with the active workflow section.

import Link from "next/link";
import { Menu, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { jobNavItems } from "@/features/workflows/data/research-jobs-content";
import { cn } from "@/lib/utils";

export function ResearchJobsSidebar() {
  return (
    <>
      <details className="sticky top-0 z-50 border-b border-white/10 bg-surface/90 backdrop-blur-xl md:hidden [&>summary::-webkit-details-marker]:hidden">
        <summary className="flex h-16 cursor-pointer list-none items-center justify-between px-5">
          <span className="font-display text-xl font-extrabold text-on-surface">DiscoveryOS</span>
          <Menu className="h-4 w-4 text-on-surface-variant" />
        </summary>
        <nav className="space-y-1 border-t border-white/[0.05] px-3 py-3" aria-label="Research jobs mobile">
          {jobNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href ?? "#"}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 font-display text-sm font-semibold transition-colors",
                  item.active
                    ? "bg-white/[0.05] text-primary"
                    : "text-on-surface-variant hover:bg-white/[0.04] hover:text-on-surface",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </details>

      <aside className="hidden h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-surface/80 py-6 backdrop-blur-xl md:sticky md:top-0 md:flex">
        <div className="px-6">
          <Link href="/dashboard" className="block">
            <span className="block font-display text-2xl font-extrabold text-on-surface">
              DiscoveryOS
            </span>
            <span className="mt-2 block font-display text-xs font-semibold uppercase tracking-normal text-on-surface-variant">
              Autonomous Research
            </span>
          </Link>
          <Button className="mt-8 w-full bg-primary-container text-on-primary-container hover:bg-primary">
            <Plus className="h-4 w-4" />
            New Research
          </Button>
        </div>

        <nav className="mt-10 flex-1 space-y-1 overflow-y-auto px-4" aria-label="Research jobs">
          {jobNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href ?? "#"}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 font-display text-sm font-semibold transition-all active:scale-[0.98]",
                  item.active
                    ? "bg-white/[0.05] text-primary"
                    : "text-on-surface-variant hover:bg-white/[0.04] hover:text-on-surface",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
