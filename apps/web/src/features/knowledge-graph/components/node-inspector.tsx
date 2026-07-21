// Purpose: Render the selected graph node inspector panel.

import { Bookmark, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/features/landing/components/motion-primitives";
import type { SelectedGraphNode } from "@/features/knowledge-graph/data/knowledge-graph-content";

export function NodeInspector({ selectedNode }: { selectedNode: SelectedGraphNode }) {
  return (
    <MotionDiv
      className="glass-panel pointer-events-auto flex flex-col gap-6 rounded-xl p-5 shadow-ambient lg:absolute lg:bottom-10 lg:right-10 lg:top-24 lg:w-80"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.12, duration: 0.4 }}
    >
      <div className="flex items-start justify-between border-b border-white/10 pb-5">
        <div>
          <span className="mb-2 inline-block rounded-md bg-primary/10 px-2 py-1 font-display text-xs font-semibold text-primary">
            {selectedNode.type}
          </span>
          <h1 className="font-display text-3xl font-semibold text-on-surface">{selectedNode.symbol}</h1>
          <p className="mt-2 text-sm text-on-surface-variant">{selectedNode.name}</p>
        </div>
        <button className="text-on-surface-variant transition-colors hover:text-on-surface" type="button" aria-label="Close inspector">
          <X className="h-5 w-5" />
        </button>
      </div>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold text-on-surface">Function</h2>
        <p className="text-sm leading-[1.65] text-on-surface-variant">{selectedNode.function}</p>
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold text-on-surface">Related Pathways</h2>
        <div className="flex flex-wrap gap-2">
          {selectedNode.pathways.map((pathway) => (
            <span
              key={pathway}
              className="rounded-full border border-white/[0.05] bg-surface-container px-3 py-1.5 text-sm text-on-surface"
            >
              {pathway}
            </span>
          ))}
        </div>
      </section>

      <div className="mt-auto flex gap-3">
        <Button className="flex-1">Analyze</Button>
        <button
          className="focus-ring flex h-11 w-12 items-center justify-center rounded-lg border border-white/10 text-on-surface transition-colors hover:bg-white/[0.05]"
          type="button"
          aria-label="Bookmark node"
        >
          <Bookmark className="h-5 w-5" />
        </button>
      </div>
    </MotionDiv>
  );
}
