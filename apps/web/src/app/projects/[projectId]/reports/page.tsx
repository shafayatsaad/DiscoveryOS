// Purpose: Render the project reports route.

import { ReportsPage } from "@/features/reports/components/reports-page";

type ProjectReportsRouteProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectReportsRoute({ params }: ProjectReportsRouteProps) {
  const { projectId } = await params;

  return <ReportsPage projectId={projectId} />;
}
