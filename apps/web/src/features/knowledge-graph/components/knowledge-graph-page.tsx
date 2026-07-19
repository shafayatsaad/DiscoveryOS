// Purpose: Compose the Stitch knowledge graph explorer as a responsive project tool.

import { GraphCanvas } from "@/features/knowledge-graph/components/graph-canvas";
import { GraphFilters } from "@/features/knowledge-graph/components/graph-filters";
import { GraphSearch } from "@/features/knowledge-graph/components/graph-search";
import { NodeInspector } from "@/features/knowledge-graph/components/node-inspector";
import { getGraphData } from "@/features/knowledge-graph/data/knowledge-graph-content";

export function KnowledgeGraphPage({ projectId }: { projectId: string }) {
  const graphData = getGraphData(projectId);

  return (
    <main className="relative min-h-screen overflow-y-auto bg-surface-container-lowest text-on-surface lg:h-screen lg:overflow-hidden">
      <div className="relative z-20 flex flex-col gap-4 p-5 pb-0 sm:p-8 sm:pb-0 lg:hidden">
        <GraphSearch domain={graphData.domain} searchId="graph-search-mobile" />
      </div>
      <GraphCanvas edges={graphData.edges} nodes={graphData.nodes} />
      <div className="relative z-20 flex flex-col gap-4 p-5 pt-0 sm:p-8 sm:pt-0 lg:block lg:min-h-screen lg:p-0">
        <div className="hidden lg:block">
          <GraphSearch domain={graphData.domain} searchId="graph-search-desktop" />
        </div>
        <GraphFilters filters={graphData.filters} />
        <NodeInspector selectedNode={graphData.selectedNode} />
      </div>
    </main>
  );
}
