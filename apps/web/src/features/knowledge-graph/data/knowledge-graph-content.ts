// Purpose: Store mocked knowledge graph explorer data apart from visual components.

export type NodeTypeFilter = {
  label: string;
  count: string;
  tone: "primary" | "tertiary" | "error";
};

export type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
  tone: "primary" | "tertiary" | "error";
  active?: boolean;
};

export type GraphEdge = {
  source: string;
  target: string;
};

export const nodeTypeFilters: NodeTypeFilter[] = [
  { label: "Genes", count: "2,401", tone: "primary" },
  { label: "Proteins", count: "842", tone: "tertiary" },
  { label: "Drugs", count: "124", tone: "error" },
];

export const graphNodes: GraphNode[] = [
  { id: "nppa", label: "NPPA", x: 500, y: 400, radius: 15, tone: "primary", active: true },
  { id: "npr1", label: "NPR1", x: 350, y: 250, radius: 10, tone: "tertiary" },
  { id: "npr2", label: "NPR2", x: 650, y: 250, radius: 10, tone: "tertiary" },
  { id: "drug-x", label: "Drug X", x: 500, y: 600, radius: 12, tone: "error" },
];

export const graphEdges: GraphEdge[] = [
  { source: "nppa", target: "npr1" },
  { source: "nppa", target: "npr2" },
  { source: "nppa", target: "drug-x" },
];

export const selectedNode = {
  type: "Gene",
  symbol: "NPPA",
  name: "Natriuretic Peptide A",
  function:
    "Plays a key role in mediating cardio-renal homeostasis, blood pressure regulation, and sodium excretion.",
  pathways: ["Cardiac Conduction", "GPCR Signaling"],
};
