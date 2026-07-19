"""Purpose: Expose backend knowledge graph endpoints without visualization concerns."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import graph_repository_dependency, workspace_service_dependency
from app.graph.builder import KnowledgeGraphBuilder
from app.graph.repository import KnowledgeGraphRepository
from app.graph.schemas import KnowledgeGraph
from app.workspace.service import WorkspaceService

router = APIRouter()


@router.get("/projects/{project_id}/graph", response_model=KnowledgeGraph)
async def get_graph(
    project_id: str,
    repository: Annotated[KnowledgeGraphRepository, Depends(graph_repository_dependency)],
) -> KnowledgeGraph:
    """Return the stored knowledge graph for a project."""

    graph = repository.get(project_id=project_id)
    if graph is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge graph has not been built for this project.",
        )
    return graph


@router.post("/projects/{project_id}/graph/build", response_model=KnowledgeGraph)
async def build_graph(
    project_id: str,
    workspace_service: Annotated[WorkspaceService, Depends(workspace_service_dependency)],
    repository: Annotated[KnowledgeGraphRepository, Depends(graph_repository_dependency)],
) -> KnowledgeGraph:
    """Build and store a knowledge graph from workspace evidence."""

    workspace = workspace_service.get_workspace(project_id=project_id)
    graph = KnowledgeGraphBuilder().build(workspace=workspace)
    return repository.save(project_id=project_id, graph=graph)
