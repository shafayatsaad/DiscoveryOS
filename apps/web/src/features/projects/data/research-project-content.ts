// Purpose: Store curated research project workspace data apart from UI components.

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Beaker,
  BookOpen,
  BrainCircuit,
  Check,
  Database,
  FileText,
  FlaskConical,
  Gavel,
  Lightbulb,
  Network,
  SlidersHorizontal,
  Settings,
  Sparkles,
  SquareTerminal,
  Target,
} from "lucide-react";

import { getProjectWorkspace, primaryProjectId, projectRoute } from "@/features/projects/data/project-workspaces";

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

export function getProjectNavItems(
  projectId: string,
  activeSection:
    | "project"
    | "graph"
    | "pipeline"
    | "evidence"
    | "ml"
    | "hypotheses"
    | "experiments"
    | "reports"
    | "settings" = "project",
): ProjectNavItem[] {
  return [
    { label: "Projects", icon: FlaskConical, active: activeSection === "project", href: projectRoute(projectId) },
    { label: "Knowledge Graph", icon: Network, active: activeSection === "graph", href: projectRoute(projectId, "graph") },
    { label: "Research Pipeline", icon: SquareTerminal, active: activeSection === "pipeline", href: projectRoute(projectId, "pipeline") },
    { label: "Evidence Explorer", icon: BarChart3, active: activeSection === "evidence", href: projectRoute(projectId, "evidence") },
    { label: "ML Insights", icon: BrainCircuit, active: activeSection === "ml", href: projectRoute(projectId, "ml") },
    { label: "Hypotheses", icon: Lightbulb, active: activeSection === "hypotheses", href: projectRoute(projectId, "hypotheses") },
    { label: "Experiments", icon: Beaker, active: activeSection === "experiments", href: projectRoute(projectId, "experiments") },
    { label: "Reports", icon: FileText, active: activeSection === "reports", href: projectRoute(projectId, "reports") },
    { label: "Settings", icon: SlidersHorizontal, active: activeSection === "settings", href: projectRoute(projectId, "settings") },
  ];
}

export const projectNavItems: ProjectNavItem[] = getProjectNavItems(primaryProjectId);

export function getProjectOverview(projectId: string) {
  const project = getProjectWorkspace(projectId);

  return {
    id: project.displayId,
    status: project.status,
    domain: project.domain,
    phase: project.phase,
    title: project.title,
    progress: project.progress,
    synopsis: project.summary,
    researchGoal: project.researchGoal,
  };
}

export const projectOverview = getProjectOverview(primaryProjectId);

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

export function getTerminalLogs(projectId: string): TerminalLog[] {
  const project = getProjectWorkspace(projectId);

  return [
    { time: "10:42:01", level: "INFO", message: "Initializing project workspace context..." },
    { time: "10:42:05", level: "INFO", message: `Loading ${project.domain} graph embeddings.` },
    { time: "10:42:12", level: "SUCCESS", message: "Embeddings loaded in 6.8s." },
    {
      time: "10:42:15",
      level: "INFO",
      message: `Cross-referencing ${project.title.toLowerCase()} claims with indexed evidence...`,
    },
    {
      time: "10:42:45",
      level: "WARN",
      message: "Contradictory evidence cluster detected. Marking for critic review.",
    },
    {
      time: "10:43:10",
      level: "INFO",
      message: `Training ${project.domain.toLowerCase()} ranking model. Epoch 1/50.`,
    },
    { time: "10:44:20", level: "INFO", message: "Epoch 10/50 - Loss: 0.245 - Accuracy: 88.2%" },
  ];
}

export const terminalLogs: TerminalLog[] = getTerminalLogs(primaryProjectId);

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
  icon: Activity,
};

export const projectUtilityItem: ProjectNavItem = {
  label: "Settings",
  icon: Settings,
  href: projectRoute(primaryProjectId, "settings"),
};
