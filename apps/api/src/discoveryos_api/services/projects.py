"""Purpose: Implement Project application behavior without HTTP or SQLAlchemy details."""

from http import HTTPStatus

from discoveryos_api.api.errors import ApplicationError
from discoveryos_api.models.project import Project
from discoveryos_api.repositories.projects import ProjectRepository
from discoveryos_api.schemas.projects import ProjectCreate


class ProjectService:
    """Purpose: Coordinate Project use cases through a repository boundary."""

    def __init__(self, repository: ProjectRepository) -> None:
        """Purpose: Store the repository used by this service instance."""
        self._repository = repository

    async def create_project(self, project_in: ProjectCreate) -> Project:
        """Purpose: Create a new research project."""
        return await self._repository.create(project_in)

    async def list_projects(self) -> list[Project]:
        """Purpose: List all research projects."""
        return await self._repository.list()

    async def get_project(self, project_id: str) -> Project:
        """Purpose: Return one project or raise a structured not-found error."""
        project = await self._repository.get(project_id)
        if project is None:
            raise ApplicationError(
                "Project not found.",
                code="PROJECT_NOT_FOUND",
                status_code=HTTPStatus.NOT_FOUND,
            )
        return project

    async def delete_project(self, project_id: str) -> None:
        """Purpose: Delete one project or raise a structured not-found error."""
        deleted = await self._repository.delete(project_id)
        if not deleted:
            raise ApplicationError(
                "Project not found.",
                code="PROJECT_NOT_FOUND",
                status_code=HTTPStatus.NOT_FOUND,
            )
