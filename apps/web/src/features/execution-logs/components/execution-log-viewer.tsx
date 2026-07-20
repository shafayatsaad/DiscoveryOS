"use client";

// Purpose: Render a filterable developer-mode execution log inspector with breadcrumbs.

import {
  AlertTriangle,
  Clock3,
  Filter,
  Search,
  Server,
  TerminalSquare,
} from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/feedback-states";
import { AnimatedCard, MotionItem, MotionList } from "@/components/ui/motion";
import {
  executionLogs,
  type ExecutionLogStatus,
} from "@/features/execution-logs/data/execution-log-content";
import { cn } from "@/lib/utils";

const statusClasses: Record<ExecutionLogStatus, string> = {
  success: "bg-emerald-500/10 text-emerald-300",
  running: "bg-primary/10 text-primary",
  failed: "bg-red-500/10 text-red-300",
  retrying: "bg-amber-500/10 text-amber-300",
};

const filters: Array<ExecutionLogStatus | "all"> = [
  "all",
  "success",
  "running",
  "retrying",
  "failed",
];

export function ExecutionLogViewer() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ExecutionLogStatus | "all">("all");

  const filteredLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return executionLogs.filter((log) => {
      const matchesStatus = status === "all" || log.status === status;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [log.id, log.agent, log.prompt, ...log.errors].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );

      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  return (
    <main className="min-h-screen bg-[#0b0f14] px-5 py-6 text-on-surface sm:px-8 md:px-10 md:py-10">
      <div className="mx-auto flex w-full max-w-container-max flex-col gap-6">
        <header className="glass-panel rounded-xl p-5 sm:p-6">
          <Breadcrumbs
            segments={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Execution Logs", href: "/dev/execution-logs" },
            ]}
          />
          <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-xs font-semibold uppercase tracking-normal text-primary">
            Developer Mode
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight">
            Execution Log Viewer
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-[1.6] text-on-surface-variant">
            Inspect prompts, token usage, timings, retries, errors, MCP calls,
            status, and timeline events.
          </p>
        </header>

        <section className="glass-panel rounded-xl p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <label className="flex min-h-11 items-center gap-3 rounded-lg border border-white/10 bg-surface/60 px-3">
              <Search className="h-4 w-4 text-on-surface-variant" />
              <span className="sr-only">Search execution logs</span>
              <input
                className="min-w-0 flex-1 border-none bg-transparent text-sm outline-none placeholder:text-on-surface-variant/50"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search prompt, agent, error, or run id..."
                type="search"
                value={query}
              />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-on-surface-variant" />
              {filters.map((item) => (
                <button
                  className={cn(
                    "rounded-md px-3 py-2 font-display text-xs font-semibold uppercase tracking-normal transition-colors",
                    status === item
                      ? "bg-primary text-on-primary"
                      : "bg-white/[0.04] text-on-surface-variant hover:bg-white/[0.07] hover:text-on-surface",
                  )}
                  key={item}
                  onClick={() => setStatus(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {filteredLogs.length === 0 ? (
          <AnimatedCard
            className="glass-panel rounded-xl p-6"
            interactive={false}
          >
            <EmptyState
              body="Adjust status filters or search text to inspect a different run."
              icon={TerminalSquare}
              title="No execution logs found"
            />
          </AnimatedCard>
        ) : (
          <MotionList className="grid gap-4">
            {filteredLogs.map((log, index) => (
              <MotionItem
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                key={log.id}
                transition={{
                  delay: index * 0.04,
                  duration: 0.26,
                  ease: "easeOut",
                }}
              >
                <article className="glass-panel rounded-xl p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-display text-2xl font-semibold text-on-surface">
                          {log.agent}
                        </h2>
                        <span className="font-mono text-xs text-on-surface-variant">
                          {log.id}
                        </span>
                        <span
                          className={cn(
                            "rounded-md px-2 py-1 font-display text-xs font-semibold",
                            statusClasses[log.status],
                          )}
                        >
                          {log.status}
                        </span>
                      </div>
                      <p className="mt-3 max-w-4xl text-sm leading-6 text-on-surface-variant">
                        {log.prompt}
                      </p>
                    </div>
                    <div className="grid shrink-0 grid-cols-3 gap-3 text-center">
                      <Metric
                        label="Tokens"
                        value={`${log.tokenUsage.input + log.tokenUsage.output}`}
                      />
                      <Metric
                        label="Time"
                        value={`${(log.executionTimeMs / 1000).toFixed(1)}s`}
                      />
                      <Metric label="Retries" value={String(log.retries)} />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-3">
                    <Panel icon={Server} title="MCP Calls">
                      {log.mcpCalls.map((call) => (
                        <Row
                          key={`${call.server}-${call.tool}`}
                          left={`${call.server}.${call.tool}`}
                          right={`${call.durationMs}ms`}
                          status={call.status}
                        />
                      ))}
                    </Panel>
                    <Panel icon={Clock3} title="Timeline">
                      {log.timeline.map((item) => (
                        <Row
                          key={`${item.time}-${item.label}`}
                          left={`${item.time} ${item.label}`}
                          status={item.status}
                        />
                      ))}
                    </Panel>
                    <Panel icon={AlertTriangle} title="Errors">
                      {log.errors.length > 0 ? (
                        log.errors.map((error) => (
                          <Row key={error} left={error} status="failed" />
                        ))
                      ) : (
                        <p className="text-sm text-on-surface-variant">
                          No errors recorded.
                        </p>
                      )}
                    </Panel>
                  </div>
                </article>
              </MotionItem>
            ))}
          </MotionList>
        )}
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-surface/50 p-3">
      <p className="font-mono text-[10px] uppercase tracking-normal text-on-surface-variant">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-semibold text-on-surface">
        {value}
      </p>
    </div>
  );
}

function Panel({
  children,
  icon: Icon,
  title,
}: {
  children: ReactNode;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-white/[0.06] bg-surface/40 p-4">
      <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-on-surface">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Row({
  left,
  right,
  status,
}: {
  left: string;
  right?: string;
  status: ExecutionLogStatus;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md bg-white/[0.03] px-3 py-2">
      <span className="min-w-0 text-sm leading-5 text-on-surface-variant">
        {left}
      </span>
      <span
        className={cn(
          "shrink-0 rounded px-2 py-0.5 font-mono text-[10px]",
          statusClasses[status],
        )}
      >
        {right ?? status}
      </span>
    </div>
  );
}
