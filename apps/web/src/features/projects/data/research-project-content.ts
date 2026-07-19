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

import { primaryProjectId, projectRoute, workspaceProjects } from "@/features/projects/data/project-workspaces";

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
  { label: "Projects", icon: FlaskConical, active: true, href: projectRoute(primaryProjectId) },
  { label: "Knowledge Graph", icon: Network, href: projectRoute(primaryProjectId, "graph") },
  { label: "Research Pipeline", icon: SquareTerminal, href: projectRoute(primaryProjectId, "pipeline") },
  { label: "Evidence Explorer", icon: BarChart3, href: projectRoute(primaryProjectId, "evidence") },
  { label: "Experiments", icon: Beaker },
  { label: "Reports", icon: FileText },
];

const activeProject = workspaceProjects[0];

export const projectOverview = {
  id: activeProject.displayId,
  status: activeProject.status,
  domain: activeProject.domain,
  phase: activeProject.phase,
  title: activeProject.title,
  progress: activeProject.progress,
  synopsis: activeProject.summary,
  researchGoal: activeProject.researchGoal,
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
  { time: "10:42:01", level: "INFO", message: "Initializing project workspace context..." },
  { time: "10:42:05", level: "INFO", message: "Loading Materials Science graph embeddings (2.8M nodes)." },
  { time: "10:42:12", level: "SUCCESS", message: "Embeddings loaded in 6.8s." },
  {
    time: "10:42:15",
    level: "INFO",
    message: "Cross-referencing polymer electrolyte candidates with literature evidence...",
  },
  {
    time: "10:42:45",
    level: "WARN",
    message:
      "Contradictory conductivity claims detected for ceramic-filled blends. Marking for critic review.",
  },
  {
    time: "10:43:10",
    level: "INFO",
    message: "Training structure-property ranking model. Epoch 1/50.",
  },
  { time: "10:44:20", level: "INFO", message: "Epoch 10/50 - Loss: 0.245 - Accuracy: 88.2%" },
];

export const projectMetrics: MetricCard[] = [
  { label: "Evidence Items", value: "1.2k", icon: Database },
  { label: "Papers Indexed", value: "1,237", icon: BookOpen },
  { label: "Confidence", value: "89%", icon: Target, emphasized: true },
];

export const synopsisScores: SynopsisScore[] = [
  { label: "Novelty Score", value: "High (92%)", progress: 92, tone: "success" },
  { label: "Evidence Strength", value: "Robust", progress: 85, tone: "primary" },
];

export const researchHealth = {
  label: "Workspace Health",
  value: "Stable",
  icon: HeartPulse,
};

export const projectUtilityItem: ProjectNavItem = {
  label: "Settings",
  icon: Settings,
};
