// Purpose: Render expandable research pipeline stages and live execution logs.

import { ChevronDown } from "lucide-react";

import {
  getJobSteps,
  statusIcon,
  type JobLogLine,
  type JobStep,
} from "@/features/workflows/data/research-jobs-content";
import { MotionDiv } from "@/features/landing/components/motion-primitives";
import { cn } from "@/lib/utils";

const statusToneClasses: Record<JobStep["status"], string> = {
  Done: "border-[#4ade80] bg-[#1c2025] text-[#4ade80]",
  Running: "border-primary bg-primary-container/20 text-primary",
  Queued: "border-tertiary bg-tertiary/10 text-tertiary",
  Pending: "border-outline-variant bg-[#1c2025] text-outline-variant",
};

const badgeToneClasses: Record<JobStep["status"], string> = {
  Done: "bg-[#4ade80]/10 text-[#4ade80]",
  Running: "bg-primary/10 text-primary",
  Queued: "bg-tertiary/10 text-tertiary",
  Pending: "bg-surface-variant text-on-surface-variant",
};

const logToneClasses: Record<JobLogLine["level"], string> = {
  INIT: "text-on-surface",
  INFO: "text-on-surface-variant",
  WARN: "text-[#facc15]",
  SUCCESS: "text-primary",
  DONE: "text-[#4ade80]",
  RUNNING: "text-primary animate-pulse",
};

export function ResearchTimeline({ projectId }: { projectId: string }) {
  const jobSteps = getJobSteps(projectId);

  return (
    <section className="glass-panel rounded-xl p-5 sm:p-6" aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="sr-only">
        Research pipeline execution timeline
      </h2>
      <div className="relative">
        {jobSteps.map((step, index) => (
          <MotionDiv
            key={step.title}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.32 }}
          >
            <TimelineStep step={step} isLast={index === jobSteps.length - 1} />
          </MotionDiv>
        ))}
      </div>
    </section>
  );
}

function TimelineStep({ step, isLast }: { step: JobStep; isLast: boolean }) {
  const Icon = statusIcon[step.status];
  const hasLogs = Boolean(step.logs?.length);

  return (
    <div
      className={cn(
        "relative",
        !isLast && "pb-7",
        (step.status === "Pending" || step.status === "Queued") && "opacity-70",
      )}
    >
      {!isLast ? (
        <span className="absolute bottom-0 left-[23px] top-12 w-0.5 bg-surface-variant" aria-hidden="true" />
      ) : null}
      <span
        className={cn(
          "absolute left-0 top-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border-2",
          statusToneClasses[step.status],
        )}
      >
        <Icon className={cn("h-5 w-5", step.status === "Running" && "animate-spin")} />
      </span>

      <details className="group pl-14" open={step.defaultOpen}>
        <summary
          className={cn(
            "flex list-none flex-col gap-3 rounded-lg py-1 sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden",
            hasLogs && "cursor-pointer",
          )}
        >
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <h3 className="font-display text-xl font-semibold leading-[1.3] text-on-surface transition-colors group-hover:text-primary sm:text-2xl">
              {step.title}
            </h3>
            <span
              className={cn(
                "rounded-full px-3 py-1 font-display text-xs font-semibold tracking-normal",
                badgeToneClasses[step.status],
              )}
            >
              {step.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono text-sm text-on-surface-variant">
            <span className="text-primary">{step.bar}</span>
            <span>{step.activity}</span>
            <span>{step.metric}</span>
            {hasLogs ? (
              <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180 group-hover:text-primary" />
            ) : null}
          </div>
        </summary>

        {hasLogs ? (
          <div className="code-block mt-4 overflow-x-auto rounded-lg p-4 font-mono text-sm leading-[1.55] text-on-surface-variant">
            {step.logs?.map((log) => (
              <div
                key={`${step.title}-${log.time}-${log.message}`}
                className={cn("flex min-w-[720px] gap-4", logToneClasses[log.level])}
              >
                <span className="w-16 shrink-0 text-outline">{log.time}</span>
                <span>
                  [{log.level}] {log.message}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </details>
    </div>
  );
}
