// Purpose: Render the active research pipeline title, metadata, and run actions.

import { RotateCw, SquareTerminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import type { BreadcrumbSegment } from "@/components/navigation/breadcrumbs";
import {
  getJobHeaderMeta,
  getJobOverview,
} from "@/features/workflows/data/research-jobs-content";
import { getProjectWorkspace } from "@/features/projects/data/project-workspaces";

export function ResearchJobsHeader({ projectId }: { projectId: string }) {
  const jobOverview = getJobOverview(projectId);
  const jobHeaderMeta = getJobHeaderMeta(projectId);
  const project = getProjectWorkspace(projectId);
  const breadcrumbSegments: BreadcrumbSegment[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: project?.title ?? projectId, href: `/projects/${projectId}` },
    { label: "Research Pipeline", href: `/projects/${projectId}/pipeline` },
  ];

  return (
    <header className="glass-panel flex flex-col gap-6 rounded-xl p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <Breadcrumbs segments={breadcrumbSegments} />
        <div className="mb-4 flex items-start gap-4">
          <SquareTerminal className="mt-2 h-7 w-7 shrink-0 text-primary" />
          <div className="min-w-0">
            <span className="mb-2 inline-flex rounded-md border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-xs font-semibold uppercase tracking-normal text-primary">
              Domain: {jobOverview.domain}
            </span>
            <h1 className="max-w-4xl font-display text-3xl font-semibold leading-[1.15] text-on-surface sm:text-4xl lg:text-5xl">
              {jobOverview.title}
            </h1>
            <p className="mt-3 text-base leading-[1.55] text-on-surface-variant sm:text-lg">
              {jobOverview.subtitle}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 font-mono text-sm text-on-surface-variant">
          {jobHeaderMeta.map((meta) => {
            const Icon = meta.icon;

            return (
              <span key={meta.label} className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {meta.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" className="h-12 px-5" type="button">
          Pause Run
        </Button>
        <Button className="h-12 px-5">
          <RotateCw className="h-4 w-4" />
          Restart
        </Button>
      </div>
    </header>
  );
}
