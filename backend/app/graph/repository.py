"""Purpose: Store and retrieve knowledge graph JSON through the workspace record."""

from app.graph.schemas import KnowledgeGraph
from app.workspace.service import WorkspaceService


class KnowledgeGraphRepository:
    """Persistence adapter for graph artifacts stored inside workspaces."""

    def __init__(self, workspace_service: WorkspaceService) -> None:
        self._workspace_service = workspace_service

    def get(self, project_id: str) -> KnowledgeGraph | None:
        """Return the stored graph for a project when it exists."""

        workspace = self._workspace_service.get_workspace(project_id=project_id)
        if workspace.knowledge_graph is None:
            return None
        return KnowledgeGraph.model_validate(workspace.knowledge_graph)

    def save(self, project_id: str, graph: KnowledgeGraph) -> KnowledgeGraph:
        """Persist graph JSON on the project's workspace."""

        self._workspace_service.replace_artifact(
            project_id=project_id,
            field_name="knowledge_graph",
            value=graph.model_dump(mode="json"),
            message="Knowledge graph stored on workspace.",
        )
        return graph
