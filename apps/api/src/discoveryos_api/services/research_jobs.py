"""Purpose: Implement Research Job application behavior without AI execution."""

from http import HTTPStatus

from discoveryos_api.api.errors import ApplicationError
from discoveryos_api.models.research_job import ResearchJob
from discoveryos_api.repositories.projects import ProjectRepository
from discoveryos_api.repositories.research_jobs import ResearchJobRepository
from discoveryos_api.schemas.research_jobs import ResearchJobCreate, ResearchJobUpdate


class ResearchJobService:
    """Purpose: Coordinate project-scoped job use cases through repository boundaries."""

    def __init__(
        self,
        job_repository: ResearchJobRepository,
        project_repository: ProjectRepository,
    ) -> None:
        """Purpose: Store repositories used by this service instance."""
        self._job_repository = job_repository
        self._project_repository = project_repository

    async def create_job(self, project_id: str, job_in: ResearchJobCreate) -> ResearchJob:
        """Purpose: Create a job for an existing project."""
        await self._require_project(project_id)
        return await self._job_repository.create(project_id, job_in)

    async def get_job(self, job_id: str) -> ResearchJob:
        """Purpose: Return one job or raise a structured not-found error."""
        job = await self._job_repository.get(job_id)
        if job is None:
            raise ApplicationError(
                "Research job not found.",
                code="RESEARCH_JOB_NOT_FOUND",
                status_code=HTTPStatus.NOT_FOUND,
            )
        return job

    async def list_jobs_for_project(self, project_id: str) -> list[ResearchJob]:
        """Purpose: List jobs for an existing project."""
        await self._require_project(project_id)
        return await self._job_repository.list_by_project(project_id)

    async def update_job(self, job_id: str, job_in: ResearchJobUpdate) -> ResearchJob:
        """Purpose: Apply partial execution-state updates to one job."""
        job = await self.get_job(job_id)
        return await self._job_repository.update(job, job_in)

    async def _require_project(self, project_id: str) -> None:
        """Purpose: Ensure project-scoped job operations reference an existing project."""
        project = await self._project_repository.get(project_id)
        if project is None:
            raise ApplicationError(
                "Project not found.",
                code="PROJECT_NOT_FOUND",
                status_code=HTTPStatus.NOT_FOUND,
            )
