"use client";

// Purpose: Compose the Stitch knowledge graph explorer as a responsive project tool with breadcrumbs.

import { FileSearch } from "lucide-react";
import { useMemo, useState } from "react";

import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import type { BreadcrumbSegment } from "@/components/navigation/breadcrumbs";
import { EmptyState } from "@/components/ui/feedback-states";
import { AnimatedCard } from "@/components/ui/motion";
import { GraphCanvas } from "@/features/knowledge-graph/components/graph-canvas";
import { GraphFilters } from "@/features/knowledge-graph/components/graph-filters";
import { GraphSearch } from "@/features/knowledge-graph/components/graph-search";
import { NodeInspector } from "@/features/knowledge-graph/components/node-inspector";
import {
  getGraphData,
  type GraphEdge,
} from "@/features/knowledge-graph/data/knowledge-graph-content";
import { getProjectWorkspace } from "@/features/projects/data/project-workspaces";

export function KnowledgeGraphPage({ projectId }: { projectId: string }) {
  const graphData = getGraphData(projectId);
  const project = getProjectWorkspace(projectId);
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState(() =>
    graphData.filters.map((filter) => filter.label),
  );
  const [minStrength, setMinStrength] = useState(45);
  const [selectedNodeId, setSelectedNodeId] = useState(
    graphData.nodes.find((node) => node.active)?.id ?? graphData.nodes[0]?.id,
  );
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);

  const breadcrumbSegments: BreadcrumbSegment[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: project?.title ?? projectId, href: `/projects/${projectId}` },
    { label: "Knowledge Graph", href: `/projects/${projectId}/graph` },
  ];

  const filteredNodes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return graphData.nodes.filter((node) => {
      const matchesType = activeFilters.includes(node.type);
      const matchesSearch =
        normalizedQuery.length === 0 ||
        node.label.toLowerCase().includes(normalizedQuery) ||
        node.type.toLowerCase().includes(normalizedQuery);

      return matchesType && matchesSearch;
    });
  }, [activeFilters, graphData.nodes, query]);

  const visibleNodeIds = useMemo(
    () => new Set(filteredNodes.map((node) => node.id)),
    [filteredNodes],
  );

  const filteredEdges = useMemo(
    () =>
      graphData.edges.filter((edge) => {
        const strength = edge.strength ?? 100;

        return (
          strength >= minStrength &&
          visibleNodeIds.has(edge.source) &&
          visibleNodeIds.has(edge.target)
        );
      }),
    [graphData.edges, minStrength, visibleNodeIds],
  );

  const selectedEdgeId = selectedEdge
    ? (selectedEdge.id ?? `${selectedEdge.source}-${selectedEdge.target}`)
    : undefined;

  function resetFilters() {
    setQuery("");
    setActiveFilters(graphData.filters.map((filter) => filter.label));
    setMinStrength(45);
    setSelectedEdge(null);
    setSelectedNodeId(
      graphData.nodes.find((node) => node.active)?.id ?? graphData.nodes[0]?.id,
    );
  }

  return (
    <main className="relative min-h-screen overflow-y-auto bg-surface-container-lowest text-on-surface lg:h-screen lg:overflow-hidden">
      <div className="relative z-20 flex flex-col gap-4 p-5 pb-0 sm:p-8 sm:pb-0">
        <Breadcrumbs segments={breadcrumbSegments} />
        <div className="lg:hidden">
          <GraphSearch
            domain={graphData.domain}
            onChange={setQuery}
            resultCount={filteredNodes.length}
            searchId="graph-search-mobile"
            value={query}
          />
        </div>
      </div>
      <GraphCanvas
        edges={filteredEdges}
        nodes={filteredNodes}
        onEdgeSelect={(edge) => {
          setSelectedEdge(edge);
          setSelectedNodeId(edge.source);
        }}
        onNodeSelect={(nodeId) => {
          setSelectedNodeId(nodeId);
          setSelectedEdge(null);
        }}
        selectedEdgeId={selectedEdgeId}
        selectedNodeId={selectedNodeId}
      />
      {filteredNodes.length === 0 ? (
        <div className="pointer-events-none absolute inset-x-5 top-32 z-20 lg:left-1/2 lg:right-auto lg:top-1/2 lg:w-96 lg:-translate-x-1/2 lg:-translate-y-1/2">
          <AnimatedCard
            className="glass-panel rounded-xl p-5"
            interactive={false}
          >
            <EmptyState
              body="Try a broader search term or restore the node type filters."
              icon={FileSearch}
              title="No graph nodes match"
            />
          </AnimatedCard>
        </div>
      ) : null}
      <div className="relative z-20 flex flex-col gap-4 p-5 pt-0 sm:p-8 sm:pt-0 lg:block lg:min-h-screen lg:p-0">
        <div className="hidden lg:block">
          <GraphSearch
            domain={graphData.domain}
            onChange={setQuery}
            resultCount={filteredNodes.length}
            searchId="graph-search-desktop"
            value={query}
          />
        </div>
        <GraphFilters
          activeFilters={activeFilters}
          filters={graphData.filters}
          minStrength={minStrength}
          onReset={resetFilters}
          onStrengthChange={setMinStrength}
          onToggle={(label) =>
            setActiveFilters((current) =>
              current.includes(label)
                ? current.filter((item) => item !== label)
                : [...current, label],
            )
          }
        />
        <NodeInspector selectedNode={graphData.selectedNode} />
        {selectedEdge?.evidence ? (
          <AnimatedCard
            className="glass-panel pointer-events-auto rounded-xl p-5 shadow-ambient lg:absolute lg:bottom-10 lg:left-1/2 lg:w-[360px] lg:-translate-x-1/2"
            interactive={false}
          >
            <p className="mb-2 font-display text-xs font-semibold uppercase tracking-normal text-primary">
              Edge Evidence
            </p>
            <h2 className="font-display text-lg font-semibold text-on-surface">
              {selectedEdge.evidence.title}
            </h2>
            <p className="mt-2 text-sm leading-[1.6] text-on-surface-variant">
              {selectedEdge.evidence.quote}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3 font-mono text-xs text-on-surface-variant">
              <span>{selectedEdge.evidence.source}</span>
              <span>
                {Math.round(selectedEdge.evidence.confidence * 100)}% confidence
              </span>
            </div>
          </AnimatedCard>
        ) : null}
      </div>
    </main>
  );
}
