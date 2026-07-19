// Purpose: Store mock report content generated from a DiscoveryOS research workspace.

import { getProjectWorkspace } from "@/features/projects/data/project-workspaces";

export type ReportSection = {
  title: string;
  body: string;
  metric?: string;
};

export function getReportSections(projectId: string): ReportSection[] {
  const project = getProjectWorkspace(projectId);

  if (project.domain === "Biomedical") {
    return [
      {
        title: "Evidence-backed summary",
        body: "Checkpoint-associated immune exhaustion markers appear reproducible across several cohorts, but assay context strongly affects interpretation.",
        metric: "89% confidence",
      },
      {
        title: "Contradictions found",
        body: "DiscoveryOS found conflicts between bulk RNA, flow cytometry, and spatial profiling evidence. The report preserves each assay context.",
        metric: "14 conflicts",
      },
      {
        title: "Research gaps",
        body: "Longitudinal validation and shared marker panels are still limited across disease contexts.",
      },
      {
        title: "Suggested experiments",
        body: "Validate a compact LAG3/TIM3 exhaustion signature with matched flow and spatial profiling across independent cohorts.",
      },
    ];
  }

  if (project.domain === "Climate") {
    return [
      {
        title: "Evidence-backed summary",
        body: "Combined shade networks and reflective roof interventions show stronger heat-resilience potential than either intervention alone.",
        metric: "85% confidence",
      },
      {
        title: "Contradictions found",
        body: "Satellite surface-temperature measures diverge from human exposure measures in shaded corridors and transit-adjacent streets.",
        metric: "12 conflicts",
      },
      {
        title: "Research gaps",
        body: "The strongest gaps are neighborhood-scale intervention trials and wearable exposure validation.",
      },
      {
        title: "Suggested experiments",
        body: "Run a block-level intervention comparison with canopy, roof reflectance, and pedestrian exposure sensors.",
      },
    ];
  }

  return [
    {
      title: "Evidence-backed summary",
      body: "Ceramic-filled polymer electrolytes show a promising conductivity-stability tradeoff, but interfacial failure remains the main validation risk.",
      metric: "92% novelty",
    },
    {
      title: "Contradictions found",
      body: "Twelve contradiction clusters link conductivity gains to possible dendrite risk under high-current cycling.",
      metric: "12 conflicts",
    },
    {
      title: "Research gaps",
      body: "Room-temperature cycling data, standardized filler dispersion methods, and manufacturability constraints need stronger evidence.",
    },
    {
      title: "Suggested experiments",
      body: "Compare LLZO-filled PEO-LiTFSI blends against ionic-liquid additive variants under matched cycling and thermal protocols.",
    },
  ];
}

export const reportReferences = [
  "Claim extraction artifacts",
  "Knowledge graph snapshot",
  "Contradiction detection run",
  "Novelty analyzer scores",
  "Experiment planner output",
];
