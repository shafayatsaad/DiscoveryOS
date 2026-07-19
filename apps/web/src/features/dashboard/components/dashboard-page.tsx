// Purpose: Compose the Stitch-aligned DiscoveryOS dashboard from reusable sections.

import { CommandCenter } from "@/features/dashboard/components/command-center";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { InsightsStream } from "@/features/dashboard/components/insights-stream";
import { ProcessesPanel } from "@/features/dashboard/components/processes-panel";
import { ProjectsPanel } from "@/features/dashboard/components/projects-panel";

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-on-surface md:flex">
      <DashboardSidebar />
      <main className="min-w-0 flex-1">
        <div className="mx-auto flex w-full max-w-container-max flex-col gap-8 px-5 py-6 sm:px-8 md:px-10 md:py-10">
          <CommandCenter />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-8">
              <ProjectsPanel />
              <InsightsStream />
            </div>
            <div className="lg:col-span-4">
              <ProcessesPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
