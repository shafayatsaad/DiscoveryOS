"use client";

// Purpose: Render the dashboard research-goal command input and animated research timeline.

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { Mic, Search, WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/feedback/error-boundary";
import { MotionDiv } from "@/features/landing/components/motion-primitives";
import {
  magicMomentQuestion,
  quickActions,
} from "@/features/dashboard/data/dashboard-content";
import {
  deriveTimelineEntries,
  ResearchTimeline,
} from "@/features/dashboard/components/research-timeline";
import { usePipelineStream } from "@/features/dashboard/hooks/use-pipeline-stream";
import {
  getProjectWorkspace,
  primaryProjectId,
} from "@/features/projects/data/project-workspaces";
import { startPipeline } from "@/lib/api/client";

export function CommandCenter() {
  // Use the active project's research goal as the input placeholder when available.
  const activeProject = getProjectWorkspace(primaryProjectId);
  const inputPlaceholder = activeProject?.researchGoal ?? magicMomentQuestion;
  const [query, setQuery] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleEvent = useCallback(() => {
    // Events are tracked via the stream hook state
  }, []);

  const {
    events: pipelineEvents,
    status: streamStatus,
    progress,
    metadata,
    isComplete,
    isFailed,
    isReconnectExhausted,
  } = usePipelineStream({
    projectId: runId ? primaryProjectId : null,
    onEvent: handleEvent,
  });

  const isRunning =
    streamStatus === "connecting" || streamStatus === "connected";
  const hasStarted = runId !== null;

  const timelineEntries = useMemo(
    () => deriveTimelineEntries(pipelineEvents, metadata, isComplete, isFailed),
    [pipelineEvents, metadata, isComplete, isFailed],
  );

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

  return (
    <ErrorBoundary>
      <MotionDiv
        className="glass-panel-elevated relative overflow-hidden rounded-xl p-6 text-center sm:p-8 md:p-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(173,198,255,0.06),transparent_60%)]" />

        {/* Connection lost banner */}
        {isReconnectExhausted && (
          <div className="relative z-10 mb-6 flex items-center justify-center gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <WifiOff className="h-4 w-4 shrink-0" />
            <span>
              Connection lost. Could not reconnect to the backend after multiple
              attempts. Please refresh the page or try again later.
            </span>
          </div>
        )}

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
          <h1 className="max-w-3xl font-display text-3xl font-bold leading-[1.15] text-on-surface sm:text-4xl lg:text-5xl tracking-tight">
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
            <div className="glow-focus relative rounded-lg transition-all duration-300">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/55" />
              <input
                id="research-query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-16 w-full rounded-lg border border-white/10 bg-[#070b11] py-3 pl-12 pr-36 font-mono text-sm text-on-surface outline-none transition-all placeholder:text-outline-variant focus:border-primary focus:ring-0 sm:pr-44 focus:shadow-[0_0_25px_rgba(173,198,255,0.12)]"
                placeholder={inputPlaceholder}
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
                  className="border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary shadow-glow-sm hover:shadow-glow-md"
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

          {hasStarted && (
            <MotionDiv
              className="mt-8 w-full max-w-3xl text-left"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <ResearchTimeline
                entries={timelineEntries}
                progress={progress}
                isComplete={isComplete}
                isFailed={isFailed}
                isRunning={isRunning}
              />
            </MotionDiv>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md px-4 py-2 font-display text-xs font-semibold text-on-surface-variant hover:border-primary/30 hover:bg-white/[0.05] hover:text-primary transition-all duration-300 hover:shadow-[0_0_15px_rgba(173,198,255,0.06)] hover:scale-[1.02]"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {action.label}
                </Link>
              );
            })}
          </div>
        </div>
      </MotionDiv>
    </ErrorBoundary>
  );
}
