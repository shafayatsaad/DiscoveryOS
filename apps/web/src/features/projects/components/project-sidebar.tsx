// Purpose: Render the project workspace navigation for desktop and mobile.

import Link from "next/link";
import { FlaskConical, Menu, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getProjectNavItems } from "@/features/projects/data/research-project-content";
import { cn } from "@/lib/utils";

export function ProjectSidebar({ projectId }: { projectId: string }) {
  const projectNavItems = getProjectNavItems(projectId);

  return (
    <>
      <details className="sticky top-0 z-50 border-b border-white/10 bg-surface/90 backdrop-blur-xl md:hidden [&>summary::-webkit-details-marker]:hidden">
        <summary className="flex h-16 cursor-pointer list-none items-center justify-between px-5">
          <span className="font-display text-xl font-extrabold text-on-surface">DiscoveryOS</span>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/[0.04] hover:text-primary">
            <Menu className="h-4 w-4" />
          </span>
        </summary>
        <nav className="space-y-1 border-t border-white/[0.05] px-3 py-3" aria-label="Project mobile">
          {projectNavItems.map((item) => {
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

      <aside className="hidden h-screen w-[280px] shrink-0 flex-col border-r border-white/10 bg-surface/80 py-6 backdrop-blur-xl md:sticky md:top-0 md:flex">
        <div className="px-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <FlaskConical className="h-9 w-9 text-primary" />
            <span>
              <span className="block font-display text-xl font-extrabold text-on-surface">
                DiscoveryOS
              </span>
              <span className="block font-display text-xs font-semibold uppercase tracking-normal text-on-surface-variant">
                Autonomous Research
              </span>
            </span>
          </Link>
          <Button className="mt-8 w-full bg-primary-container text-on-primary-container hover:bg-primary">
            <Plus className="h-4 w-4" />
            New Research
          </Button>
        </div>

        <nav className="mt-10 flex-1 space-y-1 overflow-y-auto px-4" aria-label="Project">
          {projectNavItems.map((item) => {
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
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
