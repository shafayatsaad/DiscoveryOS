// Purpose: Render ML-derived research signals without implementing backend model logic.

import { Activity, BarChart3, BrainCircuit, GitBranch } from "lucide-react";

import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import type { BreadcrumbSegment } from "@/components/navigation/breadcrumbs";
import { Reveal } from "@/components/ui/reveal";
import { ProjectFooter } from "@/features/projects/components/project-footer";
import { ProjectSidebar } from "@/features/projects/components/project-sidebar";
import { getProjectOverview } from "@/features/projects/data/research-project-content";
import { getProjectWorkspace } from "@/features/projects/data/project-workspaces";

const mlCards = [
  {
    label: "Evidence Ranker",
    value: "0.89",
    detail: "Weighted relevance and confidence score",
    icon: BarChart3,
  },
  {
    label: "Graph Centrality",
    value: "High",
    detail: "Active hypothesis cluster is highly connected",
    icon: GitBranch,
  },
  {
    label: "Novelty Signal",
    value: "82%",
    detail: "Semantically distant from retrieved prior work",
    icon: BrainCircuit,
  },
  {
    label: "Contradiction Load",
    value: "12",
    detail: "Conflicting claim clusters retained for review",
    icon: Activity,
  },
];

export function MlInsightsPage({ projectId }: { projectId: string }) {
  const project = getProjectOverview(projectId);
  const projectWorkspace = getProjectWorkspace(projectId);
  const breadcrumbSegments: BreadcrumbSegment[] = [
    { label: "Dashboard", href: "/dashboard" },
    {
      label: projectWorkspace?.title ?? projectId,
      href: `/projects/${projectId}`,
    },
    { label: "ML Insights", href: `/projects/${projectId}/ml` },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f14] text-on-surface md:flex">
      <ProjectSidebar activeSection="ml" projectId={projectId} />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-6 px-5 py-6 sm:px-8 md:px-10 md:py-10">
          <Reveal>
            <header className="glass-panel rounded-xl p-5 sm:p-6">
              <Breadcrumbs segments={breadcrumbSegments} />
              <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-xs font-semibold uppercase tracking-normal text-primary">
                {project.domain} Signals
              </span>
              <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.1] text-on-surface">
                ML Insights
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-[1.6] text-on-surface-variant">
                Interpretable model signals for {project.title}. These
                outputs are displayed as signals, not scientific conclusions.
              </p>
            </header>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {mlCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <Reveal key={card.label} delay={index * 0.04}>
                  <article className="glass-panel rounded-xl p-5 transition-colors hover:bg-white/[0.04]">
                    <Icon className="mb-5 h-6 w-6 text-primary" />
                    <p className="font-display text-xs font-semibold uppercase tracking-normal text-on-surface-variant">
                      {card.label}
                    </p>
                    <p className="mt-2 font-display text-4xl font-semibold text-on-surface">
                      {card.value}
                    </p>
                    <p className="mt-3 text-sm leading-[1.55] text-on-surface-variant">
                      {card.detail}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.12}>
            <section className="glass-panel rounded-xl p-5">
              <h2 className="mb-4 font-display text-2xl font-semibold text-on-surface">
                Feature Summary
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {[
                  "Evidence strength",
                  "Semantic distance",
                  "Graph support",
                ].map((feature, index) => (
                  <div
                    key={feature}
                    className="rounded-lg border border-white/[0.05] bg-surface/50 p-4"
                  >
                    <div className="mb-3 flex justify-between font-display text-xs font-semibold text-on-surface-variant">
                      <span>{feature}</span>
                      <span className="text-primary">{86 - index * 7}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-highest">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${86 - index * 7}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        </div>
        <ProjectFooter />
      </main>
    </div>
  );
}
