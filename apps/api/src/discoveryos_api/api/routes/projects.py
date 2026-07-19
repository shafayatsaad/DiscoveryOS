"""Purpose: Provide versioned HTTP endpoints for Project resources."""

from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from discoveryos_api.api.dependencies import get_db_session
from discoveryos_api.repositories.projects import ProjectRepository
from discoveryos_api.schemas.projects import (
    ProjectCreate,
    ProjectRead,
    ProjectResponse,
    ProjectsResponse,
)
from discoveryos_api.services.projects import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])

# Purpose: Keep database dependency injection explicit and reusable across route handlers.
DbSessionDependency = Annotated[AsyncSession, Depends(get_db_session)]


def _project_to_read(project) -> ProjectRead:
    """Purpose: Convert the SQLAlchemy model into the public Project schema."""
    return ProjectRead(
        id=project.id,
        title=project.title,
        description=project.description,
        status=project.status,
        research_goal=project.research_goal,
        domain=project.domain,
        created_at=project.created_at,
        updated_at=project.updated_at,
        owner_name=project.owner_name,
        metadata=project.project_metadata,
    )


def _service(session: AsyncSession) -> ProjectService:
    """Purpose: Compose the service and repository for a request-scoped session."""
    return ProjectService(ProjectRepository(session))


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(payload: ProjectCreate, session: DbSessionDependency) -> ProjectResponse:
    """Purpose: Create a project-backed research session."""
    project = await _service(session).create_project(payload)
    return ProjectResponse(data=_project_to_read(project))


@router.get("", response_model=ProjectsResponse)
async def list_projects(session: DbSessionDependency) -> ProjectsResponse:
    """Purpose: List project-backed research sessions."""
    projects = await _service(session).list_projects()
    return ProjectsResponse(data=[_project_to_read(project) for project in projects])


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, session: DbSessionDependency) -> ProjectResponse:
    """Purpose: Retrieve one project-backed research session by ID."""
    project = await _service(session).get_project(project_id)
    return ProjectResponse(data=_project_to_read(project))


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: str, session: DbSessionDependency) -> Response:
    """Purpose: Delete one project-backed research session by ID."""
    await _service(session).delete_project(project_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
