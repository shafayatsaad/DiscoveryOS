// Purpose: Compose the Stitch-aligned research pipeline execution screen.
// Breadcrumbs are rendered by ResearchJobsHeader.

import { Reveal } from "@/components/ui/reveal";
import { SuccessMark } from "@/components/ui/feedback-states";
import { getProjectWorkspace } from "@/features/projects/data/project-workspaces";
import { ResearchJobsFooter } from "@/features/workflows/components/research-jobs-footer";
import { ResearchJobsHeader } from "@/features/workflows/components/research-jobs-header";
import { ResearchJobsSidebar } from "@/features/workflows/components/research-jobs-sidebar";
import { ResearchTimeline } from "@/features/workflows/components/research-timeline";

export function ResearchJobsPage({ projectId }: { projectId: string }) {
  const project = getProjectWorkspace(projectId);

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface md:flex">
      <ResearchJobsSidebar projectId={projectId} />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto flex w-full max-w-container-max flex-col gap-6 px-5 py-8 sm:px-8 md:px-10">
            <Reveal>
              <ResearchJobsHeader projectId={projectId} />
            </Reveal>
            {project.cachedResultsAvailable ? (
              <Reveal delay={0.03}>
                <div className="glass-panel flex flex-col gap-3 rounded-xl p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-lg font-semibold text-on-surface">
                      Demo Mode workflow loaded
                    </p>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Cached planner, retrieval, graph, contradiction,
                      experiment, and report artifacts are ready for instant
                      review.
                    </p>
                  </div>
                  <SuccessMark label="Cached results ready" />
                </div>
              </Reveal>
            ) : null}
            <Reveal delay={0.06}>
              <ResearchTimeline projectId={projectId} />
            </Reveal>
          </div>
        </div>
        <ResearchJobsFooter />
      </main>
    </div>
  );
}
