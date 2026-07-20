// Purpose: Render the generated research report workspace as a professional paper viewer.

import { BarChart3, BookOpen, FileText, Network, Quote } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { AnimatedCard } from "@/components/ui/motion";
import { ProjectFooter } from "@/features/projects/components/project-footer";
import { ProjectSidebar } from "@/features/projects/components/project-sidebar";
import { getProjectOverview } from "@/features/projects/data/research-project-content";
import { ReportExportActions } from "@/features/reports/components/report-export-actions";
import { getResearchReport } from "@/features/reports/data/reports-content";
import { cn } from "@/lib/utils";

const chartToneClasses = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
  error: "bg-red-300",
};

export function ReportsPage({ projectId }: { projectId: string }) {
  const project = getProjectOverview(projectId);
  const report = getResearchReport(projectId);

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
                  <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.1] text-on-surface">
                    {report.title}
                  </h1>
                  <p className="mt-3 max-w-3xl text-base leading-[1.6] text-on-surface-variant">
                    {report.subtitle}
                  </p>
                </div>
                <ReportExportActions report={report} />
              </div>
            </header>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <Reveal delay={0.04}>
              <aside className="glass-panel sticky top-8 rounded-xl p-5">
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-on-surface">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Contents
                </h2>
                <nav className="mt-5 space-y-2" aria-label="Report table of contents">
                  {report.tableOfContents.map((item) => (
                    <a
                      key={item}
                      className="block rounded-md px-3 py-2 font-display text-sm font-semibold text-on-surface-variant transition-colors hover:bg-white/[0.04] hover:text-primary"
                      href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                    >
                      {item}
                    </a>
                  ))}
                </nav>
              </aside>
            </Reveal>

            <article className="paper-surface rounded-xl border border-white/10 bg-[#f6f1e8] px-5 py-6 text-[#171b22] shadow-ambient sm:px-8 lg:px-12 lg:py-10">
              <section id="executive-summary" className="border-b border-black/10 pb-8">
                <p className="font-mono text-xs font-semibold uppercase tracking-normal text-[#53606f]">
                  Executive Summary
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-[#11151b]">
                  Evidence-backed interpretation
                </h2>
                <p className="mt-4 max-w-4xl text-lg leading-8 text-[#333a45]">
                  {report.executiveSummary}
                </p>
              </section>

              <section id="evidence-cards" className="py-8">
                <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-[#11151b]">
                  <Quote className="h-5 w-5 text-[#315a93]" />
                  Evidence Cards
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {report.evidenceCards.map((card, index) => (
                    <AnimatedCard
                      key={card.claim}
                      className="rounded-lg border border-black/10 bg-white/70 p-4"
                      delay={index * 0.04}
                    >
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <p className="font-display text-lg font-semibold leading-snug text-[#11151b]">
                          {card.claim}
                        </p>
                        <span className="rounded-md bg-[#173b6c]/10 px-2 py-1 font-mono text-xs font-semibold text-[#173b6c]">
                          {card.confidence}%
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-[#3c4654]">{card.note}</p>
                      <p className="mt-4 border-t border-black/10 pt-3 font-mono text-xs leading-5 text-[#53606f]">
                        {card.citation}
                      </p>
                    </AnimatedCard>
                  ))}
                </div>
              </section>

              <section id="knowledge-graph-snapshot" className="grid gap-5 border-y border-black/10 py-8 lg:grid-cols-[1fr_1.2fr]">
                <div>
                  <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-[#11151b]">
                    <Network className="h-5 w-5 text-[#315a93]" />
                    Knowledge Graph Snapshot
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#3c4654]">
                    {report.graphSnapshot.centralClaim}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["Nodes", report.graphSnapshot.nodes],
                    ["Edges", report.graphSnapshot.edges],
                    ["High-confidence links", report.graphSnapshot.highConfidenceLinks],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-black/10 bg-white/60 p-4">
                      <p className="font-mono text-xs text-[#53606f]">{label}</p>
                      <p className="mt-2 font-display text-2xl font-semibold text-[#11151b]">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="charts" className="py-8">
                <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-[#11151b]">
                  <BarChart3 className="h-5 w-5 text-[#315a93]" />
                  Charts
                </h2>
                <div className="mt-5 space-y-4">
                  {report.charts.map((chart) => (
                    <div key={chart.label}>
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                        <span className="font-display font-semibold text-[#222832]">{chart.label}</span>
                        <span className="font-mono text-[#53606f]">{chart.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-black/10">
                        <div
                          className={cn("h-full rounded-full", chartToneClasses[chart.tone])}
                          style={{ width: `${chart.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {[
                ["Contradictions", report.contradictions],
                ["Research Gaps", report.researchGaps],
                ["Suggested Experiments", report.suggestedExperiments],
                ["References", report.references],
              ].map(([title, items]) => (
                <section
                  id={String(title).toLowerCase().replaceAll(" ", "-")}
                  key={String(title)}
                  className="border-t border-black/10 py-8"
                >
                  <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-[#11151b]">
                    <FileText className="h-5 w-5 text-[#315a93]" />
                    {String(title)}
                  </h2>
                  <div className="mt-5 space-y-3">
                    {(items as string[]).map((item) => (
                      <p
                        key={item}
                        className="rounded-lg border border-black/10 bg-white/60 p-4 text-sm leading-7 text-[#333a45]"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </div>
        <ProjectFooter />
      </main>
    </div>
  );
}
