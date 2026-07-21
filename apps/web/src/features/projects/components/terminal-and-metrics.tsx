// Purpose: Render live terminal-style project logs next to key research metrics.

import { SquareTerminal } from "lucide-react";

import {
  getTerminalLogs,
  projectMetrics,
} from "@/features/projects/data/research-project-content";
import { cn } from "@/lib/utils";

const logToneClasses = {
  INFO: "text-on-surface-variant/80",
  SUCCESS: "text-primary",
  WARN: "text-[#f4cf75]",
};

export function TerminalAndMetrics({ projectId }: { projectId: string }) {
  const terminalLogs = getTerminalLogs(projectId);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section className="glass-panel flex min-h-[380px] flex-col rounded-xl lg:col-span-2" aria-labelledby="terminal-heading">
        <div className="flex items-center justify-between rounded-t-xl border-b border-white/[0.05] bg-surface-container-lowest/50 px-5 py-3">
          <h2
            id="terminal-heading"
            className="flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-normal text-on-surface"
          >
            <SquareTerminal className="h-4 w-4 text-primary" />
            Terminal Output
          </h2>
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          </div>
        </div>
        <div className="terminal-scroll flex-1 overflow-y-auto rounded-b-xl bg-[#05080a] p-5 font-mono text-sm leading-[1.55]">
          {terminalLogs.map((log) => (
            <p key={`${log.time}-${log.message}`} className={cn("mb-2", logToneClasses[log.level])}>
              [{log.time}] {log.level}: {log.message}
            </p>
          ))}
          <div className="mt-4 flex animate-pulse items-center gap-2 text-primary">
            <span>_</span>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4">
        {projectMetrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article key={metric.label} className="premium-card flex items-center gap-4 rounded-xl p-5">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border",
                  metric.emphasized
                    ? "border-primary/30 bg-primary/20 text-primary"
                    : "border-white/[0.05] bg-surface-container-high text-primary",
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-normal text-on-surface-variant">
                  {metric.label}
                </p>
                <p className="font-display text-3xl font-bold leading-tight text-on-surface">
                  {metric.value}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
