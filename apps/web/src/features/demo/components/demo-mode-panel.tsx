"use client";

// Purpose: Render curated cached demo workflows for one-click research launches.

import { Play, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/ui/motion";
import { demoProjects } from "@/features/demo/data/demo-projects";

export function DemoModePanel() {
  return (
    <section className="flex flex-col gap-4" aria-labelledby="demo-mode-heading">
      <div className="flex items-center justify-between gap-4">
        <h2
          id="demo-mode-heading"
          className="flex items-center gap-2 font-display text-2xl font-semibold leading-[1.25] text-on-surface"
        >
          <Zap className="h-5 w-5 text-primary" />
          Demo Mode
        </h2>
        <span className="rounded-md bg-emerald-500/10 px-2 py-1 font-mono text-xs font-semibold text-emerald-300">
          Cached results
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {demoProjects.map((project, index) => (
          <AnimatedCard
            className="glass-panel rounded-lg transition-colors hover:bg-white/[0.05]"
            delay={index * 0.035}
            key={project.id}
          >
            <div className="flex h-full flex-col p-4">
              <span className="mb-3 w-fit rounded-md bg-primary/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-normal text-primary">
                {project.domain}
              </span>
              <h3 className="font-display text-lg font-semibold leading-snug text-on-surface">
                {project.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-on-surface-variant">
                {project.summary}
              </p>
              <Button asChild className="mt-5 w-full" size="sm">
                <Link href={project.href}>
                  <Play className="h-4 w-4" />
                  Launch
                </Link>
              </Button>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </section>
  );
}
