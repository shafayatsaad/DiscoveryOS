// Purpose: Render active mocked research processes and their progress states.

import { Cpu } from "lucide-react";

import { activeProcesses } from "@/features/dashboard/data/dashboard-content";
import { cn } from "@/lib/utils";

const roleToneClasses = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  muted: "bg-surface-container-highest text-outline",
};

const barToneClasses = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  muted: "bg-outline-variant",
};

export function ProcessesPanel() {
  return (
    <section className="glass-panel rounded-lg p-5 lg:sticky lg:top-10" aria-labelledby="processes-heading">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2
          id="processes-heading"
          className="flex items-center gap-2 font-display text-2xl font-semibold leading-[1.2] text-on-surface"
        >
          <Cpu className="h-5 w-5 text-primary" />
          Active Processes
        </h2>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary/20 px-3 py-2 font-display text-xs font-semibold text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          3 Running
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {activeProcesses.map((process) => {
          const Icon = process.icon;
          const isQueued = process.progress === 0;

          return (
            <article key={process.name} className="rounded-md border border-white/[0.05] bg-surface/50 p-4">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div
                  className={cn(
                    "flex min-w-0 items-center gap-2 font-mono text-sm text-on-surface",
                    isQueued && "opacity-70",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 text-tertiary" />
                  <span className="min-w-0 break-words">{process.name}</span>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded px-2 py-0.5 font-display text-xs font-semibold uppercase tracking-normal",
                    roleToneClasses[process.roleTone],
                  )}
                >
                  {process.role}
                </span>
              </div>

              <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                {process.progress > 0 ? (
                  <div
                    className={cn("relative h-full rounded-full overflow-hidden", barToneClasses[process.roleTone])}
                    style={{ width: `${process.progress}%` }}
                  >
                    <span className="absolute inset-0 animate-shimmer bg-white/20" />
                  </div>
                ) : null}
              </div>

              <div
                className={cn(
                  "flex items-center justify-between gap-3 font-display text-xs font-semibold text-on-surface-variant",
                  isQueued && "text-outline-variant",
                )}
              >
                <span>{process.state}</span>
                <span>{process.eta}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
