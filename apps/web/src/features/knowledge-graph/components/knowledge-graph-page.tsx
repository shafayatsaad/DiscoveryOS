// Purpose: Compose the Stitch knowledge graph explorer as a responsive project tool.

import { GraphCanvas } from "@/features/knowledge-graph/components/graph-canvas";
import { GraphFilters } from "@/features/knowledge-graph/components/graph-filters";
import { GraphSearch } from "@/features/knowledge-graph/components/graph-search";
import { NodeInspector } from "@/features/knowledge-graph/components/node-inspector";

export function KnowledgeGraphPage() {
  return (
    <main className="relative min-h-screen overflow-y-auto bg-surface-container-lowest text-on-surface lg:h-screen lg:overflow-hidden">
      <GraphCanvas />
      <div className="relative z-20 flex min-h-screen flex-col gap-4 p-5 sm:p-8 lg:block lg:p-0">
        <GraphSearch />
        <GraphFilters />
        <NodeInspector />
      </div>
    </main>
  );
}
