// Purpose: Render the project experiments route.

import { ExperimentsPage } from "@/features/experiments/components/experiments-page";

type ProjectExperimentsRouteProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectExperimentsRoute({ params }: ProjectExperimentsRouteProps) {
  const { projectId } = await params;

  return <ExperimentsPage projectId={projectId} />;
}
