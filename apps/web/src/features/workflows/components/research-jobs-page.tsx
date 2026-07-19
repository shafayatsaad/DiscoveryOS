// Purpose: Compose the Stitch-aligned research job execution timeline screen.

import { Reveal } from "@/components/ui/reveal";
import { ResearchJobsFooter } from "@/features/workflows/components/research-jobs-footer";
import { ResearchJobsHeader } from "@/features/workflows/components/research-jobs-header";
import { ResearchJobsSidebar } from "@/features/workflows/components/research-jobs-sidebar";
import { ResearchTimeline } from "@/features/workflows/components/research-timeline";

export function ResearchJobsPage() {
  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface md:flex">
      <ResearchJobsSidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto flex w-full max-w-container-max flex-col gap-8 px-5 py-8 sm:px-8 md:px-10">
            <Reveal>
              <ResearchJobsHeader />
            </Reveal>
            <Reveal delay={0.06}>
              <ResearchTimeline />
            </Reveal>
          </div>
        </div>
        <ResearchJobsFooter />
      </main>
    </div>
  );
}
