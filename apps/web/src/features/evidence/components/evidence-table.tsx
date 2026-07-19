// Purpose: Render expandable evidence records with extraction context and verification traces.

import { ChevronRight, Verified } from "lucide-react";

import type { EvidenceRecord } from "@/features/evidence/data/evidence-content";
import { evidenceRecords } from "@/features/evidence/data/evidence-content";
import { MotionDiv } from "@/features/landing/components/motion-primitives";
import { cn } from "@/lib/utils";

const claimToneClasses: Record<EvidenceRecord["claimType"], string> = {
  Efficacy: "border-secondary/10 bg-secondary-container/30 text-secondary-fixed",
  Resistance: "border-error/10 bg-error-container/30 text-error",
  Biomarker: "border-tertiary/10 bg-tertiary-container/30 text-tertiary-fixed",
};

const confidenceToneClasses: Record<EvidenceRecord["claimType"], string> = {
  Efficacy: "bg-primary",
  Resistance: "bg-secondary",
  Biomarker: "bg-tertiary",
};

export function EvidenceTable() {
  return (
    <section className="px-5 py-5 sm:px-8 md:px-10" aria-labelledby="evidence-table-heading">
      <h2 id="evidence-table-heading" className="sr-only">
        Evidence records
      </h2>
      <div className="overflow-x-auto">
        <div className="min-w-[1120px]">
          <div className="grid grid-cols-[44px_2.2fr_3fr_1.25fr_1.25fr_1.7fr_1fr] gap-4 border-b border-white/10 bg-[#0b0f14]/95 py-3 font-display text-xs font-semibold text-on-surface-variant">
            <span />
            <span>Paper Title</span>
            <span>Evidence Snippet</span>
            <span>Claim Type</span>
            <span>Confidence</span>
            <span>Citation</span>
            <span>DOI</span>
          </div>

          <div>
            {evidenceRecords.map((record, index) => (
              <MotionDiv
                key={record.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.28 }}
              >
                <EvidenceRow record={record} />
              </MotionDiv>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EvidenceRow({ record }: { record: EvidenceRecord }) {
  return (
    <details className="group border-b border-white/[0.05] transition-colors open:bg-surface-container-low/30 hover:bg-surface-container-low/40 [&>summary::-webkit-details-marker]:hidden">
      <summary className="grid cursor-pointer list-none grid-cols-[44px_2.2fr_3fr_1.25fr_1.25fr_1.7fr_1fr] gap-4 py-5">
        <span className="pt-1 text-on-surface-variant">
          <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
        </span>
        <span className="pr-3 font-display text-base font-semibold leading-[1.45] text-on-surface">
          {record.title}
        </span>
        <span className="pr-3 text-sm leading-[1.55] text-on-surface-variant">{record.snippet}</span>
        <span>
          <span
            className={cn(
              "inline-block rounded-md border px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-normal",
              claimToneClasses[record.claimType],
            )}
          >
            {record.claimType}
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="font-mono text-sm text-primary">{record.confidence}%</span>
          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
            <span
              className={cn("block h-full", confidenceToneClasses[record.claimType])}
              style={{ width: `${record.confidence}%` }}
            />
          </span>
        </span>
        <span className="truncate pr-3 text-sm text-on-surface-variant/80">{record.citation}</span>
        <span className="font-mono text-sm text-primary">{record.doi}</span>
      </summary>

      <div className="pb-5 pl-11 pr-4">
        <div className="glass-panel rounded-lg bg-surface-container-lowest/50 p-5">
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex-1 lg:border-r lg:border-white/[0.05] lg:pr-5">
              <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-normal text-on-surface-variant">
                Extracted Context
              </h3>
              <p className="text-base leading-[1.65] text-on-surface">
                <span className="text-on-surface-variant">{record.contextBefore} </span>
                <mark className="rounded bg-primary-container/20 px-1 text-primary-fixed">
                  {record.highlight}
                </mark>
                <span className="text-on-surface-variant"> {record.contextAfter}</span>
              </p>
            </div>

            <div className="w-full space-y-4 lg:w-64">
              <div>
                <h3 className="mb-2 font-display text-xs font-semibold uppercase tracking-normal text-on-surface-variant">
                  Extracted Entities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {record.entities.map((entity) => (
                    <span
                      key={entity}
                      className="rounded bg-surface-bright px-2 py-1 font-mono text-[11px] text-on-surface"
                    >
                      {entity}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-display text-xs font-semibold uppercase tracking-normal text-on-surface-variant">
                  Verification Trace
                </h3>
                <div className="space-y-1">
                  {record.trace.map((trace) => (
                    <div key={trace} className="flex items-center gap-2 text-xs text-on-surface">
                      <Verified className="h-3.5 w-3.5 text-primary" />
                      {trace}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </details>
  );
}
