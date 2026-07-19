// Purpose: Render graph filtering controls from mocked node-type metadata.

import { nodeTypeFilters } from "@/features/knowledge-graph/data/knowledge-graph-content";
import { MotionDiv } from "@/features/landing/components/motion-primitives";
import { cn } from "@/lib/utils";

const toneClasses = {
  primary: "border-primary bg-primary/20 text-primary",
  tertiary: "border-tertiary bg-tertiary/20 text-tertiary",
  error: "border-error bg-error/20 text-error",
};

const dotClasses = {
  primary: "bg-primary",
  tertiary: "bg-tertiary",
  error: "bg-error",
};

export function GraphFilters() {
  return (
    <MotionDiv
      className="glass-panel pointer-events-auto flex flex-col gap-6 rounded-xl p-5 lg:absolute lg:bottom-10 lg:left-10 lg:top-24 lg:w-72"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08, duration: 0.4 }}
    >
      <section aria-labelledby="node-types-heading">
        <h2 id="node-types-heading" className="mb-4 font-display text-2xl font-semibold text-on-surface">
          Node Types
        </h2>
        <div className="flex flex-col gap-3">
          {nodeTypeFilters.map((filter) => (
            <label
              key={filter.label}
              className="group flex cursor-pointer items-center gap-3 text-sm text-on-surface-variant"
            >
              <input className="sr-only" type="checkbox" defaultChecked />
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
                  toneClasses[filter.tone],
                )}
              >
                <span className={cn("h-2 w-2 rounded-full", dotClasses[filter.tone])} />
              </span>
              <span>{filter.label}</span>
              <span className="ml-auto font-mono text-sm text-on-surface-variant/50">{filter.count}</span>
            </label>
          ))}
        </div>
      </section>

      <section aria-labelledby="relationship-strength-heading">
        <h2
          id="relationship-strength-heading"
          className="mb-4 font-display text-xl font-semibold text-on-surface"
        >
          Relationship Strength
        </h2>
        <input
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-surface-container-high accent-primary outline-none"
          aria-label="Relationship strength"
          max="100"
          min="0"
          type="range"
          defaultValue="50"
        />
        <div className="mt-3 flex justify-between font-display text-xs font-semibold text-on-surface-variant">
          <span>Low</span>
          <span>High</span>
        </div>
      </section>

      <button
        className="mt-auto rounded-lg border border-white/10 py-3 font-display text-xs font-semibold uppercase tracking-normal text-on-surface transition-colors hover:bg-white/[0.05]"
        type="button"
      >
        Reset Filters
      </button>
    </MotionDiv>
  );
}
