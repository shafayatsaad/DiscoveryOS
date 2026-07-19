// Purpose: Redirect the old workflow route to the renamed Research Pipeline screen.

import { redirect } from "next/navigation";

type ProjectWorkflowRouteProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectWorkflowRoute({ params }: ProjectWorkflowRouteProps) {
  const { projectId } = await params;

  redirect(`/projects/${projectId}/pipeline`);
}
