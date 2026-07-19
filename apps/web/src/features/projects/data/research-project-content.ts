// Purpose: Store mocked research project workspace data apart from UI components.

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Beaker,
  BookOpen,
  BrainCircuit,
  Check,
  Database,
  FileText,
  FlaskConical,
  Gavel,
  HeartPulse,
  Lightbulb,
  Network,
  Settings,
  Sparkles,
  SquareTerminal,
  Target,
} from "lucide-react";

export type ProjectNavItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  href?: string;
};

export type PipelineStage = {
  label: string;
  icon: LucideIcon;
  state: "complete" | "active" | "pending";
};

export type TerminalLog = {
  time: string;
  level: "INFO" | "SUCCESS" | "WARN";
  message: string;
};

export type MetricCard = {
  label: string;
  value: string;
  icon: LucideIcon;
  emphasized?: boolean;
};

export type SynopsisScore = {
  label: string;
  value: string;
  progress: number;
  tone: "success" | "primary";
};

export const projectNavItems: ProjectNavItem[] = [
  { label: "Projects", icon: FlaskConical, active: true, href: "/projects/heart-failure-biomarkers" },
  { label: "Knowledge Graph", icon: Network, href: "/projects/heart-failure-biomarkers/graph" },
  { label: "Research Jobs", icon: SquareTerminal },
  { label: "Evidence Explorer", icon: BarChart3, href: "/projects/heart-failure-biomarkers/evidence" },
  { label: "Experiments", icon: Beaker },
  { label: "Reports", icon: FileText },
];

export const projectOverview = {
  id: "RES-492-BHF",
  status: "Running",
  title: "Biomarkers for Heart Failure",
  progress: 72,
  synopsis:
    "Investigating novel protein biomarkers for early-stage heart failure detection. Currently applying machine learning models across 450 cross-referenced papers to identify anomaly patterns in patient proteomics data prior to structural heart damage.",
};

export const pipelineStages: PipelineStage[] = [
  { label: "Planner", icon: Check, state: "complete" },
  { label: "Retriever", icon: Check, state: "complete" },
  { label: "Evidence", icon: Check, state: "complete" },
  { label: "Graph", icon: Check, state: "complete" },
  { label: "ML", icon: BrainCircuit, state: "active" },
  { label: "Hypothesis", icon: Lightbulb, state: "pending" },
  { label: "Critic", icon: Gavel, state: "pending" },
  { label: "Novelty", icon: Sparkles, state: "pending" },
  { label: "Experiment", icon: FlaskConical, state: "pending" },
  { label: "Report", icon: FileText, state: "pending" },
];

export const terminalLogs: TerminalLog[] = [
  { time: "10:42:01", level: "INFO", message: "Initializing ML model training context..." },
  { time: "10:42:05", level: "INFO", message: "Loading Knowledge Graph embeddings (12.4M nodes)." },
  { time: "10:42:12", level: "SUCCESS", message: "Embeddings loaded in 6.8s." },
  {
    time: "10:42:15",
    level: "INFO",
    message: "Cross-referencing novel biomarker candidates with existing literature...",
  },
  {
    time: "10:42:45",
    level: "WARN",
    message:
      "Candidate 'B-type natriuretic peptide (BNP)' variant analysis yielding high variance. Adjusting threshold.",
  },
  {
    time: "10:43:10",
    level: "INFO",
    message: "Training predictive heart failure trajectory model. Epoch 1/50.",
  },
  { time: "10:44:20", level: "INFO", message: "Epoch 10/50 - Loss: 0.245 - Accuracy: 88.2%" },
];

export const projectMetrics: MetricCard[] = [
  { label: "Evidence Count", value: "1.2k", icon: Database },
  { label: "Paper Count", value: "450", icon: BookOpen },
  { label: "Confidence Score", value: "89%", icon: Target, emphasized: true },
];

export const synopsisScores: SynopsisScore[] = [
  { label: "Novelty Score", value: "High (92%)", progress: 92, tone: "success" },
  { label: "Evidence Strength", value: "Robust", progress: 85, tone: "primary" },
];

export const researchHealth = {
  label: "Research Health",
  value: "Optimal",
  icon: HeartPulse,
};

export const projectUtilityItem: ProjectNavItem = {
  label: "Settings",
  icon: Settings,
};
