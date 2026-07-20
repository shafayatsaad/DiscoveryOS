// Purpose: Store dashboard navigation, project summaries, and presentation defaults.

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
  TerminalSquare,
} from "lucide-react";

import {
  primaryProjectId,
  projectRoute,
  workspaceProjects,
} from "@/features/projects/data/project-workspaces";

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
  href: string;
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

export type MagicPipelineStep = {
  label: string;
  detail: string;
};

export const navItems: NavItem[] = [
  { label: "Projects", icon: FlaskConical, active: true, href: "/dashboard" },
  { label: "Knowledge Graph", icon: Network, href: projectRoute(primaryProjectId, "graph") },
  { label: "Research Pipeline", icon: SquareTerminal, href: projectRoute(primaryProjectId, "pipeline") },
  { label: "Evidence Explorer", icon: BarChart3, href: projectRoute(primaryProjectId, "evidence") },
  { label: "Experiments", icon: Beaker, href: projectRoute(primaryProjectId, "experiments") },
  { label: "Reports", icon: FileText, href: projectRoute(primaryProjectId, "reports") },
];

const isDeveloperMode =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_DEVELOPER_MODE === "true";

export const utilityNavItems: NavItem[] = [
  { label: "Settings", icon: Settings, href: projectRoute(primaryProjectId, "settings") },
  ...(isDeveloperMode
    ? [{ label: "Execution Logs", icon: TerminalSquare, href: "/dev/execution-logs" }]
    : []),
];

export const researchProjects: ResearchProject[] = workspaceProjects
  .filter((project) => !project.demo)
  .map((project) => ({
    id: project.id,
    title: project.title,
    domain: project.domain,
    description: project.summary,
    phase: project.phase,
    href: projectRoute(project.id),
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
  { label: "Start Discovery", icon: FolderOpen, href: projectRoute(primaryProjectId, "pipeline") },
  { label: "Upload Data", icon: Database, href: projectRoute(primaryProjectId, "evidence") },
  { label: "Export Report", icon: FileText, href: projectRoute(primaryProjectId, "reports") },
];

export const magicMomentQuestion =
  "Can microplastics contribute to Alzheimer's disease?";

export const magicPipelineSteps: MagicPipelineStep[] = [
  { label: "Planning", detail: "Research goal decomposed into evidence requirements" },
  { label: "Searching OpenAlex", detail: "617 candidate sources ranked" },
  { label: "Searching PubMed", detail: "Biomedical evidence retrieved" },
  { label: "Searching arXiv", detail: "Preprint signals screened" },
  { label: "Extracting 1,248 claims", detail: "Claims linked to source metadata" },
  { label: "Building knowledge graph", detail: "Entities, claims, and contradictions connected" },
  { label: "Detecting contradictions", detail: "12 conflicting evidence clusters found" },
  { label: "Ranking evidence", detail: "Evidence strength and relevance scored" },
  { label: "Generating hypotheses", detail: "Candidate mechanisms drafted" },
  { label: "Suggesting experiments", detail: "Validation plan assembled" },
  { label: "Writing report", detail: "Evidence-backed summary generated" },
];

export const magicMomentResults = [
  { label: "Evidence-backed summary", value: "Microplastic exposure has plausible indirect mechanisms, but evidence remains early-stage." },
  { label: "Contradictions found", value: "12 clusters need review across exposure models and neuroinflammation assays." },
  { label: "Research gaps", value: "Longitudinal exposure data and standardized biomarkers are weak spots." },
  { label: "Suggested experiments", value: "Validate inflammatory markers under controlled microplastic exposure models." },
  { label: "Novelty score", value: "82%: new as a cross-domain mechanism synthesis, not a confirmed finding." },
];
