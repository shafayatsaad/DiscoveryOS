// Purpose: Render Evidence Explorer search and domain filter controls.

import { Check, Search, SlidersHorizontal } from "lucide-react";

import { evidenceFilters } from "@/features/evidence/data/evidence-content";
import { cn } from "@/lib/utils";

export function EvidenceToolbar() {
  return (
    <section className="sticky top-16 z-30 flex flex-col gap-3 border-b border-white/[0.05] bg-[#0b0f14]/90 px-5 py-4 backdrop-blur-md sm:px-8 md:top-0 md:px-10 lg:flex-row lg:items-center">
      <label className="relative w-full shrink-0 lg:w-96">
        <span className="sr-only">Search evidence</span>
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
        <input
          className="h-12 w-full rounded-lg border border-white/10 bg-surface-container-low py-3 pl-12 pr-4 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Search claims, genes, or DOI..."
          type="search"
        />
      </label>

      <div className="flex w-full gap-3 overflow-x-auto pb-1 lg:pb-0">
        {evidenceFilters.map((filter, index) => (
          <button
            key={filter}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 font-display text-xs font-semibold tracking-normal transition-colors",
              index === 0
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-white/10 bg-surface-container/60 text-on-surface-variant hover:bg-white/[0.05] hover:text-on-surface",
            )}
            type="button"
          >
            {index === 0 ? <Check className="h-4 w-4" /> : null}
            {filter}
          </button>
        ))}

        <button
          className="ml-auto inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-3 font-display text-xs font-semibold text-on-surface-variant transition-colors hover:text-primary"
          type="button"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Advanced Filters
        </button>
      </div>
    </section>
  );
}
