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
  type: string;
  x: number;
  y: number;
  radius: number;
  tone: GraphTone;
  active?: boolean;
};

export type GraphEdge = {
  id?: string;
  source: string;
  target: string;
  label?: string;
  strength?: number;
  evidence?: {
    title: string;
    source: string;
    quote: string;
    confidence: number;
  };
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
  { id: "peo-litfsi", label: "PEO-LiTFSI", type: "Candidate Materials", x: 500, y: 400, radius: 16, tone: "primary", active: true },
  { id: "ionic-conductivity", label: "Conductivity", type: "Material Properties", x: 330, y: 250, radius: 11, tone: "secondary" },
  { id: "ceramic-filler", label: "LLZO filler", type: "Synthesis Methods", x: 670, y: 250, radius: 11, tone: "tertiary" },
  { id: "thermal-stability", label: "Thermal stability", type: "Material Properties", x: 360, y: 585, radius: 12, tone: "secondary" },
  { id: "dendrite-risk", label: "Dendrite risk", type: "Failure Modes", x: 635, y: 600, radius: 12, tone: "error" },
];

export const graphEdges: GraphEdge[] = [
  {
    source: "peo-litfsi",
    target: "ionic-conductivity",
    label: "transport evidence",
    strength: 86,
    evidence: {
      title: "Polymer electrolyte conductivity screen",
      source: "OpenAlex",
      quote: "Conductivity improved when ceramic fillers were controlled for dispersion quality.",
      confidence: 0.86,
    },
  },
  {
    source: "peo-litfsi",
    target: "ceramic-filler",
    label: "additive route",
    strength: 74,
    evidence: {
      title: "Ceramic-filled solid polymer electrolyte review",
      source: "Crossref",
      quote: "LLZO additions are repeatedly associated with process and interface tradeoffs.",
      confidence: 0.74,
    },
  },
  {
    source: "peo-litfsi",
    target: "thermal-stability",
    label: "stability link",
    strength: 69,
    evidence: {
      title: "Thermal behavior of lithium polymer electrolytes",
      source: "OpenAlex",
      quote: "Thermal stability varied with salt loading and polymer crystallinity.",
      confidence: 0.69,
    },
  },
  {
    source: "peo-litfsi",
    target: "dendrite-risk",
    label: "risk signal",
    strength: 61,
    evidence: {
      title: "Interface failure modes in solid-state lithium cells",
      source: "arXiv",
      quote: "High-current cycling increased interface instability in several polymer systems.",
      confidence: 0.61,
    },
  },
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
    { id: "exhaustion", label: "Exhaustion", type: "Biomarkers", x: 500, y: 400, radius: 16, tone: "primary", active: true },
    { id: "lag3", label: "LAG3", type: "Cell States", x: 330, y: 250, radius: 11, tone: "secondary" },
    { id: "tim3", label: "TIM3", type: "Cell States", x: 670, y: 250, radius: 11, tone: "secondary" },
    { id: "flow", label: "Flow assay", type: "Assays", x: 360, y: 585, radius: 12, tone: "tertiary" },
    { id: "assay-conflict", label: "Assay conflict", type: "Contradictions", x: 635, y: 600, radius: 12, tone: "error" },
  ],
  edges: [
    {
      source: "exhaustion",
      target: "lag3",
      label: "marker association",
      strength: 83,
      evidence: {
        title: "Checkpoint marker evidence across exhausted T cells",
        source: "OpenAlex",
        quote: "LAG3 expression was enriched in exhausted T-cell signatures across cohorts.",
        confidence: 0.83,
      },
    },
    {
      source: "exhaustion",
      target: "tim3",
      label: "marker association",
      strength: 78,
      evidence: {
        title: "Single-cell immune exhaustion atlas",
        source: "PubMed",
        quote: "TIM3 appeared in a recurrent checkpoint-marker panel with assay-dependent signal.",
        confidence: 0.78,
      },
    },
    {
      source: "exhaustion",
      target: "flow",
      label: "assay support",
      strength: 71,
      evidence: {
        title: "Flow cytometry validation of exhaustion signatures",
        source: "Crossref",
        quote: "Matched flow panels preserved marker direction but changed effect size.",
        confidence: 0.71,
      },
    },
    {
      source: "exhaustion",
      target: "assay-conflict",
      label: "contradiction",
      strength: 58,
      evidence: {
        title: "Bulk and spatial immune profiling discordance",
        source: "OpenAlex",
        quote: "Bulk RNA and spatial profiling produced different exhaustion estimates.",
        confidence: 0.58,
      },
    },
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
    { id: "heat-risk", label: "Heat risk", type: "Interventions", x: 500, y: 400, radius: 16, tone: "primary", active: true },
    { id: "tree-canopy", label: "Tree canopy", type: "Interventions", x: 330, y: 250, radius: 11, tone: "primary" },
    { id: "cool-roofs", label: "Cool roofs", type: "Data Sources", x: 670, y: 250, radius: 11, tone: "tertiary" },
    { id: "wearables", label: "Wearables", type: "Exposure Metrics", x: 360, y: 585, radius: 12, tone: "secondary" },
    { id: "satellite-gap", label: "Satellite gap", type: "Evidence Conflicts", x: 635, y: 600, radius: 12, tone: "error" },
  ],
  edges: [
    {
      source: "heat-risk",
      target: "tree-canopy",
      label: "intervention",
      strength: 84,
      evidence: {
        title: "Urban canopy cooling meta-analysis",
        source: "OpenAlex",
        quote: "Canopy interventions reduced modeled pedestrian heat exposure.",
        confidence: 0.84,
      },
    },
    {
      source: "heat-risk",
      target: "cool-roofs",
      label: "built environment",
      strength: 73,
      evidence: {
        title: "Reflective roofing and neighborhood heat",
        source: "Crossref",
        quote: "Cool roof benefits varied by morphology and exposure metric.",
        confidence: 0.73,
      },
    },
    {
      source: "heat-risk",
      target: "wearables",
      label: "exposure metric",
      strength: 66,
      evidence: {
        title: "Wearable sensor heat exposure validation",
        source: "OpenAlex",
        quote: "Wearable measures captured shade benefits missed by surface temperature.",
        confidence: 0.66,
      },
    },
    {
      source: "heat-risk",
      target: "satellite-gap",
      label: "measurement conflict",
      strength: 57,
      evidence: {
        title: "Satellite versus pedestrian heat discordance",
        source: "OpenAlex",
        quote: "Land-surface temperature diverged from human-scale exposure in shaded corridors.",
        confidence: 0.57,
      },
    },
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
