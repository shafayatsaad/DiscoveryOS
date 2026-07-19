"""Purpose: Implement Project persistence operations behind a repository boundary."""

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from discoveryos_api.models.project import Project
from discoveryos_api.schemas.projects import ProjectCreate


class ProjectRepository:
    """Purpose: Encapsulate SQLAlchemy access for Project records."""

    def __init__(self, session: AsyncSession) -> None:
        """Purpose: Store the request-scoped async database session."""
        self._session = session

    async def create(self, project_in: ProjectCreate) -> Project:
        """Purpose: Persist a new Project record."""
        project = Project(
            title=project_in.title,
            description=project_in.description,
            status=project_in.status,
            research_goal=project_in.research_goal,
            domain=project_in.domain,
            owner_name=project_in.owner_name,
            project_metadata=project_in.metadata,
        )
        self._session.add(project)
        await self._session.commit()
        await self._session.refresh(project)
        return project

    async def list(self) -> list[Project]:
        """Purpose: Return projects ordered by newest update first."""
        result = await self._session.execute(select(Project).order_by(Project.updated_at.desc()))
        return list(result.scalars().all())

    async def get(self, project_id: str) -> Project | None:
        """Purpose: Return one Project by ID or None when it does not exist."""
        return await self._session.get(Project, project_id)

    async def delete(self, project_id: str) -> bool:
        """Purpose: Delete one Project by ID and report whether a row was removed."""
        result = await self._session.execute(delete(Project).where(Project.id == project_id))
        await self._session.commit()
        return result.rowcount > 0
