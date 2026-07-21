// Purpose: Pre-render known project workspaces so in-app navigation stays instant.

import type { ReactNode } from "react";

import { workspaceProjects } from "@/features/projects/data/project-workspaces";

export function generateStaticParams() {
  return workspaceProjects.map((project) => ({ projectId: project.id }));
}

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return children;
}
