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

import { primaryProjectId, projectRoute } from "@/features/projects/data/project-workspaces";

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

export const evidenceNavItems: EvidenceNavItem[] = [
  { label: "Projects", icon: FlaskConical, href: projectRoute(primaryProjectId) },
  { label: "Knowledge Graph", icon: Network, href: projectRoute(primaryProjectId, "graph") },
  { label: "Research Pipeline", icon: SquareTerminal, href: projectRoute(primaryProjectId, "pipeline") },
  { label: "Evidence Explorer", icon: BarChart3, href: projectRoute(primaryProjectId, "evidence"), active: true },
  { label: "Experiments", icon: Beaker },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings },
];

export const evidenceFilters = ["Conductivity", "Thermal", "Synthesis", "Interfaces"];

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
