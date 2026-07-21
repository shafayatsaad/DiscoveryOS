// Purpose: Render lightweight pipeline process summaries without opening a stream on navigation.

import { Check, Clock3, Cpu } from "lucide-react";

import { activeProcesses } from "@/features/dashboard/data/dashboard-content";
import { cn } from "@/lib/utils";

const roleToneClasses = {
  primary: "border-primary/20 bg-primary/10 text-primary",
  secondary: "border-secondary/20 bg-secondary/10 text-secondary",
  muted: "border-white/[0.06] bg-surface-container-high text-outline",
};

export function ProcessesPanel() {
  const runningCount = activeProcesses.filter((process) => process.progress > 0).length;

  return (
    <section
      className="premium-card rounded-xl p-5 lg:sticky lg:top-10"
      aria-labelledby="processes-heading"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2
          id="processes-heading"
          className="flex items-center gap-2 font-display text-2xl font-semibold leading-[1.2] text-on-surface"
        >
          <Cpu className="h-5 w-5 text-primary" />
          Active Processes
        </h2>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary/10 px-3 py-2 font-display text-xs font-semibold text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {runningCount} Active
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {activeProcesses.map((process) => {
          const Icon = process.icon;
          const isQueued = process.progress === 0;

          return (
            <article key={process.name} className="surface-panel rounded-lg p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                      roleToneClasses[process.roleTone],
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-sm font-semibold text-on-surface">
                      {process.name}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-on-surface-variant">
                      {process.role}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded px-2 py-0.5 font-display text-xs font-semibold uppercase tracking-normal",
                    isQueued ? "bg-surface-container-highest text-outline" : "bg-primary/10 text-primary",
                  )}
                >
                  {process.eta}
                </span>
              </div>

              <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-500",
                    isQueued ? "bg-outline-variant" : "bg-gradient-to-r from-primary to-tertiary",
                  )}
                  style={{ width: `${Math.max(process.progress, 6)}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-3 font-display text-xs font-semibold text-on-surface-variant">
                <span>{process.state}</span>
                {isQueued ? (
                  <Clock3 className="h-3.5 w-3.5 text-outline" aria-label="Queued" />
                ) : (
                  <Check className="h-3.5 w-3.5 text-primary" aria-label="Active" />
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3">
        <span className="font-display text-[10px] font-semibold uppercase tracking-normal text-outline-variant">
          Offline demo cache
        </span>
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
      </div>
    </section>
  );
}
