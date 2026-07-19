// Purpose: Compose the project workspace using Stitch project-screen sections.

import { ProjectFooter } from "@/features/projects/components/project-footer";
import { ProjectHeader } from "@/features/projects/components/project-header";
import { ProjectSidebar } from "@/features/projects/components/project-sidebar";
import { ProjectTopBar } from "@/features/projects/components/project-top-bar";
import { ResearchPipeline } from "@/features/projects/components/research-pipeline";
import { ResearchSynopsis } from "@/features/projects/components/research-synopsis";
import { TerminalAndMetrics } from "@/features/projects/components/terminal-and-metrics";

export function ResearchProjectPage() {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-on-surface md:flex">
      <ProjectSidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <ProjectTopBar />
        <div className="mx-auto grid w-full max-w-container-max flex-1 grid-cols-1 gap-6 px-5 py-6 sm:px-8 md:px-10 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-w-0 flex-col gap-6">
            <ProjectHeader />
            <ResearchPipeline />
            <TerminalAndMetrics />
          </div>
          <ResearchSynopsis />
        </div>
        <ProjectFooter />
      </main>
    </div>
  );
}
