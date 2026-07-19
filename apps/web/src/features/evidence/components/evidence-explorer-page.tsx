// Purpose: Compose the Stitch-aligned Evidence Explorer workspace.

import { Reveal } from "@/components/ui/reveal";
import { EvidenceSidebar } from "@/features/evidence/components/evidence-sidebar";
import { EvidenceTable } from "@/features/evidence/components/evidence-table";
import { EvidenceToolbar } from "@/features/evidence/components/evidence-toolbar";
import { evidenceActions } from "@/features/evidence/data/evidence-content";

export function EvidenceExplorerPage({ projectId }: { projectId: string }) {
  const ExportIcon = evidenceActions.export;

  return (
    <div className="min-h-screen bg-[#0b0f14] text-on-surface md:flex">
      <EvidenceSidebar projectId={projectId} />
      <main className="mx-auto flex w-full min-w-0 max-w-container-max flex-1 flex-col">
        <Reveal>
          <header className="flex flex-col gap-5 border-b border-white/[0.05] px-5 py-8 sm:px-8 md:px-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-4xl font-semibold leading-[1.1] text-on-surface sm:text-5xl">
                Evidence Explorer
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-[1.5] text-on-surface-variant">
                Query, verify, and trace scientific claims across verified literature.
              </p>
            </div>
            <button
              className="glass-panel inline-flex h-11 w-fit items-center gap-2 rounded-lg px-4 font-display text-xs font-semibold uppercase tracking-normal text-on-surface transition-colors hover:bg-white/[0.05]"
              type="button"
            >
              <ExportIcon className="h-4 w-4" />
              Export
            </button>
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
