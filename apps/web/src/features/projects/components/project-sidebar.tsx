"use client";

// Purpose: Render the project workspace navigation for desktop and mobile.

import Link from "next/link";
import { FlaskConical, Menu, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/features/landing/components/motion-primitives";
import { getProjectNavItems } from "@/features/projects/data/research-project-content";
import { cn } from "@/lib/utils";

type ProjectSidebarProps = {
  projectId: string;
  activeSection?: Parameters<typeof getProjectNavItems>[1];
};

export function ProjectSidebar({ projectId, activeSection = "project" }: ProjectSidebarProps) {
  const projectNavItems = getProjectNavItems(projectId, activeSection);

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

      <MotionDiv
        animate={{ opacity: 1, x: 0 }}
        className="hidden h-screen w-[280px] shrink-0 flex-col border-r border-white/10 bg-surface/80 py-6 backdrop-blur-xl md:sticky md:top-0 md:flex"
        initial={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
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
          <Button asChild className="mt-8 w-full bg-primary-container text-on-primary-container hover:bg-primary">
            <Link href="/dashboard">
              <Plus className="h-4 w-4" />
              New Research
            </Link>
          </Button>
        </div>

        <nav className="mt-10 flex-1 space-y-1 overflow-y-auto px-4" aria-label="Project">
          {projectNavItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <MotionDiv
                animate={{ opacity: 1, x: 0 }}
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                transition={{ delay: index * 0.025, duration: 0.22 }}
              >
                <a
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
              </MotionDiv>
            );
          })}
        </nav>
      </MotionDiv>
    </>
  );
}
