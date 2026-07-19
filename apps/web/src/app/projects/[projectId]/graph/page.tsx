// Purpose: Render the project knowledge graph explorer route.

import { KnowledgeGraphPage } from "@/features/knowledge-graph/components/knowledge-graph-page";

type ProjectKnowledgeGraphRouteProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectKnowledgeGraphRoute({ params }: ProjectKnowledgeGraphRouteProps) {
  const { projectId } = await params;

  return <KnowledgeGraphPage projectId={projectId} />;
}
