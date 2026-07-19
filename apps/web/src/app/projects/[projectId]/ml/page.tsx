// Purpose: Render the project ML insights route.

import { MlInsightsPage } from "@/features/ml-insights/components/ml-insights-page";

type ProjectMlRouteProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectMlRoute({ params }: ProjectMlRouteProps) {
  const { projectId } = await params;

  return <MlInsightsPage projectId={projectId} />;
}
