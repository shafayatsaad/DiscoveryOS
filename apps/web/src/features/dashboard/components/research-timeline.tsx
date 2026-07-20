"use client";

// Purpose: Render an animated real-time research timeline from pipeline SSE events.

import { useEffect, useRef } from "react";
import {
  Atom,
  BrainCircuit,
  Check,
  Cpu,
  FileText,
  FlaskConical,
  GitBranch,
  Lightbulb,
  Network,
  Search,
} from "lucide-react";

import type { PipelineEvent } from "@/lib/api/client";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TimelineEntry = {
  id: string;
  time: string;
  message: string;
  detail: string;
  icon: typeof Search;
  isActive: boolean;
  isComplete: boolean;
  isFailed: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(timestamp: string | null | undefined): string {
  if (!timestamp) return "";
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "";
  }
}

const STAGE_ICONS: Record<string, typeof Search> = {
  planner: Atom,
  retriever: Search,
  extractor: FileText,
  knowledge_graph: Network,
  contradiction: FlaskConical,
  novelty: BrainCircuit,
  experiment: Lightbulb,
  report: GitBranch,
};

function countFromMetadata(
  metadata: PipelineEvent["metadata"] | null,
  key: keyof PipelineEvent["metadata"],
): number | null {
  if (!metadata) return null;
  const val = metadata[key];
  if (typeof val === "number") return val;
  return null;
}

// ---------------------------------------------------------------------------
// Timeline entry derivation
// ---------------------------------------------------------------------------

export function deriveTimelineEntries(
  events: PipelineEvent[],
  metadata: PipelineEvent["metadata"] | null,
  isComplete: boolean,
  isFailed: boolean,
): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const stage = event.stage;
    const eventType = event.event_type;
    const icon = (stage && STAGE_ICONS[stage]) || Cpu;
    const isLast = i === events.length - 1;
    const active = isLast && !isComplete && !isFailed;
    const complete = isLast ? isComplete : true;

    // Derive a friendly message from the event type and stage
    let message = event.message || eventType;
    let detail = "";

    if (eventType === "pipeline.started") {
      message = "Pipeline Started";
    } else if (eventType === "pipeline.completed") {
      message = "Pipeline Complete";
    } else if (eventType === "pipeline.failed") {
      message = "Pipeline Failed";
    } else if (eventType === "stage.started") {
      switch (stage) {
        case "planner":
          message = "Planning Started";
          break;
        case "retriever":
          message = "Searching Literature...";
          break;
        case "extractor":
          message = "Extracting Evidence";
          break;
        case "knowledge_graph":
          message = "Building Knowledge Graph";
          break;
        case "contradiction":
          message = "Detecting Contradictions";
          break;
        case "novelty":
          message = "Analyzing Novelty";
          break;
        case "experiment":
          message = "Planning Experiments";
          break;
        case "report":
          message = "Generating Report";
          break;
        default:
          message = `${stage} Started`;
      }
    } else if (eventType === "stage.completed") {
      switch (stage) {
        case "planner": {
          const kws = countFromMetadata(metadata, "papers_count");
          message = "Research Plan Generated";
          detail = kws != null ? `Prepared search strategy` : "";
          break;
        }
        case "retriever": {
          const papers = countFromMetadata(metadata, "papers_count");
          message =
            papers != null ? `Found ${papers} Papers` : "Literature Retrieved";
          detail = papers != null ? `From scientific indexes` : "";
          break;
        }
        case "extractor": {
          const ev = countFromMetadata(metadata, "evidence_count");
          message =
            ev != null
              ? `Extracted ${ev} Evidence Records`
              : "Evidence Extraction Complete";
          break;
        }
        case "knowledge_graph":
          message = "Knowledge Graph Generated";
          break;
        case "contradiction": {
          const c = countFromMetadata(metadata, "contradictions_count");
          message =
            c != null
              ? `Detected ${c} Contradictions`
              : "Contradiction Analysis Complete";
          break;
        }
        case "novelty": {
          const ns = metadata?.novelty_score;
          message =
            ns != null
              ? `Novelty Score: ${Math.round(ns * 100)}%`
              : "Novelty Analysis Complete";
          break;
        }
        case "experiment":
          message = "Experiment Plan Ready";
          break;
        case "report":
          message = "Report Generated";
          break;
        default:
          message = `${stage} Complete`;
      }
    }

    entries.push({
      id: `${eventType}:${stage || "pipeline"}:${i}`,
      time: formatTime(event.timestamp),
      message,
      detail,
      icon,
      isActive: active,
      isComplete: complete,
      isFailed: isLast && isFailed,
    });
  }

  return entries;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type ResearchTimelineProps = {
  entries: TimelineEntry[];
  progress: number;
  isComplete: boolean;
  isFailed: boolean;
  isRunning: boolean;
};

export function ResearchTimeline({
  entries,
  progress,
  isComplete,
  isFailed,
  isRunning,
}: ResearchTimelineProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest entry
  useEffect(() => {
    if (listRef.current) {
      const lastEntry = listRef.current.lastElementChild;
      if (lastEntry) {
        lastEntry.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [entries.length]);

  return (
    <section
      className="glass-card rounded-xl p-5"
      aria-labelledby="timeline-heading"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-normal text-primary">
            Research Timeline
          </p>
          <h2
            id="timeline-heading"
            className="mt-1 font-display text-xl font-semibold text-on-surface"
          >
            {isComplete
              ? "Discovery Complete"
              : isFailed
                ? "Pipeline Failed"
                : isRunning
                  ? "Running Discovery..."
                  : "Ready"}
          </h2>
        </div>
        <span
          className={cn(
            "rounded-md px-3 py-1 font-mono text-xs",
            isComplete
              ? "bg-green-500/20 text-green-400"
              : isFailed
                ? "bg-red-500/20 text-red-400"
                : "bg-primary/10 text-primary",
          )}
        >
          {isComplete
            ? "100%"
            : isFailed
              ? "Failed"
              : `${Math.round(progress)}%`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Timeline entries */}
      <div
        ref={listRef}
        className="relative max-h-[400px] space-y-0 overflow-y-auto pr-2"
      >
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Cpu className="mb-3 h-8 w-8 text-outline-variant" />
            <p className="font-display text-sm font-medium text-on-surface-variant">
              No timeline events yet
            </p>
            <p className="mt-1 text-xs text-outline-variant">
              Submit a research question to begin.
            </p>
          </div>
        ) : (
          entries.map((entry, index) => (
            <TimelineRow
              key={entry.id}
              entry={entry}
              isLast={index === entries.length - 1}
            />
          ))
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Timeline Row
// ---------------------------------------------------------------------------

function TimelineRow({
  entry,
  isLast,
}: {
  entry: TimelineEntry;
  isLast: boolean;
}) {
  const Icon = entry.icon;

  return (
    <div className="relative flex items-start gap-3 pb-4">
      {/* Vertical connecting line */}
      <div className="flex flex-col items-center">
        {/* Dot */}
        <div
          className={cn(
            "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
            entry.isComplete && !entry.isFailed
              ? "border-primary/30 bg-primary/10 text-primary"
              : entry.isActive
                ? "border-primary/50 bg-primary/5 text-primary"
                : entry.isFailed
                  ? "border-red-400/30 bg-red-400/5 text-red-400"
                  : "border-white/10 bg-surface/50 text-outline-variant",
            entry.isActive && "animate-pulse",
          )}
        >
          {entry.isComplete && !entry.isFailed ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Icon className="h-3.5 w-3.5" />
          )}
        </div>
        {/* Line connector */}
        {!isLast && (
          <div
            className={cn(
              "h-full w-px",
              entry.isComplete && !entry.isFailed
                ? "bg-primary/30"
                : "bg-white/[0.06]",
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pb-4">
        <div className="flex items-baseline justify-between gap-2">
          <span
            className={cn(
              "font-display text-sm font-semibold",
              entry.isComplete && !entry.isFailed
                ? "text-on-surface"
                : entry.isActive
                  ? "text-primary"
                  : entry.isFailed
                    ? "text-red-400"
                    : "text-on-surface-variant/60",
            )}
          >
            {entry.message}
          </span>
          {entry.time && (
            <span className="shrink-0 font-mono text-[11px] text-outline-variant">
              {entry.time}
            </span>
          )}
        </div>
        {entry.detail && (
          <p className="mt-0.5 text-xs leading-[1.45] text-on-surface-variant">
            {entry.detail}
          </p>
        )}
      </div>
    </div>
  );
}
