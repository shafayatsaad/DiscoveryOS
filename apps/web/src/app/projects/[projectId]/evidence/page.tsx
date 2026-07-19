// Purpose: Render the project evidence explorer route.

import { EvidenceExplorerPage } from "@/features/evidence/components/evidence-explorer-page";

type ProjectEvidenceRouteProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectEvidenceRoute({ params }: ProjectEvidenceRouteProps) {
  const { projectId } = await params;

  return <EvidenceExplorerPage projectId={projectId} />;
}
