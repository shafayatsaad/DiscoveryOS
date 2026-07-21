"use client";

// Purpose: Render the project workspace navigation for desktop and mobile.

import Link from "next/link";
import { Menu, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { MotionDiv } from "@/features/landing/components/motion-primitives";
import { getProjectNavItems } from "@/features/projects/data/research-project-content";
import { cn } from "@/lib/utils";

type ProjectSidebarProps = {
  projectId: string;
  activeSection?: Parameters<typeof getProjectNavItems>[1];
};

export function ProjectSidebar({
  projectId,
  activeSection = "project",
}: ProjectSidebarProps) {
  const projectNavItems = getProjectNavItems(projectId, activeSection);

  return (
    <>
      <details className="sticky top-0 z-50 border-b border-white/10 bg-surface/90 backdrop-blur-xl md:hidden [&>summary::-webkit-details-marker]:hidden">
        <summary className="flex h-16 cursor-pointer list-none items-center justify-between px-5">
          <Link
            href="/"
            className="focus-ring rounded-lg transition-transform hover:scale-[0.98]"
          >
            <Logo size="sm" />
          </Link>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/[0.04] hover:text-primary">
            <Menu className="h-4 w-4" />
          </span>
        </summary>
        <nav
          className="space-y-1 border-t border-white/[0.05] px-3 py-3"
          aria-label="Project mobile"
        >
          {projectNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href ?? "#"}
                prefetch={true}
                className={cn(
                  "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 font-display text-sm font-semibold transition-colors border-l-2",
                  item.active
                    ? "bg-primary/5 text-primary border-primary"
                    : "text-on-surface-variant border-transparent hover:bg-white/[0.04] hover:text-on-surface",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </details>

      <MotionDiv
        animate={{ opacity: 1, x: 0 }}
        className="hidden h-screen w-[280px] shrink-0 flex-col border-r border-white/10 bg-surface/40 py-6 backdrop-blur-xl md:sticky md:top-0 md:flex glass-panel rounded-none border-y-0 border-l-0"
        initial={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        <div className="px-6">
          <Link href="/dashboard" className="focus-ring rounded-lg transition-transform hover:scale-[0.98]">
            <Logo size="sm" />
          </Link>
          <p className="mt-2.5 font-display text-[10px] font-bold uppercase tracking-wider text-outline">
            Autonomous Research
          </p>
          <Button
            asChild
            className="mt-8 w-full bg-gradient-to-r from-primary via-primary/95 to-primary/85 text-on-primary shadow-[0_4px_12px_rgba(173,198,255,0.15)] hover:shadow-[0_4px_20px_rgba(173,198,255,0.3)] hover:brightness-[1.05]"
          >
            <Link href="/dashboard">
              <Plus className="h-4 w-4 shrink-0" />
              New Research
            </Link>
          </Button>
        </div>

        <nav
          className="mt-10 flex-1 space-y-1 overflow-y-auto px-4"
          aria-label="Project"
        >
          {projectNavItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <MotionDiv
                animate={{ opacity: 1, x: 0 }}
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                transition={{ delay: index * 0.025, duration: 0.22 }}
              >
                <Link
                  href={item.href ?? "#"}
                  prefetch={true}
                  className={cn(
                    "focus-ring flex items-center gap-3 rounded-lg px-4 py-3 font-display text-sm font-semibold transition-all duration-200 active:scale-[0.98] border-l-2",
                    item.active
                      ? "bg-primary/5 text-primary border-primary shadow-[0_0_15px_rgba(173,198,255,0.06)]"
                      : "text-on-surface-variant border-transparent hover:bg-white/[0.02] hover:text-on-surface hover:border-white/10",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </MotionDiv>
            );
          })}
        </nav>
      </MotionDiv>
    </>
  );
}
