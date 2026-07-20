"use client";

// Purpose: Render the knowledge graph with React Flow interactions and evidence-aware edges.

import {
  Background,
  Controls,
  type Edge as FlowEdge,
  type EdgeMouseHandler,
  type EdgeProps,
  getBezierPath,
  Handle,
  MarkerType,
  type Node as FlowNode,
  type NodeMouseHandler,
  type NodeProps,
  Position,
  ReactFlow,
  type ReactFlowInstance,
} from "@xyflow/react";
import { memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

import {
  type GraphEdge,
  type GraphNode,
  type GraphTone,
} from "@/features/knowledge-graph/data/knowledge-graph-content";
import { cn } from "@/lib/utils";

type GraphNodeData = {
  active?: boolean;
  connected: boolean;
  dimmed: boolean;
  label: string;
  tone: GraphTone;
  type: string;
};

type GraphEdgeData = {
  confidence: number;
  dimmed: boolean;
  evidenceTitle: string;
  label?: string;
};

type GraphFlowNode = FlowNode<GraphNodeData, "graphNode">;
type GraphFlowEdge = FlowEdge<GraphEdgeData, "evidenceEdge">;

const toneClasses: Record<GraphTone, string> = {
  primary: "border-primary/80 bg-primary/20 text-primary shadow-[0_0_26px_rgba(173,198,255,0.2)]",
  secondary: "border-secondary/70 bg-secondary/15 text-secondary",
  tertiary: "border-tertiary/70 bg-tertiary/15 text-tertiary",
  error: "border-red-300/70 bg-red-400/15 text-red-200",
};

const edgeColor = "rgba(173, 198, 255, 0.45)";
const mutedEdgeColor = "rgba(255, 255, 255, 0.14)";

const GraphFlowNodeView = memo(function GraphFlowNodeView({
  data,
  selected,
}: NodeProps<GraphFlowNode>) {
  return (
    <motion.div
      className={cn(
        "relative flex min-h-16 min-w-28 max-w-44 items-center justify-center rounded-lg border px-3 py-2 text-center font-display text-xs font-semibold leading-snug backdrop-blur-xl transition-opacity",
        toneClasses[data.tone],
        selected && "ring-2 ring-primary/70",
        data.connected && !selected && "ring-1 ring-white/20",
        data.dimmed && "opacity-30",
      )}
      animate={data.active ? { scale: [1, 1.025, 1] } : { scale: 1 }}
      transition={{ duration: 3, repeat: data.active ? Infinity : 0, ease: "easeInOut" }}
      whileHover={{ y: -2 }}
    >
      <Handle className="opacity-0" position={Position.Top} type="target" />
      <span>{data.label}</span>
      <span className="absolute -bottom-5 left-1/2 w-max max-w-40 -translate-x-1/2 truncate font-mono text-[10px] text-on-surface-variant/60">
        {data.type}
      </span>
      <Handle className="opacity-0" position={Position.Bottom} type="source" />
    </motion.div>
  );
});

const EvidenceEdge = memo(function EvidenceEdge({
  data,
  id,
  markerEnd,
  selected,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
}: EdgeProps<GraphFlowEdge>) {
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <motion.path
        animate={{ pathLength: 1, opacity: data?.dimmed ? 0.18 : selected ? 0.95 : 0.58 }}
        className="react-flow__edge-path"
        d={path}
        fill="none"
        id={id}
        initial={{ pathLength: 0.86, opacity: 0.32 }}
        markerEnd={markerEnd}
        stroke={selected ? "#adc6ff" : data?.dimmed ? mutedEdgeColor : edgeColor}
        strokeLinecap="round"
        strokeWidth={selected ? 2.8 : 1.7}
        transition={{ duration: 0.55, ease: "easeOut" }}
      />
      {selected || data?.label ? (
        <foreignObject height={30} width={150} x={labelX - 75} y={labelY - 15}>
          <div className="pointer-events-none flex justify-center">
            <span className="rounded-md border border-white/10 bg-surface/90 px-2 py-1 font-mono text-[10px] text-on-surface-variant shadow-ambient">
              {selected ? `${Math.round((data?.confidence ?? 0) * 100)}% evidence` : data?.label}
            </span>
          </div>
        </foreignObject>
      ) : null}
    </>
  );
});

const nodeTypes = { graphNode: GraphFlowNodeView };
const edgeTypes = { evidenceEdge: EvidenceEdge };

export function GraphCanvas({
  edges,
  nodes,
  selectedEdgeId,
  selectedNodeId,
  onEdgeSelect,
  onNodeSelect,
}: {
  edges: GraphEdge[];
  nodes: GraphNode[];
  selectedEdgeId?: string;
  selectedNodeId?: string;
  onEdgeSelect: (edge: GraphEdge) => void;
  onNodeSelect: (nodeId: string) => void;
}) {
  const connectedIds = useMemo(() => {
    if (!selectedNodeId) {
      return new Set<string>();
    }

    return new Set(
      edges
        .filter((edge) => edge.source === selectedNodeId || edge.target === selectedNodeId)
        .flatMap((edge) => [edge.source, edge.target]),
    );
  }, [edges, selectedNodeId]);

  const flowNodes = useMemo<GraphFlowNode[]>(
    () =>
      nodes.map((node) => ({
        id: node.id,
        type: "graphNode",
        position: { x: node.x, y: node.y },
        selected: selectedNodeId === node.id,
        data: {
          active: node.active,
          connected: connectedIds.has(node.id),
          dimmed: Boolean(selectedNodeId && !connectedIds.has(node.id)),
          label: node.label,
          tone: node.tone,
          type: node.type,
        },
      })),
    [connectedIds, nodes, selectedNodeId],
  );

  const visibleNodeIds = useMemo(() => new Set(nodes.map((node) => node.id)), [nodes]);

  const flowEdges = useMemo<GraphFlowEdge[]>(
    () =>
      edges
        .filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
        .map((edge) => {
          const id = edge.id ?? `${edge.source}-${edge.target}`;
          const connected =
            !selectedNodeId || edge.source === selectedNodeId || edge.target === selectedNodeId;

          return {
            id,
            type: "evidenceEdge",
            source: edge.source,
            target: edge.target,
            selected: selectedEdgeId === id,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: selectedEdgeId === id ? "#adc6ff" : edgeColor,
              width: 16,
              height: 16,
            },
            data: {
              confidence: edge.evidence?.confidence ?? 0,
              dimmed: !connected,
              evidenceTitle: edge.evidence?.title ?? "Evidence",
              label: edge.label,
            },
          };
        }),
    [edges, selectedEdgeId, selectedNodeId, visibleNodeIds],
  );

  const handleInit = useCallback((instance: ReactFlowInstance<GraphFlowNode, GraphFlowEdge>) => {
    window.requestAnimationFrame(() => instance.fitView({ padding: 0.22, duration: 500 }));
  }, []);

  const handleEdgeClick = useCallback<EdgeMouseHandler<GraphFlowEdge>>(
    (_, edge) => {
      const sourceEdge = edges.find(
        (candidate) => (candidate.id ?? `${candidate.source}-${candidate.target}`) === edge.id,
      );
      if (sourceEdge) {
        onEdgeSelect(sourceEdge);
      }
    },
    [edges, onEdgeSelect],
  );

  const handleNodeClick = useCallback<NodeMouseHandler<GraphFlowNode>>(
    (_, node) => onNodeSelect(node.id),
    [onNodeSelect],
  );

  return (
    <div
      className="relative z-0 h-[430px] overflow-hidden bg-[radial-gradient(circle_at_center,#181c21_0%,#0a0e13_100%)] lg:absolute lg:inset-0 lg:h-auto"
      aria-label="Knowledge graph visualization"
    >
      <ReactFlow
        colorMode="dark"
        edgeTypes={edgeTypes}
        edges={flowEdges}
        fitView
        maxZoom={1.9}
        minZoom={0.18}
        nodes={flowNodes}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        onEdgeClick={handleEdgeClick}
        onInit={handleInit}
        onNodeClick={handleNodeClick}
        onlyRenderVisibleElements
        panOnScroll
        proOptions={{ hideAttribution: true }}
      >
        <Background color="rgba(255,255,255,0.08)" gap={28} />
        <Controls className="!border-white/10 !bg-surface/80 !shadow-ambient" showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
