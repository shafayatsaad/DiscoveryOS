// Purpose: Store domain-specific knowledge graph explorer data apart from visual components.

import { primaryProjectId, projectRoute } from "@/features/projects/data/project-workspaces";

export type NodeTypeFilter = {
  label: string;
  count: string;
  tone: GraphTone;
};

export type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
  tone: GraphTone;
  active?: boolean;
};

export type GraphEdge = {
  source: string;
  target: string;
};

export type GraphTone = "primary" | "secondary" | "tertiary" | "error";

export const graphWorkspaceNav = [
  { label: "Projects", href: projectRoute(primaryProjectId) },
  { label: "Knowledge Graph", href: projectRoute(primaryProjectId, "graph"), active: true },
  { label: "Research Pipeline", href: projectRoute(primaryProjectId, "pipeline") },
  { label: "Evidence Explorer", href: projectRoute(primaryProjectId, "evidence") },
];

export const graphDomainContext = {
  domain: "Materials Science",
  researchGoal: "Identify polymer electrolyte candidates with strong conductivity and manufacturable synthesis routes.",
};

export const nodeTypeFilters: NodeTypeFilter[] = [
  { label: "Candidate Materials", count: "184", tone: "primary" },
  { label: "Material Properties", count: "67", tone: "secondary" },
  { label: "Synthesis Methods", count: "41", tone: "tertiary" },
  { label: "Failure Modes", count: "19", tone: "error" },
];

export const graphNodes: GraphNode[] = [
  { id: "peo-litfsi", label: "PEO-LiTFSI", x: 500, y: 400, radius: 16, tone: "primary", active: true },
  { id: "ionic-conductivity", label: "Conductivity", x: 330, y: 250, radius: 11, tone: "secondary" },
  { id: "ceramic-filler", label: "LLZO filler", x: 670, y: 250, radius: 11, tone: "tertiary" },
  { id: "thermal-stability", label: "Thermal stability", x: 360, y: 585, radius: 12, tone: "secondary" },
  { id: "dendrite-risk", label: "Dendrite risk", x: 635, y: 600, radius: 12, tone: "error" },
];

export const graphEdges: GraphEdge[] = [
  { source: "peo-litfsi", target: "ionic-conductivity" },
  { source: "peo-litfsi", target: "ceramic-filler" },
  { source: "peo-litfsi", target: "thermal-stability" },
  { source: "peo-litfsi", target: "dendrite-risk" },
];

export const selectedNode = {
  type: "Candidate Material",
  symbol: "PEO-LiTFSI",
  name: "Polyethylene oxide blended with lithium bis(trifluoromethanesulfonyl)imide",
  function:
    "A polymer electrolyte system with broad evidence for lithium-ion transport, improved processability, and sensitivity to filler composition and operating temperature.",
  pathways: ["Ion Transport", "Thermal Stability", "Solid-State Battery Interfaces"],
};
