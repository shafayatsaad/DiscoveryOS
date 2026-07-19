// Purpose: Store mocked evidence explorer data separately from UI components.

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Beaker,
  BookOpen,
  Database,
  Download,
  FileText,
  FlaskConical,
  Network,
  Settings,
  SquareTerminal,
  Tag,
  Verified,
} from "lucide-react";

import { getProjectWorkspace, primaryProjectId, projectRoute } from "@/features/projects/data/project-workspaces";

export type EvidenceNavItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  active?: boolean;
};

export type EvidenceRecord = {
  title: string;
  snippet: string;
  contextBefore: string;
  highlight: string;
  contextAfter: string;
  claimType: "Performance" | "Mechanism" | "Constraint";
  confidence: number;
  citation: string;
  doi: string;
  entities: string[];
  trace: string[];
};

export function getEvidenceNavItems(projectId: string): EvidenceNavItem[] {
  return [
    { label: "Projects", icon: FlaskConical, href: projectRoute(projectId) },
    { label: "Knowledge Graph", icon: Network, href: projectRoute(projectId, "graph") },
    { label: "Research Pipeline", icon: SquareTerminal, href: projectRoute(projectId, "pipeline") },
    { label: "Evidence Explorer", icon: BarChart3, href: projectRoute(projectId, "evidence"), active: true },
    { label: "Experiments", icon: Beaker, href: projectRoute(projectId, "experiments") },
    { label: "Reports", icon: FileText, href: projectRoute(projectId, "reports") },
    { label: "Settings", icon: Settings, href: projectRoute(projectId, "settings") },
  ];
}

export const evidenceNavItems: EvidenceNavItem[] = getEvidenceNavItems(primaryProjectId);

export const evidenceFilters = ["Conductivity", "Thermal", "Synthesis", "Interfaces"];

export function getEvidenceFilters(projectId: string) {
  const project = getProjectWorkspace(projectId);

  if (project.domain === "Biomedical") {
    return ["Mechanism", "Cohorts", "Inflammation", "Biomarkers"];
  }

  if (project.domain === "Climate") {
    return ["Exposure", "Remote Sensing", "Policy", "Infrastructure"];
  }

  return evidenceFilters;
}

export const evidenceActions = {
  export: Download,
  verified: Verified,
  entity: Tag,
  paper: BookOpen,
  data: Database,
};

export const evidenceRecords: EvidenceRecord[] = [
  {
    title: "Ceramic-filled PEO electrolytes improve room-temperature ion transport",
    snippet:
      "Adding nanoscale LLZO fillers increased lithium-ion conductivity by 38% while preserving processability under solvent-cast fabrication conditions...",
    contextBefore:
      "Baseline PEO-LiTFSI films showed limited room-temperature conductivity. After filler dispersion,",
    highlight:
      "adding nanoscale LLZO fillers increased lithium-ion conductivity by 38%",
    contextAfter:
      "while preserving processability under solvent-cast fabrication conditions.",
    claimType: "Performance",
    confidence: 94,
    citation: "Park et al., Adv Energy Mater (2024)",
    doi: "10.1002/aenm",
    entities: ["PEO-LiTFSI", "LLZO", "Ion Conductivity"],
    trace: ["Claim Extraction", "Cross-ref (7 papers)"],
  },
  {
    title: "Interfacial instability emerges under high-current cycling",
    snippet:
      "Cells cycled above 1.5 mA cm-2 showed rapid impedance growth and dendrite-associated shorting after fewer than 80 cycles.",
    contextBefore:
      "Long-duration cycling experiments were conducted at increasing current densities.",
    highlight:
      "rapid impedance growth and dendrite-associated shorting after fewer than 80 cycles",
    contextAfter:
      "suggesting that candidate ranking must include interfacial failure risk.",
    claimType: "Constraint",
    confidence: 88,
    citation: "Singh & Rao, Joule (2023)",
    doi: "10.1016/j.joule",
    entities: ["Dendrite Risk", "Current Density", "Impedance"],
    trace: ["Table Extraction", "Contradiction Check"],
  },
  {
    title: "Ionic liquid additives disrupt crystallinity and improve transport",
    snippet:
      "Small fractions of pyrrolidinium-based ionic liquid reduced polymer crystallinity and created additional amorphous conduction pathways.",
    contextBefore:
      "Differential scanning calorimetry and impedance spectroscopy were compared across additive concentrations.",
    highlight:
      "reduced polymer crystallinity and created additional amorphous conduction pathways",
    contextAfter:
      "supporting a mechanism for the observed conductivity gains.",
    claimType: "Mechanism",
    confidence: 91,
    citation: "Mori et al., ACS Energy Lett (2024)",
    doi: "10.1021/acsenergylett",
    entities: ["Ionic Liquid", "Crystallinity", "Amorphous Phase"],
    trace: ["Figure Extraction", "Graph Entity Match"],
  },
];

const biomedicalEvidenceRecords: EvidenceRecord[] = [
  {
    title: "Single-cell profiles reveal exhausted immune states during progression",
    snippet:
      "Expanded exhausted T-cell states showed consistent LAG3 and TIM3 expression across responder and non-responder cohorts.",
    contextBefore: "Across longitudinal biopsies, investigators observed immune-state shifts before clinical progression.",
    highlight: "consistent LAG3 and TIM3 expression across responder and non-responder cohorts",
    contextAfter: "suggesting a reproducible exhaustion signal suitable for downstream hypothesis review.",
    claimType: "Mechanism",
    confidence: 91,
    citation: "Patel et al., Sci Immunol (2024)",
    doi: "10.1126/sciimmunol",
    entities: ["LAG3", "TIM3", "Exhausted T-cells"],
    trace: ["Single-cell Extraction", "Graph Entity Match"],
  },
  {
    title: "Checkpoint-associated markers vary by assay and disease context",
    snippet:
      "Reported exhaustion markers diverged when bulk RNA, flow cytometry, and spatial profiling were compared across studies.",
    contextBefore: "The review compared marker reproducibility across measurement techniques.",
    highlight: "reported exhaustion markers diverged when bulk RNA, flow cytometry, and spatial profiling were compared",
    contextAfter: "indicating that claim verification must preserve assay context.",
    claimType: "Constraint",
    confidence: 86,
    citation: "Morales et al., Nat Biotechnol (2023)",
    doi: "10.1038/s41587",
    entities: ["Assay Context", "Flow Cytometry", "Spatial Profiling"],
    trace: ["Claim Verification", "Contradiction Check"],
  },
  {
    title: "Cross-cohort immune exhaustion signature predicts therapy response",
    snippet:
      "A compact immune exhaustion signature improved response stratification in three independent validation cohorts.",
    contextBefore: "After feature selection, the authors evaluated a compact marker panel.",
    highlight: "improved response stratification in three independent validation cohorts",
    contextAfter: "supporting the signature as a candidate evidence-backed hypothesis.",
    claimType: "Performance",
    confidence: 89,
    citation: "Nguyen et al., Cell Syst (2024)",
    doi: "10.1016/j.cels",
    entities: ["Immune Signature", "Validation Cohorts", "Response Stratification"],
    trace: ["Evidence Ranking", "Cross-ref (4 papers)"],
  },
];

const climateEvidenceRecords: EvidenceRecord[] = [
  {
    title: "Tree canopy interventions reduce modeled pedestrian heat exposure",
    snippet:
      "Neighborhood-scale simulations showed that targeted canopy expansion reduced peak pedestrian heat exposure by 12-18%.",
    contextBefore: "Urban morphology and observed land-surface temperature were fused into a simulation model.",
    highlight: "targeted canopy expansion reduced peak pedestrian heat exposure by 12-18%",
    contextAfter: "with strongest effects in high-density blocks with limited shade.",
    claimType: "Performance",
    confidence: 90,
    citation: "Rahman et al., Urban Clim (2024)",
    doi: "10.1016/j.uclim",
    entities: ["Tree Canopy", "Heat Exposure", "Urban Morphology"],
    trace: ["Remote-sensing Extraction", "Model Evidence"],
  },
  {
    title: "Satellite surface temperature can overstate human exposure in shaded corridors",
    snippet:
      "Satellite-derived surface temperature diverged from wearable exposure measurements in shaded corridors and transit-adjacent streets.",
    contextBefore: "The study paired mobile sensors with satellite observations across summer heat events.",
    highlight: "surface temperature diverged from wearable exposure measurements",
    contextAfter: "creating a contradiction cluster for exposure modeling.",
    claimType: "Constraint",
    confidence: 87,
    citation: "Okafor et al., Environ Res Lett (2023)",
    doi: "10.1088/1748",
    entities: ["Surface Temperature", "Wearable Sensors", "Shade"],
    trace: ["Contradiction Detection", "Source Triangulation"],
  },
  {
    title: "Cool roofs and shade networks produce complementary benefits",
    snippet:
      "Modeled interventions suggest cool roofs lower building heat load while shade networks more directly reduce outdoor exposure.",
    contextBefore: "Intervention portfolios were evaluated under multiple warming scenarios.",
    highlight: "cool roofs lower building heat load while shade networks more directly reduce outdoor exposure",
    contextAfter: "supporting combined intervention hypotheses.",
    claimType: "Mechanism",
    confidence: 85,
    citation: "Ito et al., Nat Cities (2025)",
    doi: "10.1038/s44284",
    entities: ["Cool Roofs", "Shade Networks", "Outdoor Exposure"],
    trace: ["Mechanism Extraction", "Policy Evidence"],
  },
];

export function getEvidenceRecords(projectId: string): EvidenceRecord[] {
  const project = getProjectWorkspace(projectId);

  if (project.domain === "Biomedical") {
    return biomedicalEvidenceRecords;
  }

  if (project.domain === "Climate") {
    return climateEvidenceRecords;
  }

  return evidenceRecords;
}
