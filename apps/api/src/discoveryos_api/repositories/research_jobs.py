"""Purpose: Implement Research Job persistence behind a repository boundary."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from discoveryos_api.models.project import utc_now
from discoveryos_api.models.research_job import ResearchJob
from discoveryos_api.schemas.research_jobs import ResearchJobCreate, ResearchJobUpdate


class ResearchJobRepository:
    """Purpose: Encapsulate SQLAlchemy access for ResearchJob records."""

    def __init__(self, session: AsyncSession) -> None:
        """Purpose: Store the request-scoped async database session."""
        self._session = session

    async def create(self, project_id: str, job_in: ResearchJobCreate) -> ResearchJob:
        """Purpose: Persist a new ResearchJob for a project."""
        job = ResearchJob(
            project_id=project_id,
            status=job_in.status,
            started_at=job_in.started_at or utc_now(),
            finished_at=job_in.finished_at,
            current_step=job_in.current_step,
            progress=job_in.progress,
            logs=job_in.logs,
        )
        self._session.add(job)
        await self._session.commit()
        await self._session.refresh(job)
        return job

    async def get(self, job_id: str) -> ResearchJob | None:
        """Purpose: Return one ResearchJob by ID or None when it does not exist."""
        return await self._session.get(ResearchJob, job_id)

    async def list_by_project(self, project_id: str) -> list[ResearchJob]:
        """Purpose: Return jobs for one project ordered by newest start first."""
        result = await self._session.execute(
            select(ResearchJob)
            .where(ResearchJob.project_id == project_id)
            .order_by(ResearchJob.started_at.desc())
        )
        return list(result.scalars().all())

    async def update(self, job: ResearchJob, job_in: ResearchJobUpdate) -> ResearchJob:
        """Purpose: Persist partial ResearchJob execution-state updates."""
        update_data = job_in.model_dump(exclude_unset=True)
        for field_name, value in update_data.items():
            setattr(job, field_name, value)

        await self._session.commit()
        await self._session.refresh(job)
        return job
