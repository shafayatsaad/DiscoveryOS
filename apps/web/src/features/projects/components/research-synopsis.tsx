// Purpose: Render the right-side project synopsis and research health indicators.

import {
  projectOverview,
  researchHealth,
  synopsisScores,
} from "@/features/projects/data/research-project-content";
import { cn } from "@/lib/utils";

const scoreToneClasses = {
  success: "bg-[#8cd69b] text-[#8cd69b]",
  primary: "bg-primary text-primary",
};

export function ResearchSynopsis() {
  const HealthIcon = researchHealth.icon;

  return (
    <aside className="glass-panel rounded-xl p-5 sm:p-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]" aria-labelledby="synopsis-heading">
      <h2 id="synopsis-heading" className="mb-5 font-display text-2xl font-semibold text-on-surface">
        Research Synopsis
      </h2>
      <p className="mb-8 text-sm leading-[1.65] text-on-surface-variant">
        {projectOverview.synopsis}
      </p>

      <div className="space-y-5">
        {synopsisScores.map((score) => (
          <div key={score.label}>
            <div className="mb-2 flex justify-between gap-3 font-display text-xs font-semibold">
              <span className="text-on-surface-variant">{score.label}</span>
              <span className={score.tone === "success" ? "text-[#8cd69b]" : "text-primary"}>
                {score.value}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div
                className={cn("h-full rounded-full", scoreToneClasses[score.tone].split(" ")[0])}
                style={{ width: `${score.progress}%` }}
              />
            </div>
          </div>
        ))}

        <div className="border-t border-white/10 pt-5">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-normal text-on-surface-variant">
              <HealthIcon className="h-4 w-4" />
              {researchHealth.label}
            </span>
            <span className="rounded-md border border-[#8cd69b]/20 bg-[#8cd69b]/10 px-2 py-1 font-display text-xs font-semibold uppercase tracking-normal text-[#8cd69b]">
              {researchHealth.value}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
