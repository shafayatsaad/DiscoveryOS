// Purpose: Store mocked research pipeline stream data separately from the UI.

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Beaker,
  Check,
  Clock,
  FileText,
  FlaskConical,
  Network,
  RotateCw,
  Settings,
  SquareTerminal,
  UserCircle,
} from "lucide-react";

import { primaryProjectId, projectRoute, workspaceProjects } from "@/features/projects/data/project-workspaces";

export type JobNavItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  active?: boolean;
};

export type JobLogLine = {
  time: string;
  level: "INIT" | "INFO" | "WARN" | "SUCCESS" | "DONE" | "RUNNING";
  message: string;
};

export type JobStep = {
  title: string;
  status: "Done" | "Running" | "Queued" | "Pending";
  activity: string;
  metric: string;
  bar: string;
  defaultOpen?: boolean;
  logs?: JobLogLine[];
};

export const jobNavItems: JobNavItem[] = [
  { label: "Projects", icon: FlaskConical, href: projectRoute(primaryProjectId) },
  { label: "Knowledge Graph", icon: Network, href: projectRoute(primaryProjectId, "graph") },
  { label: "Research Pipeline", icon: SquareTerminal, href: projectRoute(primaryProjectId, "pipeline"), active: true },
  { label: "Evidence Explorer", icon: BarChart3, href: projectRoute(primaryProjectId, "evidence") },
  { label: "Experiments", icon: Beaker },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings },
];

const activeProject = workspaceProjects[0];

export const jobOverview = {
  title: "Research Pipeline",
  subtitle: activeProject.title,
  domain: activeProject.domain,
  owner: activeProject.owner,
  started: activeProject.started,
  commit: activeProject.commit,
};

export const jobHeaderMeta = [
  { label: jobOverview.owner, icon: UserCircle },
  { label: jobOverview.started, icon: Clock },
  { label: jobOverview.commit, icon: RotateCw },
];

export const jobSteps: JobStep[] = [
  {
    title: "Planning",
    status: "Done",
    activity: "Research goal decomposed",
    metric: "9 tasks",
    bar: "██████",
    logs: [
      { time: "10:42:01", level: "INIT", message: "Planning discovery workflow..." },
      { time: "10:42:05", level: "INFO", message: "Classified domain as Materials Science." },
      { time: "10:42:15", level: "INFO", message: "Built retrieval plan for polymer electrolyte evidence." },
      {
        time: "10:43:50",
        level: "SUCCESS",
        message: "Planning complete.",
      },
      { time: "10:44:15", level: "DONE", message: "Ready for literature retrieval." },
    ],
  },
  {
    title: "Retrieval",
    status: "Running",
    activity: "Downloading",
    metric: "1,237 papers",
    bar: "██████████",
    defaultOpen: true,
    logs: [
      { time: "10:44:16", level: "INIT", message: "Searching OpenAlex..." },
      { time: "10:45:00", level: "SUCCESS", message: "OpenAlex search complete." },
      { time: "10:45:30", level: "INFO", message: "Searching Semantic Scholar..." },
      { time: "10:50:12", level: "INFO", message: "Downloading 1,237 papers..." },
      { time: "11:15:00", level: "INFO", message: "Deduplicating citations and methods..." },
      { time: "11:26:22", level: "RUNNING", message: "Streaming new retrieval batches into the workspace." },
    ],
  },
  {
    title: "Evidence",
    status: "Running",
    activity: "Extracting",
    metric: "421 claims",
    bar: "██████",
  },
  {
    title: "Contradictions",
    status: "Running",
    activity: "Finding conflicts",
    metric: "Found 12",
    bar: "████",
  },
  {
    title: "Novelty",
    status: "Queued",
    activity: "Computing",
    metric: "Waiting on critic",
    bar: "███",
  },
  {
    title: "Report",
    status: "Pending",
    activity: "Pending",
    metric: "--",
    bar: "",
  },
];

export const statusIcon = {
  Done: Check,
  Running: RotateCw,
  Queued: Clock,
  Pending: Clock,
};
