"""Purpose: Implement DiscoveryOS Memory persistence behind repository boundaries."""

from typing import TypeVar

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from discoveryos_api.models.memory import (
    Evidence,
    Hypothesis,
    KnowledgeGraphSnapshot,
    ResearchNote,
    TimelineEvent,
)
from discoveryos_api.models.project import utc_now
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


class ProjectMemoryRepository[MemoryModel]:
    """Purpose: Provide shared project-scoped read helpers for memory repositories."""

    model: type[MemoryModel]

    def __init__(self, session: AsyncSession) -> None:
        """Purpose: Store the request-scoped async database session."""
        self._session = session

    async def get(self, item_id: str) -> MemoryModel | None:
        """Purpose: Return one memory item by ID or None when it does not exist."""
        return await self._session.get(self.model, item_id)

    async def list_by_project(self, project_id: str) -> list[MemoryModel]:
        """Purpose: Return memory items for one project ordered by newest first."""
        result = await self._session.execute(
            select(self.model)
            .where(self.model.project_id == project_id)
            .order_by(self._order_column().desc())
        )
        return list(result.scalars().all())

    def _order_column(self):
        """Purpose: Select the most relevant timestamp column for chronological listing."""
        if hasattr(self.model, "updated_at"):
            return self.model.updated_at
        if hasattr(self.model, "created_at"):
            return self.model.created_at
        return self.model.occurred_at


class ResearchNoteRepository(ProjectMemoryRepository[ResearchNote]):
    """Purpose: Encapsulate persistence for research notes."""

    model = ResearchNote

    async def create(self, project_id: str, note_in: ResearchNoteCreate) -> ResearchNote:
        """Purpose: Persist one research note for a project."""
        note = ResearchNote(project_id=project_id, **note_in.model_dump())
        self._session.add(note)
        await self._session.commit()
        await self._session.refresh(note)
        return note


class EvidenceRepository(ProjectMemoryRepository[Evidence]):
    """Purpose: Encapsulate persistence for evidence records."""

    model = Evidence

    async def create(self, project_id: str, evidence_in: EvidenceCreate) -> Evidence:
        """Purpose: Persist one evidence record for a project."""
        data = evidence_in.model_dump()
        metadata = data.pop("metadata")
        evidence = Evidence(project_id=project_id, evidence_metadata=metadata, **data)
        self._session.add(evidence)
        await self._session.commit()
        await self._session.refresh(evidence)
        return evidence


class HypothesisRepository(ProjectMemoryRepository[Hypothesis]):
    """Purpose: Encapsulate persistence for hypotheses."""

    model = Hypothesis

    async def create(self, project_id: str, hypothesis_in: HypothesisCreate) -> Hypothesis:
        """Purpose: Persist one candidate hypothesis for a project."""
        data = hypothesis_in.model_dump()
        metadata = data.pop("metadata")
        hypothesis = Hypothesis(project_id=project_id, hypothesis_metadata=metadata, **data)
        self._session.add(hypothesis)
        await self._session.commit()
        await self._session.refresh(hypothesis)
        return hypothesis


class KnowledgeGraphRepository(ProjectMemoryRepository[KnowledgeGraphSnapshot]):
    """Purpose: Encapsulate persistence for knowledge graph snapshots."""

    model = KnowledgeGraphSnapshot

    async def create(
        self,
        project_id: str,
        graph_in: KnowledgeGraphCreate,
    ) -> KnowledgeGraphSnapshot:
        """Purpose: Persist one knowledge graph snapshot for a project."""
        data = graph_in.model_dump()
        metadata = data.pop("metadata")
        graph = KnowledgeGraphSnapshot(project_id=project_id, graph_metadata=metadata, **data)
        self._session.add(graph)
        await self._session.commit()
        await self._session.refresh(graph)
        return graph


class TimelineEventRepository(ProjectMemoryRepository[TimelineEvent]):
    """Purpose: Encapsulate persistence for project timeline events."""

    model = TimelineEvent

    async def create(self, project_id: str, event_in: TimelineEventCreate) -> TimelineEvent:
        """Purpose: Persist one timeline event for a project."""
        data = event_in.model_dump()
        metadata = data.pop("metadata")
        occurred_at = data.pop("occurred_at") or utc_now()
        event = TimelineEvent(
            project_id=project_id,
            occurred_at=occurred_at,
            event_metadata=metadata,
            **data,
        )
        self._session.add(event)
        await self._session.commit()
        await self._session.refresh(event)
        return event
