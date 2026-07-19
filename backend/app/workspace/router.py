"""Purpose: Expose Discovery Workspace CRUD endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import workspace_service_dependency
from app.workspace.schemas import Workspace, WorkspacePatch
from app.workspace.service import WorkspaceService

router = APIRouter()


@router.get("/projects/{project_id}/workspace", response_model=Workspace)
async def get_workspace(
    project_id: str,
    service: Annotated[WorkspaceService, Depends(workspace_service_dependency)],
) -> Workspace:
    """Return the persistent workspace owned by one project."""

    return service.get_workspace(project_id=project_id)


@router.patch("/projects/{project_id}/workspace", response_model=Workspace)
async def patch_workspace(
    project_id: str,
    patch: WorkspacePatch,
    service: Annotated[WorkspaceService, Depends(workspace_service_dependency)],
) -> Workspace:
    """Update mutable workspace memory for one project."""

    return service.update_workspace(project_id=project_id, patch=patch)
