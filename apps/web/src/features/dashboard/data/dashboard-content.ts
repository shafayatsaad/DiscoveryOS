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

export type NavItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  href?: string;
};

export type ResearchProject = {
  title: string;
  description: string;
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
  { label: "Knowledge Graph", icon: Network, href: "/projects/heart-failure-biomarkers/graph" },
  { label: "Research Jobs", icon: SquareTerminal },
  { label: "Evidence Explorer", icon: BarChart3, href: "/projects/heart-failure-biomarkers/evidence" },
  { label: "Experiments", icon: Beaker },
  { label: "Reports", icon: FileText },
];

export const utilityNavItems: NavItem[] = [{ label: "Settings", icon: Settings }];

export const researchProjects: ResearchProject[] = [
  {
    title: "Heart Failure Models",
    description: "Cardiovascular genomic dataset cross-reference.",
    progress: 72,
  },
  {
    title: "Alzheimer's Pathways",
    description: "Neuro-degenerative protein marker analysis.",
    progress: 30,
  },
  {
    title: "Lung Cancer Biomarkers",
    description: "Phase III trial data correlation.",
    progress: 100,
    status: "completed",
  },
];

export const insightStream: Insight[] = [
  {
    time: "Just Now",
    tag: "#Heart-Failure",
    body: "Novel correlation identified between Gene X22 and reduced left ventricular ejection fraction in dataset subset B.",
    primary: true,
    action: "View Data",
  },
  {
    time: "2 hrs ago",
    tag: "System",
    body: "Data ingestion complete: 4.2TB of new clinical trial records indexed and added to Knowledge Graph.",
  },
  {
    time: "5 hrs ago",
    tag: "#Alzheimers",
    body: "Anomaly detected in control group protein markers. Flagged for manual review by lead researcher.",
  },
];

export const activeProcesses: ProcessJob[] = [
  {
    name: "SeqAlign-v4.2",
    role: "Retriever",
    roleTone: "primary",
    icon: Database,
    progress: 85,
    state: "Fetching literature",
    eta: "Est. 2m",
  },
  {
    name: "Hypothesis-Gen-HF",
    role: "Planner",
    roleTone: "secondary",
    icon: BrainCircuit,
    progress: 45,
    state: "Structuring logic tree",
    eta: "Est. 15m",
  },
  {
    name: "Graph-Update-Nightly",
    role: "Queued",
    roleTone: "muted",
    icon: GitBranch,
    progress: 0,
    state: "Waiting for resources",
    eta: "--",
  },
];

export const quickActions = [
  { label: "Start Discovery", icon: FolderOpen },
  { label: "Upload Data", icon: Database },
  { label: "Export Report", icon: FileText },
];
