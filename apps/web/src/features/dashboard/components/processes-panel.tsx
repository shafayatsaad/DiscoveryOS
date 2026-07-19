"use client";

// Purpose: Render active pipeline processes with real-time progress from the backend.

import { Cpu } from "lucide-react";

import { usePipelineStream } from "@/features/dashboard/hooks/use-pipeline-stream";
import { primaryProjectId } from "@/features/projects/data/project-workspaces";
import { cn } from "@/lib/utils";

const STAGE_ICONS: Record<string, string> = {
  planner: "bg-primary/10 text-primary",
  retriever: "bg-secondary/10 text-secondary",
  extractor: "bg-tertiary/10 text-tertiary",
  knowledge_graph: "bg-primary/10 text-primary",
  contradiction: "bg-secondary/10 text-secondary",
  novelty: "bg-tertiary/10 text-tertiary",
  experiment: "bg-primary/10 text-primary",
  report: "bg-secondary/10 text-secondary",
};

const STAGE_LABELS: Record<string, string> = {
  planner: "Planning",
  retriever: "Retriever",
  extractor: "Extractor",
  knowledge_graph: "Graph Builder",
  contradiction: "Contradiction",
  novelty: "Novelty",
  experiment: "Experiment",
  report: "Report",
};

export function ProcessesPanel() {
  const {
    events,
    status: streamStatus,
    progress,
    metadata,
    isConnected,
    isComplete,
    isFailed,
  } = usePipelineStream({
    projectId: primaryProjectId,
  });

  const isRunning =
    streamStatus === "connecting" || streamStatus === "connected";
  const hasData = events.length > 0;

  // Count running stages from events
  const runningCount = events.filter(
    (e) => e.event_type === "stage.started",
  ).length;

  return (
    <section
      className="glass-panel rounded-lg p-5 lg:sticky lg:top-10"
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
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 font-display text-xs font-semibold",
            isComplete
              ? "bg-green-500/20 text-green-400"
              : isFailed
                ? "bg-red-500/20 text-red-400"
                : isRunning
                  ? "bg-primary/20 text-primary"
                  : "bg-surface-container-highest text-outline",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isRunning ? "bg-primary animate-pulse" : "bg-current",
            )}
          />
          {isComplete
            ? "Complete"
            : isFailed
              ? "Failed"
              : isRunning
                ? `${runningCount} Running`
                : "Idle"}
        </span>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Cpu className="mb-3 h-8 w-8 text-outline-variant" />
          <p className="font-display text-sm font-medium text-on-surface-variant">
            No active processes
          </p>
          <p className="mt-1 text-xs text-outline-variant">
            Submit a research question to start the pipeline.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Overall progress bar */}
          <div className="mb-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-display text-xs font-semibold text-on-surface-variant">
                Overall Progress
              </span>
              <span className="font-mono text-xs text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stage processes */}
          {metadata?.stages &&
            Object.entries(metadata.stages).map(([stageId, stageInfo]) => {
              const isStageComplete = stageInfo.status === "completed";
              const isStageRunning = stageInfo.status === "running";
              const isStageFailed = stageInfo.status === "failed";
              const isStagePending = stageInfo.status === "pending";

              return (
                <article
                  key={stageId}
                  className={cn(
                    "rounded-md border border-white/[0.05] bg-surface/50 p-4 transition-all duration-300",
                    isStageRunning && "border-primary/20",
                    isStageFailed && "border-red-400/20",
                    isStagePending && "opacity-55",
                  )}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div
                      className={cn(
                        "flex min-w-0 items-center gap-2 font-mono text-sm text-on-surface",
                        isStagePending && "opacity-70",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold",
                          STAGE_ICONS[stageId] ||
                            "bg-surface-container-highest text-outline",
                        )}
                      >
                        {STAGE_LABELS[stageId]?.charAt(0) || "?"}
                      </span>
                      <span className="min-w-0 break-words">
                        {stageInfo.label}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded px-2 py-0.5 font-display text-xs font-semibold uppercase tracking-normal",
                        isStageComplete
                          ? "bg-green-500/10 text-green-400"
                          : isStageRunning
                            ? "bg-primary/10 text-primary"
                            : isStageFailed
                              ? "bg-red-500/10 text-red-400"
                              : "bg-surface-container-highest text-outline",
                      )}
                    >
                      {isStageComplete
                        ? "Done"
                        : isStageRunning
                          ? "Active"
                          : isStageFailed
                            ? "Failed"
                            : "Pending"}
                    </span>
                  </div>

                  {/* Stage progress bar */}
                  <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
                    {isStageComplete ? (
                      <div className="h-full w-full rounded-full bg-green-500/60" />
                    ) : isStageRunning ? (
                      <div className="relative h-full w-full overflow-hidden rounded-full">
                        <div className="absolute inset-0 animate-shimmer bg-primary/40" />
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between gap-3 font-display text-xs font-semibold text-on-surface-variant">
                    <span>
                      {isStageComplete
                        ? "Completed"
                        : isStageRunning
                          ? "Running..."
                          : isStageFailed
                            ? "Failed"
                            : "Waiting"}
                    </span>
                    <span>
                      {isStageComplete
                        ? "✓"
                        : isStageRunning
                          ? "⟳"
                          : isStageFailed
                            ? "✗"
                            : "—"}
                    </span>
                  </div>
                </article>
              );
            })}
        </div>
      )}

      {/* Connection status */}
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3">
        <span className="font-display text-[10px] font-semibold uppercase tracking-normal text-outline-variant">
          {isConnected
            ? "Live"
            : streamStatus === "connecting"
              ? "Reconnecting..."
              : "Disconnected"}
        </span>
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            isConnected
              ? "bg-green-500"
              : streamStatus === "connecting"
                ? "bg-yellow-500 animate-pulse"
                : "bg-outline-variant",
          )}
        />
      </div>
    </section>
  );
}
