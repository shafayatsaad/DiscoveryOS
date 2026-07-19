// Purpose: Render the floating graph search and filter affordance.

import { ListFilter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/features/landing/components/motion-primitives";

export function GraphSearch() {
  return (
    <MotionDiv
      className="glass-panel pointer-events-auto mx-auto flex w-full max-w-2xl items-center gap-3 rounded-full px-4 py-3 shadow-ambient lg:absolute lg:left-1/2 lg:top-10 lg:-translate-x-1/2"
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38 }}
    >
      <Search className="h-5 w-5 shrink-0 text-on-surface-variant" />
      <label className="sr-only" htmlFor="graph-search">
        Search knowledge graph
      </label>
      <input
        id="graph-search"
        className="min-w-0 flex-1 border-none bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:ring-0 sm:text-base"
        placeholder="Search genes, proteins, pathways..."
        type="search"
      />
      <Button className="h-9 shrink-0 rounded-full px-4" size="sm">
        <ListFilter className="h-4 w-4" />
        Filter
      </Button>
    </MotionDiv>
  );
}
