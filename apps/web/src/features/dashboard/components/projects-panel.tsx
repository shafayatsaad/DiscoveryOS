// Purpose: Render mocked active research projects in Stitch's bento card style.

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
            className="glass-panel flex min-h-36 cursor-pointer flex-col justify-between rounded-lg p-5 transition-colors hover:bg-white/[0.05]"
            whileHover={{ y: -3 }}
            transition={{ duration: 0.18 }}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-semibold leading-[1.3] text-on-surface transition-colors">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.5] text-on-surface-variant">
                  {project.description}
                </p>
              </div>
              <span className="rounded-md bg-primary/10 px-2 py-1 font-mono text-sm font-semibold text-primary">
                {project.progress}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
              <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
            </div>
          </MotionDiv>
        ))}

        {completedProject ? (
          <MotionDiv
            className="glass-panel flex min-h-28 items-center justify-between gap-4 rounded-lg p-5 transition-colors hover:bg-white/[0.05] md:col-span-2"
            whileHover={{ y: -3 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary">
                <Check className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-xl font-semibold leading-[1.3] text-on-surface">
                  {completedProject.title}
                </h3>
                <p className="text-sm leading-[1.5] text-on-surface-variant">
                  {completedProject.description}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-md bg-surface-container-highest px-3 py-1 font-display text-xs font-semibold uppercase tracking-normal text-on-surface">
              Completed
            </span>
          </MotionDiv>
        ) : null}
      </div>
    </section>
  );
}
