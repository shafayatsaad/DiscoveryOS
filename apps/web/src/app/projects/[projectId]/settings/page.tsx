// Purpose: Render the project settings route.

import { SettingsPage } from "@/features/settings/components/settings-page";

type ProjectSettingsRouteProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectSettingsRoute({ params }: ProjectSettingsRouteProps) {
  const { projectId } = await params;

  return <SettingsPage projectId={projectId} />;
}
