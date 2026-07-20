// Purpose: Render the floating graph search and filter affordance.

import { ListFilter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/features/landing/components/motion-primitives";

export function GraphSearch({
  domain,
  resultCount,
  searchId = "graph-search",
  value,
  onChange,
}: {
  domain: string;
  resultCount: number;
  searchId?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <MotionDiv
      className="glass-panel pointer-events-auto mx-auto flex w-full max-w-2xl items-center gap-3 rounded-full px-4 py-3 shadow-ambient lg:absolute lg:left-1/2 lg:top-10 lg:-translate-x-1/2"
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38 }}
    >
      <Search className="h-5 w-5 shrink-0 text-on-surface-variant" />
      <label className="sr-only" htmlFor={searchId}>
        Search knowledge graph
      </label>
      <input
        id={searchId}
        className="min-w-0 flex-1 border-none bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:ring-0 sm:text-base"
        onChange={(event) => onChange(event.target.value)}
        placeholder={`Search ${domain} graph...`}
        type="search"
        value={value}
      />
      <span className="hidden font-mono text-xs text-on-surface-variant/60 sm:inline">
        {resultCount} nodes
      </span>
      <Button className="h-9 shrink-0 rounded-full px-4" size="sm" type="button">
        <ListFilter className="h-4 w-4" />
        Filter
      </Button>
    </MotionDiv>
  );
}
