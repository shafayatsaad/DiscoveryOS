// Purpose: Render the dashboard's persistent research navigation shell.

import { Menu, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { navItems, utilityNavItems } from "@/features/dashboard/data/dashboard-content";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  return (
    <>
      <details className="sticky top-0 z-40 border-b border-white/[0.06] bg-surface/90 backdrop-blur-xl md:hidden [&>summary::-webkit-details-marker]:hidden">
        <summary className="flex h-16 cursor-pointer list-none items-center justify-between px-5">
          <span className="font-display text-xl font-extrabold text-on-surface">DiscoveryOS</span>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/[0.04] hover:text-primary">
            <Menu className="h-4 w-4" />
          </span>
        </summary>
        <nav className="space-y-1 border-t border-white/[0.05] px-3 py-3" aria-label="Mobile dashboard">
          {[...navItems, ...utilityNavItems].map((item) => {
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
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </details>

      <aside className="glass-panel sticky top-0 hidden h-screen w-72 shrink-0 flex-col rounded-none border-y-0 border-l-0 py-6 md:flex">
        <div className="border-b border-white/[0.05] px-6 pb-6">
          <Link href="/" className="font-display text-2xl font-extrabold text-on-surface">
            DiscoveryOS
          </Link>
          <p className="mt-2 font-display text-xs font-semibold uppercase tracking-normal text-on-surface-variant">
            Autonomous Research
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Dashboard">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href ?? "#"}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 font-display text-sm font-semibold transition-all duration-200 active:scale-[0.98]",
                  item.active
                    ? "bg-white/[0.05] text-primary"
                    : "text-on-surface-variant hover:bg-white/[0.04] hover:text-on-surface",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 border-t border-white/[0.05] px-4 py-5">
          <Button className="w-full">
            <Plus className="h-4 w-4" />
            New Research
          </Button>
          {utilityNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-display text-sm font-semibold text-on-surface-variant transition-all hover:bg-white/[0.04] hover:text-on-surface"
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </aside>
    </>
  );
}
