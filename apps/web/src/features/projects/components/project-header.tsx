// Purpose: Render project identity, status, progress, and workspace actions.

import { Download, Pause, Share2 } from "lucide-react";

import { getProjectOverview } from "@/features/projects/data/research-project-content";

export function ProjectHeader({ projectId }: { projectId: string }) {
  const projectOverview = getProjectOverview(projectId);

  return (
    <section className="glass-panel rounded-xl p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-xs font-semibold uppercase tracking-normal text-primary">
              Status: {projectOverview.status}
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-normal text-on-surface-variant">
              ID: {projectOverview.id}
            </span>
            <span className="rounded-md border border-white/10 bg-surface-container px-2 py-1 font-mono text-xs font-semibold uppercase tracking-normal text-on-surface-variant">
              Domain: {projectOverview.domain}
            </span>
          </div>
          <h1 className="font-display text-3xl font-semibold leading-[1.15] text-on-surface">
            {projectOverview.title}
          </h1>
        </div>

        <div className="flex w-full flex-col gap-4 sm:w-auto sm:min-w-80 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1 sm:w-52">
            <div className="mb-1 flex justify-between font-display text-xs font-semibold text-on-surface-variant">
              <span>Pipeline Phase</span>
              <span className="text-primary">{projectOverview.phase}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full rounded-full bg-primary" style={{ width: `${projectOverview.progress}%` }} />
            </div>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Pause project", icon: Pause },
              { label: "Export project", icon: Download },
              { label: "Share project", icon: Share2 },
            ].map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-on-surface transition-colors hover:bg-white/[0.05] hover:text-primary"
                  type="button"
                  aria-label={action.label}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
