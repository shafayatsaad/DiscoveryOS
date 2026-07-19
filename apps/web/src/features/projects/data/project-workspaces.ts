// Purpose: Centralize domain-agnostic project profiles so every workspace screen renders from the same project context.

export type DiscoveryDomain = "Materials Science" | "Biomedical" | "Climate";

export type WorkspaceProject = {
  id: string;
  displayId: string;
  title: string;
  domain: DiscoveryDomain;
  status: "Running" | "Review" | "Completed";
  phase: string;
  progress: number;
  summary: string;
  researchGoal: string;
  owner: string;
  started: string;
  commit: string;
};

export const primaryProjectId = "polymer-electrolyte-discovery";

export const workspaceProjects: WorkspaceProject[] = [
  {
    id: primaryProjectId,
    displayId: "DOS-MAT-4092",
    title: "Solid-State Polymer Electrolytes",
    domain: "Materials Science",
    status: "Running",
    phase: "Evidence retrieval",
    progress: 68,
    summary:
      "Discovering polymer electrolyte candidates that improve lithium-ion conductivity while preserving mechanical stability and manufacturability.",
    researchGoal:
      "Identify evidence-backed polymer electrolyte hypotheses with strong conductivity, thermal stability, and scalable synthesis routes.",
    owner: "Dr. E. Vance",
    started: "Started 45m ago",
    commit: "7a9f2b1",
  },
  {
    id: "immune-exhaustion-biomarkers",
    displayId: "DOS-BIO-3187",
    title: "Immune Exhaustion Biomarkers",
    domain: "Biomedical",
    status: "Running",
    phase: "Contradiction analysis",
    progress: 46,
    summary:
      "Mapping immune exhaustion signals across single-cell studies to surface reproducible biomarkers for therapy response.",
    researchGoal:
      "Find high-confidence immune exhaustion biomarkers that remain consistent across cohorts, assays, and disease contexts.",
    owner: "Dr. Maya Chen",
    started: "Started 2h ago",
    commit: "91c4ad8",
  },
  {
    id: "urban-heat-resilience",
    displayId: "DOS-CLI-2210",
    title: "Urban Heat Resilience",
    domain: "Climate",
    status: "Review",
    phase: "Novelty scoring",
    progress: 81,
    summary:
      "Synthesizing remote-sensing, policy, and infrastructure evidence to propose interventions for extreme urban heat.",
    researchGoal:
      "Generate testable hypotheses for reducing heat exposure in dense neighborhoods using evidence from climate and built-environment studies.",
    owner: "Dr. N. Rahman",
    started: "Started yesterday",
    commit: "d6e40af",
  },
  {
    id: "carbon-catalyst-screening",
    displayId: "DOS-MAT-1884",
    title: "Carbon Catalyst Screening",
    domain: "Materials Science",
    status: "Completed",
    phase: "Report generated",
    progress: 100,
    summary:
      "Ranked catalyst families for carbon capture conversion using literature evidence and experimental feasibility constraints.",
    researchGoal:
      "Prioritize catalyst hypotheses for efficient carbon capture conversion under commercially realistic operating conditions.",
    owner: "Dr. Lina Ortiz",
    started: "Completed Friday",
    commit: "b845ce0",
  },
];

export function getProjectWorkspace(projectId: string): WorkspaceProject {
  return workspaceProjects.find((project) => project.id === projectId) ?? workspaceProjects[0];
}

export function projectRoute(projectId: string, section?: "graph" | "evidence" | "pipeline") {
  const baseRoute = `/projects/${projectId}`;

  return section ? `${baseRoute}/${section}` : baseRoute;
}
