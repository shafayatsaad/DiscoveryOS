// Purpose: Store domain-specific knowledge graph explorer data apart from visual components.

import { getProjectWorkspace, primaryProjectId, projectRoute } from "@/features/projects/data/project-workspaces";

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

export type SelectedGraphNode = {
  type: string;
  symbol: string;
  name: string;
  function: string;
  pathways: string[];
};

export type GraphData = {
  domain: string;
  researchGoal: string;
  filters: NodeTypeFilter[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNode: SelectedGraphNode;
};

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

const biomedicalGraphData: GraphData = {
  domain: "Biomedical",
  researchGoal: "Find reproducible immune exhaustion biomarkers with evidence preserved by cohort and assay context.",
  filters: [
    { label: "Biomarkers", count: "96", tone: "primary" },
    { label: "Cell States", count: "54", tone: "secondary" },
    { label: "Assays", count: "31", tone: "tertiary" },
    { label: "Contradictions", count: "14", tone: "error" },
  ],
  nodes: [
    { id: "exhaustion", label: "Exhaustion", x: 500, y: 400, radius: 16, tone: "primary", active: true },
    { id: "lag3", label: "LAG3", x: 330, y: 250, radius: 11, tone: "secondary" },
    { id: "tim3", label: "TIM3", x: 670, y: 250, radius: 11, tone: "secondary" },
    { id: "flow", label: "Flow assay", x: 360, y: 585, radius: 12, tone: "tertiary" },
    { id: "assay-conflict", label: "Assay conflict", x: 635, y: 600, radius: 12, tone: "error" },
  ],
  edges: [
    { source: "exhaustion", target: "lag3" },
    { source: "exhaustion", target: "tim3" },
    { source: "exhaustion", target: "flow" },
    { source: "exhaustion", target: "assay-conflict" },
  ],
  selectedNode: {
    type: "Mechanism",
    symbol: "Immune Exhaustion",
    name: "T-cell exhaustion state with reproducible checkpoint-marker evidence",
    function:
      "Represents a candidate mechanism linking immune-state changes to treatment response and progression patterns across cohorts.",
    pathways: ["Checkpoint Signaling", "Cohort Stratification", "Assay Variance"],
  },
};

const climateGraphData: GraphData = {
  domain: "Climate",
  researchGoal: "Generate heat-resilience hypotheses from exposure, remote sensing, and intervention evidence.",
  filters: [
    { label: "Interventions", count: "72", tone: "primary" },
    { label: "Exposure Metrics", count: "48", tone: "secondary" },
    { label: "Data Sources", count: "29", tone: "tertiary" },
    { label: "Evidence Conflicts", count: "12", tone: "error" },
  ],
  nodes: [
    { id: "heat-risk", label: "Heat risk", x: 500, y: 400, radius: 16, tone: "primary", active: true },
    { id: "tree-canopy", label: "Tree canopy", x: 330, y: 250, radius: 11, tone: "primary" },
    { id: "cool-roofs", label: "Cool roofs", x: 670, y: 250, radius: 11, tone: "tertiary" },
    { id: "wearables", label: "Wearables", x: 360, y: 585, radius: 12, tone: "secondary" },
    { id: "satellite-gap", label: "Satellite gap", x: 635, y: 600, radius: 12, tone: "error" },
  ],
  edges: [
    { source: "heat-risk", target: "tree-canopy" },
    { source: "heat-risk", target: "cool-roofs" },
    { source: "heat-risk", target: "wearables" },
    { source: "heat-risk", target: "satellite-gap" },
  ],
  selectedNode: {
    type: "Intervention Cluster",
    symbol: "Heat Risk",
    name: "Urban heat exposure and intervention evidence cluster",
    function:
      "Connects interventions, measurement methods, and contradiction signals used to prioritize heat-resilience experiments.",
    pathways: ["Canopy Expansion", "Cool Roofs", "Exposure Measurement"],
  },
};

export function getGraphData(projectId: string): GraphData {
  const project = getProjectWorkspace(projectId);

  if (project.domain === "Biomedical") {
    return biomedicalGraphData;
  }

  if (project.domain === "Climate") {
    return climateGraphData;
  }

  return {
    domain: graphDomainContext.domain,
    researchGoal: graphDomainContext.researchGoal,
    filters: nodeTypeFilters,
    nodes: graphNodes,
    edges: graphEdges,
    selectedNode,
  };
}
