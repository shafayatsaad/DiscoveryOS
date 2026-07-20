// Purpose: Provide static landing page presentation content such as capability cards.
// This is marketing copy, not mock data. Real-time pipeline data comes from the backend SSE stream.

import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Database,
  Cpu,
  Network,
  Globe2,
  TableProperties,
} from "lucide-react";

export type FeatureCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: "primary" | "secondary" | "tertiary";
};

export const featureCards: FeatureCard[] = [
  {
    title: "Autonomous Agents",
    description:
      "Deploy specialized AI agents capable of formulating hypotheses, running localized simulations, and iterating on experimental designs autonomously.",
    icon: Bot,
    tone: "primary",
  },
  {
    title: "Evidence Retrieval",
    description:
      "Instantly parse millions of peer-reviewed papers. Our semantic knowledge graph maps connections across disparate fields of study in real-time.",
    icon: Database,
    tone: "secondary",
  },
  {
    title: "ML Synthesis",
    description:
      "Automatically train and validate lightweight proxy models based on aggregated experimental data to predict outcomes before running physical tests.",
    icon: Cpu,
    tone: "tertiary",
  },
];

export const intelligenceNodes = [
  { className: "left-[17%] top-[28%]", label: "Laboratory Data" },
  { className: "left-[34%] top-[54%]", label: "Literature Claims" },
  { className: "right-[28%] top-[34%]", label: "Domain Repositories" },
  { className: "right-[18%] bottom-[25%]", label: "Research Graph" },
  { className: "left-[48%] bottom-[34%]", label: "Evidence Store" },
];

export const intelligenceIcons = [Network, Globe2, TableProperties];

// Visual decoration for the landing page execution pipeline graphic.
// Actual pipeline stages and labels come from the backend orchestrator state machine.
export const pipelineStages = [
  {
    label: "Stage 1",
    title: "Literature Retrieval",
    progress: 100,
    active: false,
  },
  {
    label: "Stage 2",
    title: "Evidence Extraction",
    progress: 45,
    active: true,
  },
  { label: "Stage 3", title: "Hypothesis Report", progress: 0, active: false },
];
