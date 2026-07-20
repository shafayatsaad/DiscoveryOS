// Purpose: Define curated one-click demo workflows backed by cached frontend artifacts.

import { projectRoute, workspaceProjects } from "@/features/projects/data/project-workspaces";

export const demoProjects = workspaceProjects
  .filter((project) => project.demo)
  .map((project) => ({
    id: project.id,
    title: project.title,
    domain: project.domain,
    summary: project.summary,
    href: `${projectRoute(project.id, "pipeline")}?demo=true`,
    cached: Boolean(project.cachedResultsAvailable),
  }));

export const primaryDemoHref = demoProjects[0]?.href ?? "/dashboard";
