// Purpose: Render proposed experiments for validating generated research hypotheses.

import { Beaker, Check, FlaskConical, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { ProjectFooter } from "@/features/projects/components/project-footer";
import { ProjectSidebar } from "@/features/projects/components/project-sidebar";
import { getProjectOverview } from "@/features/projects/data/research-project-content";

const experiments = [
  {
    title: "Controlled validation study",
    objective: "Separate plausible mechanism from correlation using matched controls.",
    controls: ["Negative control", "Replicate cohort", "Assay calibration"],
  },
  {
    title: "Cross-source replication",
    objective: "Re-run the hypothesis against independent evidence clusters.",
    controls: ["Holdout sources", "Source quality filter", "Contradiction review"],
  },
  {
    title: "Sensitivity analysis",
    objective: "Test whether the novelty and confidence scores survive threshold changes.",
    controls: ["Confidence sweep", "Graph-density sweep", "Evidence-type stratification"],
  },
];

export function ExperimentsPage({ projectId }: { projectId: string }) {
  const project = getProjectOverview(projectId);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-on-surface md:flex">
      <ProjectSidebar activeSection="experiments" projectId={projectId} />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-6 px-5 py-6 sm:px-8 md:px-10 md:py-10">
          <Reveal>
            <header className="glass-panel rounded-xl p-5 sm:p-6">
              <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-xs font-semibold uppercase tracking-normal text-primary">
                Experiment Planner
              </span>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-on-surface">
                Suggested Experiments
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-[1.6] text-on-surface-variant">
                Validation plans for {project.title}. These are mock summaries meant to show how the workspace turns hypotheses into testable next steps.
              </p>
            </header>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {experiments.map((experiment, index) => (
              <Reveal key={experiment.title} delay={index * 0.05}>
                <article className="glass-panel flex h-full flex-col rounded-xl p-5 transition-colors hover:bg-white/[0.04]">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                    {index === 0 ? <FlaskConical className="h-5 w-5" /> : index === 1 ? <ShieldCheck className="h-5 w-5" /> : <Beaker className="h-5 w-5" />}
                  </div>
                  <h2 className="font-display text-xl font-semibold text-on-surface">{experiment.title}</h2>
                  <p className="mt-3 text-sm leading-[1.6] text-on-surface-variant">{experiment.objective}</p>
                  <div className="mt-5 space-y-2">
                    {experiment.controls.map((control) => (
                      <div key={control} className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <Check className="h-4 w-4 text-primary" />
                        {control}
                      </div>
                    ))}
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
