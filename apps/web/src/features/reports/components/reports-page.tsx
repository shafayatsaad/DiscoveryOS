// Purpose: Render the generated research report workspace from mock DiscoveryOS artifacts.

import { Download, FileText, Printer, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ProjectFooter } from "@/features/projects/components/project-footer";
import { ProjectSidebar } from "@/features/projects/components/project-sidebar";
import { getProjectOverview } from "@/features/projects/data/research-project-content";
import { getReportSections, reportReferences } from "@/features/reports/data/reports-content";

const reportActions = [
  { label: "Export", icon: Download },
  { label: "Print", icon: Printer },
  { label: "Share", icon: Share2 },
];

export function ReportsPage({ projectId }: { projectId: string }) {
  const project = getProjectOverview(projectId);
  const sections = getReportSections(projectId);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-on-surface md:flex">
      <ProjectSidebar activeSection="reports" projectId={projectId} />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-6 px-5 py-6 sm:px-8 md:px-10 md:py-10">
          <Reveal>
            <header className="glass-panel rounded-xl p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-xs font-semibold uppercase tracking-normal text-primary">
                    {project.domain} Report
                  </span>
                  <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-on-surface">
                    Evidence-backed Research Report
                  </h1>
                  <p className="mt-3 max-w-3xl text-base leading-[1.6] text-on-surface-variant">
                    Generated from the project workspace for {project.title}. The report keeps claims, contradictions, graph context, novelty, and experiments inspectable.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {reportActions.map((action) => {
                    const Icon = action.icon;

                    return (
                    <Button key={action.label} variant="secondary">
                      <Icon className="h-4 w-4" />
                      {action.label}
                    </Button>
                    );
                  })}
                </div>
              </div>
            </header>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              {sections.map((section, index) => (
                <Reveal key={section.title} delay={index * 0.04}>
                  <article className="glass-panel rounded-xl p-5 sm:p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <h2 className="font-display text-2xl font-semibold text-on-surface">{section.title}</h2>
                      {section.metric ? (
                        <span className="rounded-md bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary">
                          {section.metric}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-base leading-[1.7] text-on-surface-variant">{section.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.08}>
              <aside className="glass-panel sticky top-8 rounded-xl p-5">
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-on-surface">
                  <FileText className="h-5 w-5 text-primary" />
                  Audit Trail
                </h2>
                <div className="mt-5 space-y-3">
                  {reportReferences.map((reference) => (
                    <div key={reference} className="rounded-lg border border-white/[0.05] bg-surface/50 p-3 text-sm text-on-surface-variant">
                      {reference}
                    </div>
                  ))}
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
        <ProjectFooter />
      </main>
    </div>
  );
}
