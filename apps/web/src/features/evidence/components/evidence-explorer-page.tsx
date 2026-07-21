// Purpose: Compose the Stitch-aligned Evidence Explorer workspace with breadcrumbs.

import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import type { BreadcrumbSegment } from "@/components/navigation/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { EvidenceSidebar } from "@/features/evidence/components/evidence-sidebar";
import { EvidenceTable } from "@/features/evidence/components/evidence-table";
import { EvidenceToolbar } from "@/features/evidence/components/evidence-toolbar";
import { evidenceActions } from "@/features/evidence/data/evidence-content";
import { getProjectWorkspace } from "@/features/projects/data/project-workspaces";

export function EvidenceExplorerPage({ projectId }: { projectId: string }) {
  const ExportIcon = evidenceActions.export;
  const project = getProjectWorkspace(projectId);
  const breadcrumbSegments: BreadcrumbSegment[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: project?.title ?? projectId, href: `/projects/${projectId}` },
    { label: "Evidence", href: `/projects/${projectId}/evidence` },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f14] text-on-surface md:flex">
      <EvidenceSidebar projectId={projectId} />
      <main className="mx-auto flex w-full min-w-0 max-w-container-max flex-1 flex-col">
        <Reveal>
          <header className="mx-5 mt-6 flex flex-col gap-5 rounded-xl border border-white/[0.06] bg-surface/45 px-5 py-6 shadow-ambient sm:mx-8 sm:px-6 md:mx-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Breadcrumbs segments={breadcrumbSegments} />
              <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.1] text-on-surface sm:text-5xl">
                Evidence Explorer
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-[1.5] text-on-surface-variant">
                Query, verify, and trace scientific claims across verified
                literature.
              </p>
            </div>
            <Button variant="secondary" type="button" className="w-fit">
              <ExportIcon className="h-4 w-4" />
              Export
            </Button>
          </header>
        </Reveal>

        <Reveal delay={0.05}>
          <EvidenceToolbar projectId={projectId} />
        </Reveal>

        <Reveal delay={0.1} className="flex-1">
          <EvidenceTable projectId={projectId} />
        </Reveal>
      </main>
    </div>
  );
}
