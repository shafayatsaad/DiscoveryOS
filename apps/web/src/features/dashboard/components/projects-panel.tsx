// Purpose: Render domain-agnostic research workspaces in Stitch's bento card style.

import Link from "next/link";
import { Check, FolderOpen } from "lucide-react";

import { MotionDiv } from "@/features/landing/components/motion-primitives";
import { researchProjects } from "@/features/dashboard/data/dashboard-content";

export function ProjectsPanel() {
  const activeProjects = researchProjects.filter((project) => project.status !== "completed");
  const completedProject = researchProjects.find((project) => project.status === "completed");

  return (
    <section className="flex flex-col gap-4" aria-labelledby="active-projects-heading">
      <div className="flex items-center justify-between">
        <h2
          id="active-projects-heading"
          className="flex items-center gap-2 font-display text-2xl font-semibold leading-[1.25] text-on-surface"
        >
          <FolderOpen className="h-5 w-5 text-primary" />
          Active Projects
        </h2>
        <a href="#" className="font-display text-xs font-semibold uppercase tracking-normal text-primary hover:underline">
          View All
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {activeProjects.map((project) => (
          <MotionDiv
            key={project.title}
            className="glass-panel min-h-36 rounded-lg transition-all duration-300 hover:bg-white/[0.03] hover:border-primary/20 hover:shadow-card-hover"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Link className="flex h-full flex-col justify-between p-5" href={project.href}>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <span className="mb-3 inline-flex rounded-md bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-primary border border-primary/15">
                    {project.domain}
                  </span>
                  <h3 className="font-display text-xl font-semibold leading-[1.3] text-on-surface transition-colors hover:text-primary">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.5] text-on-surface-variant">
                    {project.description}
                  </p>
                </div>
                <span className="rounded-md bg-primary/10 px-2.5 py-1 font-mono text-sm font-bold text-primary border border-primary/15 shrink-0">
                  {project.progress}%
                </span>
              </div>
              <div>
                <div className="mb-2 flex justify-between gap-3 font-display text-xs font-semibold text-on-surface-variant">
                  <span>{project.phase}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary via-[#7dd3fc] to-secondary" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            </Link>
          </MotionDiv>
        ))}

        {completedProject ? (
          <MotionDiv
            className="glass-panel min-h-28 rounded-lg transition-all duration-300 hover:bg-white/[0.03] hover:border-primary/20 hover:shadow-card-hover md:col-span-2"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Link className="flex min-h-28 items-center justify-between gap-4 p-5" href={completedProject.href}>
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <Check className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="mb-2 inline-flex rounded-md bg-white/[0.05] px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-normal text-on-surface-variant">
                    {completedProject.domain}
                  </span>
                  <h3 className="font-display text-xl font-semibold leading-[1.3] text-on-surface">
                    {completedProject.title}
                  </h3>
                  <p className="text-sm leading-[1.5] text-on-surface-variant truncate">
                    {completedProject.description}
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-md bg-emerald-500/10 border border-emerald-500/15 px-3 py-1 font-display text-xs font-semibold uppercase tracking-normal text-emerald-400">
                Completed
              </span>
            </Link>
          </MotionDiv>
        ) : null}
      </div>
    </section>
  );
}
