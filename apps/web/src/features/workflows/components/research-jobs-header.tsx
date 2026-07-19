// Purpose: Render the current research job title, metadata, and job actions.

import { RotateCw, SquareTerminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { jobHeaderMeta, jobOverview } from "@/features/workflows/data/research-jobs-content";

export function ResearchJobsHeader() {
  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <div className="mb-4 flex items-start gap-4">
          <SquareTerminal className="mt-2 h-7 w-7 shrink-0 text-primary" />
          <h1 className="max-w-4xl font-display text-3xl font-semibold leading-[1.15] text-on-surface sm:text-4xl lg:text-5xl">
            {jobOverview.title}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-4 font-mono text-sm text-on-surface-variant">
          {jobHeaderMeta.map((meta) => {
            const Icon = meta.icon;

            return (
              <span key={meta.label} className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {meta.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          className="rounded-lg border border-white/10 px-5 py-3 font-display text-xs font-semibold uppercase tracking-normal text-on-surface transition-colors hover:bg-white/[0.05]"
          type="button"
        >
          Cancel Job
        </button>
        <Button className="h-12 px-5">
          <RotateCw className="h-4 w-4" />
          Rerun
        </Button>
      </div>
    </header>
  );
}
