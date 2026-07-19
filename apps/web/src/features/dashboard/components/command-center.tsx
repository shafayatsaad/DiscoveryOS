"use client";

// Purpose: Render the dashboard research-goal command input and real-time pipeline execution.

import Link from "next/link";
import { useCallback, useState } from "react";
import {
  Check,
  FileText,
  FlaskConical,
  GitBranch,
  Lightbulb,
  Mic,
  Network,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/features/landing/components/motion-primitives";
import {
  magicMomentQuestion,
  quickActions,
} from "@/features/dashboard/data/dashboard-content";
import { usePipelineStream } from "@/features/dashboard/hooks/use-pipeline-stream";
import {
  primaryProjectId,
  projectRoute,
} from "@/features/projects/data/project-workspaces";
import { cn } from "@/lib/utils";
import { startPipeline } from "@/lib/api/client";

const PIPELINE_STAGES = [
  { id: "planner", label: "Planning", icon: Search },
  { id: "retriever", label: "Literature Retrieval", icon: Network },
  { id: "extractor", label: "Evidence Extraction", icon: FileText },
  { id: "knowledge_graph", label: "Knowledge Graph", icon: GitBranch },
  { id: "contradiction", label: "Contradiction Detection", icon: FlaskConical },
  { id: "novelty", label: "Novelty Analysis", icon: Lightbulb },
  { id: "experiment", label: "Experiment Planning", icon: GitBranch },
  { id: "report", label: "Report Generation", icon: FileText },
];

export function CommandCenter() {
  const [query, setQuery] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleEvent = useCallback(() => {
    // Events are tracked via the stream hook state
  }, []);

  const {
    events: pipelineEvents,
    latestEvent,
    status: streamStatus,
    progress,
    metadata,
    isComplete,
    isFailed,
  } = usePipelineStream({
    projectId: runId ? primaryProjectId : null,
    onEvent: handleEvent,
  });

  const isRunning =
    streamStatus === "connecting" || streamStatus === "connected";
  const hasStarted = runId !== null;

  async function runDiscovery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const researchQuery = query.trim() || magicMomentQuestion;
    setQuery(researchQuery);
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await startPipeline(primaryProjectId, researchQuery);
      setRunId(result.run_id);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to start pipeline",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Determine which stages are completed/active based on pipeline events
  const completedStages = new Set<string>();
  let activeStageId: string | null = null;

  for (const event of pipelineEvents) {
    if (event.event_type === "stage.completed" && event.stage) {
      completedStages.add(event.stage);
    }
    if (event.event_type === "stage.started" && event.stage) {
      activeStageId = event.stage;
    }
  }

  return (
    <MotionDiv
      className="glass-panel relative overflow-hidden rounded-xl p-6 text-center sm:p-8 md:p-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(173,198,255,0.06),transparent_60%)]" />
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
        <h1 className="max-w-3xl font-display text-3xl font-semibold leading-[1.15] text-on-surface sm:text-4xl lg:text-5xl">
          What scientific problem are you trying to solve today?
        </h1>

        <form
          className="mt-8 w-full max-w-4xl"
          action="#"
          onSubmit={runDiscovery}
        >
          <label className="sr-only" htmlFor="research-query">
            Research problem
          </label>
          <div className="glow-focus relative rounded-lg">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline-variant" />
            <input
              id="research-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-16 w-full rounded-lg border border-white/10 bg-[#0b0f14] py-3 pl-12 pr-36 font-mono text-sm text-on-surface outline-none transition-colors placeholder:text-outline-variant focus:border-primary focus:ring-0 sm:pr-44"
              placeholder={magicMomentQuestion}
              type="text"
              disabled={isRunning}
            />
            <div className="absolute inset-y-0 right-2 flex items-center gap-2">
              <button
                className="hidden rounded-md p-2 text-outline-variant transition-colors hover:text-primary sm:inline-flex"
                type="button"
                aria-label="Voice input"
                disabled={isRunning}
              >
                <Mic className="h-4 w-4" />
              </button>
              <Button
                type="submit"
                size="sm"
                variant="secondary"
                className="border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary"
                disabled={isSubmitting || isRunning}
              >
                {isSubmitting
                  ? "Starting..."
                  : isRunning
                    ? "Running"
                    : "Run Query"}
              </Button>
            </div>
          </div>
        </form>

        {submitError && (
          <p className="mt-4 text-sm text-red-400">{submitError}</p>
        )}

        {hasStarted ? (
          <MotionDiv
            className="mt-8 grid w-full grid-cols-1 gap-4 text-left lg:grid-cols-[1.1fr_0.9fr]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Pipeline Stages */}
            <section
              className="glass-card rounded-xl p-5"
              aria-labelledby="pipeline-heading"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-xs font-semibold uppercase tracking-normal text-primary">
                    DiscoveryOS Pipeline
                  </p>
                  <h2
                    id="pipeline-heading"
                    className="mt-1 font-display text-xl font-semibold text-on-surface"
                  >
                    {query || magicMomentQuestion}
                  </h2>
                </div>
                <span className="rounded-md bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                  {isComplete
                    ? "Complete"
                    : isFailed
                      ? "Failed"
                      : `${Math.round(progress)}%`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="space-y-3">
                {PIPELINE_STAGES.map((stage) => {
                  const completed = completedStages.has(stage.id);
                  const current =
                    stage.id === activeStageId && !isComplete && !isFailed;

                  return (
                    <div
                      key={stage.id}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border border-white/[0.05] bg-surface/50 p-3 transition-all duration-300",
                        current && "border-primary/30 bg-primary/[0.06]",
                        !completed && !current && "opacity-45",
                        isFailed &&
                          stage.id === activeStageId &&
                          "border-red-400/30 bg-red-400/5",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                          completed
                            ? "border-primary bg-primary/10 text-primary"
                            : current
                              ? "border-primary/50 bg-primary/5 text-primary"
                              : "border-white/10 text-outline-variant",
                        )}
                      >
                        {completed ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-sm font-semibold text-on-surface">
                          {stage.label}
                        </span>
                        <span className="mt-1 block text-xs leading-[1.45] text-on-surface-variant">
                          {current
                            ? "Running..."
                            : completed
                              ? "Completed"
                              : "Pending"}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Results Panel */}
            <section
              className="glass-card rounded-xl p-5"
              aria-labelledby="results-heading"
            >
              <p className="font-display text-xs font-semibold uppercase tracking-normal text-primary">
                Pipeline Results
              </p>
              <h2
                id="results-heading"
                className="mt-1 font-display text-xl font-semibold text-on-surface"
              >
                {isComplete
                  ? "Evidence-backed workspace ready"
                  : isFailed
                    ? "Pipeline failed"
                    : "Running discovery pipeline..."}
              </h2>

              <div className="mt-5 space-y-3">
                {/* Current Stage */}
                <div
                  className={cn(
                    "rounded-lg border border-white/[0.05] bg-surface/50 p-3",
                    !isComplete && !isRunning && "opacity-45",
                  )}
                >
                  <p className="font-display text-xs font-semibold uppercase tracking-normal text-primary">
                    Current Stage
                  </p>
                  <p className="mt-1 text-sm leading-[1.45] text-on-surface-variant">
                    {latestEvent?.stage
                      ? (PIPELINE_STAGES.find((s) => s.id === latestEvent.stage)
                          ?.label ?? latestEvent.stage)
                      : "Waiting..."}
                  </p>
                </div>

                {/* Progress */}
                <div
                  className={cn(
                    "rounded-lg border border-white/[0.05] bg-surface/50 p-3",
                    !isComplete && !isRunning && "opacity-45",
                  )}
                >
                  <p className="font-display text-xs font-semibold uppercase tracking-normal text-primary">
                    Progress
                  </p>
                  <p className="mt-1 text-sm leading-[1.45] text-on-surface-variant">
                    {Math.round(progress)}%
                  </p>
                </div>

                {/* Papers Count */}
                <div
                  className={cn(
                    "rounded-lg border border-white/[0.05] bg-surface/50 p-3",
                    !isComplete && !isRunning && "opacity-45",
                  )}
                >
                  <p className="font-display text-xs font-semibold uppercase tracking-normal text-primary">
                    Papers Retrieved
                  </p>
                  <p className="mt-1 text-sm leading-[1.45] text-on-surface-variant">
                    {metadata?.papers_count ?? 0}
                  </p>
                </div>

                {/* Evidence Count */}
                <div
                  className={cn(
                    "rounded-lg border border-white/[0.05] bg-surface/50 p-3",
                    !isComplete && !isRunning && "opacity-45",
                  )}
                >
                  <p className="font-display text-xs font-semibold uppercase tracking-normal text-primary">
                    Evidence Records
                  </p>
                  <p className="mt-1 text-sm leading-[1.45] text-on-surface-variant">
                    {metadata?.evidence_count ?? 0}
                  </p>
                </div>

                {/* Contradictions */}
                <div
                  className={cn(
                    "rounded-lg border border-white/[0.05] bg-surface/50 p-3",
                    !isComplete && !isRunning && "opacity-45",
                  )}
                >
                  <p className="font-display text-xs font-semibold uppercase tracking-normal text-primary">
                    Contradictions
                  </p>
                  <p className="mt-1 text-sm leading-[1.45] text-on-surface-variant">
                    {metadata?.contradictions_count ?? 0}
                  </p>
                </div>

                {/* Novelty Score */}
                <div
                  className={cn(
                    "rounded-lg border border-white/[0.05] bg-surface/50 p-3",
                    !isComplete && !isRunning && "opacity-45",
                  )}
                >
                  <p className="font-display text-xs font-semibold uppercase tracking-normal text-primary">
                    Novelty Score
                  </p>
                  <p className="mt-1 text-sm leading-[1.45] text-on-surface-variant">
                    {metadata?.novelty_score != null
                      ? `${Math.round(metadata.novelty_score * 100)}%`
                      : "—"}
                  </p>
                </div>

                {/* Execution Time */}
                <div
                  className={cn(
                    "rounded-lg border border-white/[0.05] bg-surface/50 p-3",
                    !isComplete && !isRunning && "opacity-45",
                  )}
                >
                  <p className="font-display text-xs font-semibold uppercase tracking-normal text-primary">
                    Execution Time
                  </p>
                  <p className="mt-1 text-sm leading-[1.45] text-on-surface-variant">
                    {metadata?.execution_time_ms != null
                      ? `${(metadata.execution_time_ms / 1000).toFixed(1)}s`
                      : "—"}
                  </p>
                </div>
              </div>

              {isComplete && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Evidence",
                      href: projectRoute(primaryProjectId, "evidence"),
                      icon: FileText,
                    },
                    {
                      label: "Graph",
                      href: projectRoute(primaryProjectId, "graph"),
                      icon: Network,
                    },
                    {
                      label: "Experiments",
                      href: projectRoute(primaryProjectId, "experiments"),
                      icon: Lightbulb,
                    },
                    {
                      label: "Report",
                      href: projectRoute(primaryProjectId, "reports"),
                      icon: GitBranch,
                    },
                  ].map((link) => {
                    const Icon = link.icon;

                    return (
                      <Button
                        key={link.label}
                        asChild
                        variant="secondary"
                        size="sm"
                        className="justify-center"
                      >
                        <Link href={link.href}>
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              )}
            </section>
          </MotionDiv>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.label}
                href={action.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface/60 px-4 py-2 font-display text-xs font-semibold text-on-surface-variant transition-colors hover:bg-white/[0.05] hover:text-on-surface"
              >
                <Icon className="h-3.5 w-3.5" />
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>
    </MotionDiv>
  );
}
