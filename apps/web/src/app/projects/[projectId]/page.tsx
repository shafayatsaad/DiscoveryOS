// Purpose: Render an individual DiscoveryOS research project workspace.

import { ResearchProjectPage } from "@/features/projects/components/research-project-page";

type ProjectRouteProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectRoute({ params }: ProjectRouteProps) {
  const { projectId } = await params;

  return <ResearchProjectPage projectId={projectId} />;
}
