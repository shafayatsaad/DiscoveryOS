// Purpose: Store mocked dashboard data separately from presentation components.

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Beaker,
  BrainCircuit,
  Database,
  FileText,
  FlaskConical,
  FolderOpen,
  GitBranch,
  Network,
  Settings,
  SquareTerminal,
} from "lucide-react";

import { primaryProjectId, projectRoute, workspaceProjects } from "@/features/projects/data/project-workspaces";

export type NavItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  href?: string;
};

export type ResearchProject = {
  id: string;
  title: string;
  domain: string;
  description: string;
  phase: string;
  progress: number;
  status?: "completed";
};

export type Insight = {
  time: string;
  tag: string;
  body: string;
  primary?: boolean;
  action?: string;
};

export type ProcessJob = {
  name: string;
  role: string;
  roleTone: "primary" | "secondary" | "muted";
  icon: LucideIcon;
  progress: number;
  state: string;
  eta: string;
};

export const navItems: NavItem[] = [
  { label: "Projects", icon: FlaskConical, active: true, href: "/dashboard" },
  { label: "Knowledge Graph", icon: Network, href: projectRoute(primaryProjectId, "graph") },
  { label: "Research Pipeline", icon: SquareTerminal, href: projectRoute(primaryProjectId, "pipeline") },
  { label: "Evidence Explorer", icon: BarChart3, href: projectRoute(primaryProjectId, "evidence") },
  { label: "Experiments", icon: Beaker },
  { label: "Reports", icon: FileText },
];

export const utilityNavItems: NavItem[] = [{ label: "Settings", icon: Settings }];

export const researchProjects: ResearchProject[] = workspaceProjects.map((project) => ({
  id: project.id,
  title: project.title,
  domain: project.domain,
  description: project.summary,
  phase: project.phase,
  progress: project.progress,
  status: project.status === "Completed" ? "completed" : undefined,
}));

export const insightStream: Insight[] = [
  {
    time: "Just Now",
    tag: "#Materials-Science",
    body: "New conductivity-stability tradeoff surfaced across polymer electrolyte studies using ceramic filler blends.",
    primary: true,
    action: "Open Evidence",
  },
  {
    time: "2 hrs ago",
    tag: "System",
    body: "Cross-domain ingestion complete: 1,237 papers indexed with citations, entities, methods, and extracted claims.",
  },
  {
    time: "5 hrs ago",
    tag: "#Climate",
    body: "Contradiction cluster detected between satellite-derived surface temperature and local exposure studies.",
  },
];

export const activeProcesses: ProcessJob[] = [
  {
    name: "OpenAlex-Retriever",
    role: "Retriever",
    roleTone: "primary",
    icon: Database,
    progress: 74,
    state: "Downloading 1,237 papers",
    eta: "Live",
  },
  {
    name: "Evidence-Synthesizer",
    role: "Extractor",
    roleTone: "secondary",
    icon: BrainCircuit,
    progress: 52,
    state: "Extracting claims",
    eta: "Running",
  },
  {
    name: "Novelty-Scorer",
    role: "Queued",
    roleTone: "muted",
    icon: GitBranch,
    progress: 0,
    state: "Waiting for evidence pass",
    eta: "Queued",
  },
];

export const quickActions = [
  { label: "Start Discovery", icon: FolderOpen },
  { label: "Upload Data", icon: Database },
  { label: "Export Report", icon: FileText },
];
