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
  claimType: "Efficacy" | "Resistance" | "Biomarker";
  confidence: number;
  citation: string;
  doi: string;
  entities: string[];
  trace: string[];
};

export const evidenceNavItems: EvidenceNavItem[] = [
  { label: "Projects", icon: FlaskConical, href: "/projects/heart-failure-biomarkers" },
  { label: "Knowledge Graph", icon: Network, href: "/projects/heart-failure-biomarkers/graph" },
  { label: "Research Jobs", icon: SquareTerminal, href: "/projects/heart-failure-biomarkers/workflow" },
  { label: "Evidence Explorer", icon: BarChart3, href: "/projects/heart-failure-biomarkers/evidence", active: true },
  { label: "Experiments", icon: Beaker },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings },
];

export const evidenceFilters = ["Genomics", "Clinical", "Proteomics", "In Vivo"];

export const evidenceActions = {
  export: Download,
  verified: Verified,
  entity: Tag,
  paper: BookOpen,
  data: Database,
};

export const evidenceRecords: EvidenceRecord[] = [
  {
    title: "Targeting TP53 mutations in aggressive lung adenocarcinoma models",
    snippet:
      "In vivo administration of the compound resulted in a 45% reduction of tumor volume in PDX models expressing the R175H TP53 mutation, suggesting high specificity...",
    contextBefore:
      "Previous attempts to drug this specific conformation have failed due to off-target toxicities. Here,",
    highlight:
      "in vivo administration of the compound resulted in a 45% reduction of tumor volume in PDX models expressing the R175H TP53 mutation",
    contextAfter:
      "suggesting high specificity and offering a potential therapeutic window for follow-up validation.",
    claimType: "Efficacy",
    confidence: 94,
    citation: "Chen et al., Nat Med (2023)",
    doi: "10.1038/s41591",
    entities: ["TP53 R175H", "PDX Model"],
    trace: ["NLP Extraction", "Cross-ref (3 papers)"],
  },
  {
    title: "CRISPR-Cas9 screens identify novel resistance mechanisms to BRAF inhibitors",
    snippet:
      "Loss of NF1 was consistently enriched in resistant populations across three independent melanoma cell lines treated with vemurafenib.",
    contextBefore:
      "To systematically map the landscape of acquired resistance, we performed genome-wide pooled CRISPR screens.",
    highlight:
      "Loss of NF1 was consistently enriched in resistant populations across three independent melanoma cell lines treated with vemurafenib.",
    contextAfter:
      "This indicates a robust bypass mechanism restoring MAPK signaling despite upstream blockade.",
    claimType: "Resistance",
    confidence: 88,
    citation: "Smith & Doe, Cell (2022)",
    doi: "10.1016/j.cell",
    entities: ["NF1", "BRAF", "Vemurafenib"],
    trace: ["CRISPR Screen", "Cross-ref (5 papers)"],
  },
  {
    title: "Longitudinal single-cell transcriptomics of tumor microenvironment",
    snippet:
      "We observed a distinct expansion of CD8+ exhausted T-cells expressing high levels of LAG3 and TIM3 at the time of clinical progression.",
    contextBefore:
      "Serial biopsies were collected across response and relapse intervals in matched patient cohorts.",
    highlight:
      "a distinct expansion of CD8+ exhausted T-cells expressing high levels of LAG3 and TIM3",
    contextAfter:
      "was observed at clinical progression, supporting immune exhaustion as a candidate biomarker.",
    claimType: "Biomarker",
    confidence: 91,
    citation: "Patel et al., Sci Immunol (2024)",
    doi: "10.1126/sciim",
    entities: ["CD8+ T-cells", "LAG3", "TIM3"],
    trace: ["Single-cell Extraction", "Graph Entity Match"],
  },
];
