// Purpose: Store mocked research job timeline data separately from the UI.

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
  status: "Completed" | "Running" | "Pending";
  duration: string;
  defaultOpen?: boolean;
  logs?: JobLogLine[];
};

export const jobNavItems: JobNavItem[] = [
  { label: "Projects", icon: FlaskConical, href: "/projects/heart-failure-biomarkers" },
  { label: "Knowledge Graph", icon: Network, href: "/projects/heart-failure-biomarkers/graph" },
  { label: "Research Jobs", icon: SquareTerminal, href: "/projects/heart-failure-biomarkers/workflow", active: true },
  { label: "Evidence Explorer", icon: BarChart3, href: "/projects/heart-failure-biomarkers/evidence" },
  { label: "Experiments", icon: Beaker },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings },
];

export const jobOverview = {
  title: "Job #4092: Synthesis of Novel Polymer Structures",
  owner: "Dr. E. Vance",
  started: "Started 45m ago",
  commit: "7a9f2b1",
};

export const jobHeaderMeta = [
  { label: jobOverview.owner, icon: UserCircle },
  { label: jobOverview.started, icon: Clock },
  { label: jobOverview.commit, icon: RotateCw },
];

export const jobSteps: JobStep[] = [
  {
    title: "Initial Hypothesis Generation",
    status: "Completed",
    duration: "2m 14s",
    logs: [
      { time: "10:42:01", level: "INIT", message: "Starting hypothesis generation agent..." },
      { time: "10:42:05", level: "INFO", message: "Loading prior context from KG (node_id: poly_77a)..." },
      { time: "10:42:15", level: "INFO", message: "Generating structural candidates..." },
      {
        time: "10:43:50",
        level: "SUCCESS",
        message: "Generated 14 candidates. Filtering by stability score > 0.8...",
      },
      { time: "10:44:15", level: "DONE", message: "3 viable candidates identified." },
    ],
  },
  {
    title: "Data Retrieval",
    status: "Running",
    duration: "42m 10s",
    defaultOpen: true,
    logs: [
      { time: "10:44:16", level: "INIT", message: "Commencing literature search for candidate structures..." },
      { time: "10:45:00", level: "INFO", message: "Querying external API (PubMed)..." },
      { time: "10:45:30", level: "WARN", message: "Rate limit approaching on secondary source. Throttling..." },
      { time: "10:50:12", level: "INFO", message: "Downloading 420 related papers..." },
      { time: "11:15:00", level: "INFO", message: "Extracting tables and figures... (65% complete)" },
      { time: "11:26:22", level: "INFO", message: "Parsing chemical structures from images..." },
      { time: "...", level: "RUNNING", message: "Running" },
    ],
  },
  {
    title: "Evidence Synthesis",
    status: "Pending",
    duration: "--:--",
  },
];

export const statusIcon = {
  Completed: Check,
  Running: RotateCw,
  Pending: Clock,
};
