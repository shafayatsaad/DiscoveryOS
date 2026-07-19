"""Purpose: Implement DiscoveryOS Memory application behavior without AI logic."""

from http import HTTPStatus
from typing import TypeVar

from discoveryos_api.api.errors import ApplicationError
from discoveryos_api.models.memory import (
    Evidence,
    Hypothesis,
    KnowledgeGraphSnapshot,
    ResearchNote,
    TimelineEvent,
)
from discoveryos_api.repositories.memory import (
    ProjectMemoryRepository,
)
from discoveryos_api.repositories.projects import ProjectRepository
from discoveryos_api.schemas.memory import (
    EvidenceCreate,
    HypothesisCreate,
    KnowledgeGraphCreate,
    ResearchNoteCreate,
    TimelineEventCreate,
)

MemoryModel = TypeVar(
    "MemoryModel",
    ResearchNote,
    Evidence,
    Hypothesis,
    KnowledgeGraphSnapshot,
    TimelineEvent,
)


class ProjectMemoryService[MemoryModel]:
    """Purpose: Provide shared validation behavior for project-owned memory resources."""

    not_found_code = "MEMORY_ITEM_NOT_FOUND"
    not_found_message = "Memory item not found."

    def __init__(
        self,
        repository: ProjectMemoryRepository[MemoryModel],
        project_repository: ProjectRepository,
    ) -> None:
        """Purpose: Store repositories used by memory use cases."""
        self._repository = repository
        self._project_repository = project_repository

    async def list_for_project(self, project_id: str) -> list[MemoryModel]:
        """Purpose: List memory items after confirming the project exists."""
        await self._require_project(project_id)
        return await self._repository.list_by_project(project_id)

    async def get(self, item_id: str) -> MemoryModel:
        """Purpose: Retrieve one memory item or raise a structured not-found error."""
        item = await self._repository.get(item_id)
        if item is None:
            raise ApplicationError(
                self.not_found_message,
                code=self.not_found_code,
                status_code=HTTPStatus.NOT_FOUND,
            )
        return item

    async def _require_project(self, project_id: str) -> None:
        """Purpose: Ensure project-scoped memory operations reference an existing project."""
        project = await self._project_repository.get(project_id)
        if project is None:
            raise ApplicationError(
                "Project not found.",
                code="PROJECT_NOT_FOUND",
                status_code=HTTPStatus.NOT_FOUND,
            )


class ResearchNoteService(ProjectMemoryService[ResearchNote]):
    """Purpose: Coordinate research note use cases."""

    not_found_code = "RESEARCH_NOTE_NOT_FOUND"
    not_found_message = "Research note not found."

    async def create(self, project_id: str, note_in: ResearchNoteCreate) -> ResearchNote:
        """Purpose: Create a research note for an existing project."""
        await self._require_project(project_id)
        return await self._repository.create(project_id, note_in)


class EvidenceService(ProjectMemoryService[Evidence]):
    """Purpose: Coordinate evidence use cases."""

    not_found_code = "EVIDENCE_NOT_FOUND"
    not_found_message = "Evidence record not found."

    async def create(self, project_id: str, evidence_in: EvidenceCreate) -> Evidence:
        """Purpose: Create an evidence record for an existing project."""
        await self._require_project(project_id)
        return await self._repository.create(project_id, evidence_in)


class HypothesisService(ProjectMemoryService[Hypothesis]):
    """Purpose: Coordinate hypothesis use cases."""

    not_found_code = "HYPOTHESIS_NOT_FOUND"
    not_found_message = "Hypothesis not found."

    async def create(self, project_id: str, hypothesis_in: HypothesisCreate) -> Hypothesis:
        """Purpose: Create a candidate hypothesis for an existing project."""
        await self._require_project(project_id)
        return await self._repository.create(project_id, hypothesis_in)


class KnowledgeGraphService(ProjectMemoryService[KnowledgeGraphSnapshot]):
    """Purpose: Coordinate knowledge graph snapshot use cases."""

    not_found_code = "KNOWLEDGE_GRAPH_NOT_FOUND"
    not_found_message = "Knowledge graph snapshot not found."

    async def create(
        self,
        project_id: str,
        graph_in: KnowledgeGraphCreate,
    ) -> KnowledgeGraphSnapshot:
        """Purpose: Create a knowledge graph snapshot for an existing project."""
        await self._require_project(project_id)
        return await self._repository.create(project_id, graph_in)


class TimelineEventService(ProjectMemoryService[TimelineEvent]):
    """Purpose: Coordinate timeline event use cases."""

    not_found_code = "TIMELINE_EVENT_NOT_FOUND"
    not_found_message = "Timeline event not found."

    async def create(self, project_id: str, event_in: TimelineEventCreate) -> TimelineEvent:
        """Purpose: Create a timeline event for an existing project."""
        await self._require_project(project_id)
        return await self._repository.create(project_id, event_in)
