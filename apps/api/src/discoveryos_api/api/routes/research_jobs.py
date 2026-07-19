"""Purpose: Provide versioned HTTP endpoints for project-scoped Research Job resources."""

from typing import Annotated

from fastapi import APIRouter, Body, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from discoveryos_api.api.dependencies import get_db_session
from discoveryos_api.models.research_job import ResearchJob
from discoveryos_api.repositories.projects import ProjectRepository
from discoveryos_api.repositories.research_jobs import ResearchJobRepository
from discoveryos_api.schemas.research_jobs import (
    ResearchJobCreate,
    ResearchJobRead,
    ResearchJobResponse,
    ResearchJobsResponse,
    ResearchJobUpdate,
)
from discoveryos_api.services.research_jobs import ResearchJobService

router = APIRouter(tags=["research-jobs"])

# Purpose: Keep database and body dependency wiring explicit for future streaming-friendly routes.
DbSessionDependency = Annotated[AsyncSession, Depends(get_db_session)]
ResearchJobCreateBody = Annotated[ResearchJobCreate, Body(default_factory=ResearchJobCreate)]


def _job_to_read(job: ResearchJob) -> ResearchJobRead:
    """Purpose: Convert the SQLAlchemy model into the public Research Job schema."""
    return ResearchJobRead(
        id=job.id,
        project_id=job.project_id,
        status=job.status,
        started_at=job.started_at,
        finished_at=job.finished_at,
        current_step=job.current_step,
        progress=job.progress,
        logs=job.logs,
    )


def _service(session: AsyncSession) -> ResearchJobService:
    """Purpose: Compose the service and repositories for a request-scoped session."""
    return ResearchJobService(
        job_repository=ResearchJobRepository(session),
        project_repository=ProjectRepository(session),
    )


@router.post(
    "/projects/{project_id}/jobs",
    response_model=ResearchJobResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_project_job(
    project_id: str,
    payload: ResearchJobCreateBody,
    session: DbSessionDependency,
) -> ResearchJobResponse:
    """Purpose: Create an infrastructure job for a project without executing AI work."""
    job = await _service(session).create_job(project_id, payload)
    return ResearchJobResponse(data=_job_to_read(job))


@router.get("/jobs/{job_id}", response_model=ResearchJobResponse)
async def get_job(job_id: str, session: DbSessionDependency) -> ResearchJobResponse:
    """Purpose: Retrieve one research job by ID."""
    job = await _service(session).get_job(job_id)
    return ResearchJobResponse(data=_job_to_read(job))


@router.get("/projects/{project_id}/jobs", response_model=ResearchJobsResponse)
async def list_project_jobs(
    project_id: str,
    session: DbSessionDependency,
) -> ResearchJobsResponse:
    """Purpose: List all infrastructure jobs associated with a project."""
    jobs = await _service(session).list_jobs_for_project(project_id)
    return ResearchJobsResponse(data=[_job_to_read(job) for job in jobs])


@router.patch("/jobs/{job_id}", response_model=ResearchJobResponse)
async def update_job(
    job_id: str,
    payload: ResearchJobUpdate,
    session: DbSessionDependency,
) -> ResearchJobResponse:
    """Purpose: Update job execution state for future workers or streaming producers."""
    job = await _service(session).update_job(job_id, payload)
    return ResearchJobResponse(data=_job_to_read(job))
