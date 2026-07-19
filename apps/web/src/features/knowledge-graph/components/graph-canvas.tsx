// Purpose: Render a mock SVG knowledge graph canvas with animated nodes and edges.

import {
  graphEdges,
  graphNodes,
  type GraphNode,
} from "@/features/knowledge-graph/data/knowledge-graph-content";

const glowIdByTone: Record<GraphNode["tone"], string> = {
  primary: "node-glow-primary",
  tertiary: "node-glow-tertiary",
  error: "node-glow-error",
};

const fillByTone: Record<GraphNode["tone"], string> = {
  primary: "#adc6ff",
  tertiary: "#bec7db",
  error: "#ffb4ab",
};

export function GraphCanvas() {
  const nodesById = Object.fromEntries(graphNodes.map((node) => [node.id, node]));

  return (
    <div
      className="absolute inset-0 z-0 cursor-move bg-[radial-gradient(circle_at_center,#181c21_0%,#0a0e13_100%)]"
      aria-label="Knowledge graph visualization"
      role="img"
    >
      <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 800">
        <defs>
          <radialGradient cx="50%" cy="50%" id="node-glow-primary" r="50%">
            <stop offset="0%" stopColor="#adc6ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#adc6ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient cx="50%" cy="50%" id="node-glow-tertiary" r="50%">
            <stop offset="0%" stopColor="#bec7db" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#bec7db" stopOpacity="0" />
          </radialGradient>
          <radialGradient cx="50%" cy="50%" id="node-glow-error" r="50%">
            <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g stroke="rgba(255,255,255,0.18)" strokeWidth="1.5">
          {graphEdges.map((edge) => {
            const source = nodesById[edge.source];
            const target = nodesById[edge.target];

            return (
              <line
                key={`${edge.source}-${edge.target}`}
                className="connection-line"
                x1={source.x}
                x2={target.x}
                y1={source.y}
                y2={target.y}
              />
            );
          })}
        </g>

        <g className="cursor-pointer">
          {graphNodes.map((node) => (
            <g
              key={node.id}
              className="transition-opacity duration-300 hover:opacity-90"
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              transform={`translate(${node.x}, ${node.y})`}
            >
              <circle fill={`url(#${glowIdByTone[node.tone]})`} r={node.active ? 45 : node.radius + 22}>
                {node.active ? (
                  <>
                    <animate attributeName="r" dur="3s" repeatCount="indefinite" values="38;50;38" />
                    <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="1;0.72;1" />
                  </>
                ) : null}
              </circle>
              <circle fill={fillByTone[node.tone]} r={node.radius}>
                {node.active ? (
                  <animate attributeName="r" dur="3s" repeatCount="indefinite" values="15;17;15" />
                ) : null}
              </circle>
              <text
                className="font-mono text-sm drop-shadow-md"
                fill="#e0e2ea"
                textAnchor="middle"
                y={node.active ? 38 : 30}
              >
                {node.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
