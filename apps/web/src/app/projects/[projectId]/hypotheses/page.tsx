// Purpose: Render the project hypotheses route.

import { HypothesesPage } from "@/features/hypotheses/components/hypotheses-page";

type ProjectHypothesesRouteProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectHypothesesRoute({ params }: ProjectHypothesesRouteProps) {
  const { projectId } = await params;

  return <HypothesesPage projectId={projectId} />;
}
