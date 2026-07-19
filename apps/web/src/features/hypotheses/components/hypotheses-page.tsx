// Purpose: Render generated hypotheses with evidence, critique, and novelty metadata.

import { AlertTriangle, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ProjectFooter } from "@/features/projects/components/project-footer";
import { ProjectSidebar } from "@/features/projects/components/project-sidebar";
import { getProjectOverview } from "@/features/projects/data/research-project-content";

const hypotheses = [
  {
    statement: "A combined mechanism may explain the strongest evidence cluster.",
    support: "8 supporting claims",
    critique: "Needs stronger causal validation",
    novelty: "82%",
  },
  {
    statement: "Contradictions are concentrated around measurement context rather than the core association.",
    support: "5 supporting claims",
    critique: "Method heterogeneity remains high",
    novelty: "74%",
  },
  {
    statement: "A targeted experiment can separate correlation from plausible mechanism.",
    support: "3 supporting claims",
    critique: "Requires controlled validation",
    novelty: "88%",
  },
];

export function HypothesesPage({ projectId }: { projectId: string }) {
  const project = getProjectOverview(projectId);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-on-surface md:flex">
      <ProjectSidebar activeSection="hypotheses" projectId={projectId} />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-6 px-5 py-6 sm:px-8 md:px-10 md:py-10">
          <Reveal>
            <header className="glass-panel rounded-xl p-5 sm:p-6">
              <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-xs font-semibold uppercase tracking-normal text-primary">
                Hypothesis Generator
              </span>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-on-surface">
                Hypotheses
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-[1.6] text-on-surface-variant">
                Candidate hypotheses for {project.title}, each paired with support, critique, and novelty signals.
              </p>
            </header>
          </Reveal>

          <div className="space-y-5">
            {hypotheses.map((hypothesis, index) => (
              <Reveal key={hypothesis.statement} delay={index * 0.05}>
                <article className="glass-panel rounded-xl p-5 sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <h2 className="flex items-start gap-3 font-display text-2xl font-semibold text-on-surface">
                        <Lightbulb className="mt-1 h-5 w-5 shrink-0 text-primary" />
                        {hypothesis.statement}
                      </h2>
                      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                        <Signal icon={CheckCircle2} label="Support" value={hypothesis.support} />
                        <Signal icon={AlertTriangle} label="Critique" value={hypothesis.critique} />
                        <Signal icon={Sparkles} label="Novelty" value={hypothesis.novelty} />
                      </div>
                    </div>
                    <Button variant="secondary">Review</Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
        <ProjectFooter />
      </main>
    </div>
  );
}

function Signal({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-surface/50 p-3">
      <p className="mb-2 flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-normal text-primary">
        <Icon className="h-4 w-4" />
        {label}
      </p>
      <p className="text-sm leading-[1.45] text-on-surface-variant">{value}</p>
    </div>
  );
}
