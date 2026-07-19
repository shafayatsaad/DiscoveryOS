// Purpose: Render the project's multi-agent pipeline execution progress.

import { pipelineStages } from "@/features/projects/data/research-project-content";
import { cn } from "@/lib/utils";

export function ResearchPipeline() {
  const completedPercent = 50;

  return (
    <section className="glass-panel hud-glow rounded-xl p-5 sm:p-6" aria-labelledby="pipeline-heading">
      <h2 id="pipeline-heading" className="mb-8 font-display text-2xl font-semibold text-on-surface">
        Pipeline Execution
      </h2>

      <div className="relative overflow-x-auto pb-2">
        <div className="absolute left-0 right-0 top-5 h-0.5 min-w-[840px] bg-surface-container-high">
          <div className="h-full bg-primary" style={{ width: `${completedPercent}%` }} />
        </div>
        <div className="relative z-10 grid min-w-[840px] grid-cols-10 gap-3">
          {pipelineStages.map((stage) => {
            const Icon = stage.icon;

            return (
              <div key={stage.label} className="flex min-w-20 flex-col items-center gap-2 text-center">
                <div
                  className={cn(
                    "flex rounded-full border-2 items-center justify-center",
                    stage.state === "complete" &&
                      "h-10 w-10 border-primary bg-primary/20 text-primary",
                    stage.state === "active" &&
                      "pulse-active h-12 w-12 border-primary bg-primary text-on-primary shadow-[0_0_15px_rgba(77,142,255,0.5)]",
                    stage.state === "pending" &&
                      "h-10 w-10 border-white/10 bg-surface-container-high text-on-surface-variant",
                  )}
                >
                  <Icon className={stage.state === "active" ? "h-5 w-5" : "h-4 w-4"} />
                </div>
                <span
                  className={cn(
                    "font-display text-xs font-semibold tracking-normal",
                    stage.state === "active"
                      ? "text-primary"
                      : stage.state === "pending"
                        ? "text-on-surface-variant/50"
                        : "text-on-surface-variant",
                  )}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
