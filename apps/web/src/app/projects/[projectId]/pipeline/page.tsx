// Purpose: Render the project research pipeline execution route.

import { ResearchJobsPage } from "@/features/workflows/components/research-jobs-page";

type ProjectPipelineRouteProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectPipelineRoute({ params }: ProjectPipelineRouteProps) {
  const { projectId } = await params;

  return <ResearchJobsPage projectId={projectId} />;
}
