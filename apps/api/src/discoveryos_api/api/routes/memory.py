"""Purpose: Provide versioned HTTP endpoints for project-owned DiscoveryOS Memory."""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from discoveryos_api.api.dependencies import get_db_session
from discoveryos_api.models.memory import (
    Evidence,
    Hypothesis,
    KnowledgeGraphSnapshot,
    ResearchNote,
    TimelineEvent,
)
from discoveryos_api.repositories.memory import (
    EvidenceRepository,
    HypothesisRepository,
    KnowledgeGraphRepository,
    ResearchNoteRepository,
    TimelineEventRepository,
)
from discoveryos_api.repositories.projects import ProjectRepository
from discoveryos_api.schemas.memory import (
    EvidenceCreate,
    EvidenceListResponse,
    EvidenceRead,
    EvidenceResponse,
    HypothesesResponse,
    HypothesisCreate,
    HypothesisRead,
    HypothesisResponse,
    KnowledgeGraphCreate,
    KnowledgeGraphRead,
    KnowledgeGraphResponse,
    KnowledgeGraphsResponse,
    ResearchNoteCreate,
    ResearchNoteRead,
    ResearchNoteResponse,
    ResearchNotesResponse,
    TimelineEventCreate,
    TimelineEventRead,
    TimelineEventResponse,
    TimelineEventsResponse,
)
from discoveryos_api.services.memory import (
    EvidenceService,
    HypothesisService,
    KnowledgeGraphService,
    ResearchNoteService,
    TimelineEventService,
)

router = APIRouter(tags=["memory"])

# Purpose: Keep database dependency injection explicit across memory endpoints.
DbSessionDependency = Annotated[AsyncSession, Depends(get_db_session)]


def _project_repository(session: AsyncSession) -> ProjectRepository:
    """Purpose: Build the project repository used to validate project ownership."""
    return ProjectRepository(session)


def _note_to_read(note: ResearchNote) -> ResearchNoteRead:
    """Purpose: Convert a ResearchNote model into its public schema."""
    return ResearchNoteRead(
        id=note.id,
        project_id=note.project_id,
        title=note.title,
        content=note.content,
        tags=note.tags,
        created_at=note.created_at,
        updated_at=note.updated_at,
    )


def _evidence_to_read(evidence: Evidence) -> EvidenceRead:
    """Purpose: Convert an Evidence model into its public schema."""
    return EvidenceRead(
        id=evidence.id,
        project_id=evidence.project_id,
        claim=evidence.claim,
        source_title=evidence.source_title,
        source_url=evidence.source_url,
        citation=evidence.citation,
        evidence_type=evidence.evidence_type,
        strength=evidence.strength,
        metadata=evidence.evidence_metadata,
        created_at=evidence.created_at,
    )


def _hypothesis_to_read(hypothesis: Hypothesis) -> HypothesisRead:
    """Purpose: Convert a Hypothesis model into its public schema."""
    return HypothesisRead(
        id=hypothesis.id,
        project_id=hypothesis.project_id,
        statement=hypothesis.statement,
        rationale=hypothesis.rationale,
        status=hypothesis.status,
        confidence=hypothesis.confidence,
        metadata=hypothesis.hypothesis_metadata,
        created_at=hypothesis.created_at,
        updated_at=hypothesis.updated_at,
    )


def _graph_to_read(graph: KnowledgeGraphSnapshot) -> KnowledgeGraphRead:
    """Purpose: Convert a KnowledgeGraphSnapshot model into its public schema."""
    return KnowledgeGraphRead(
        id=graph.id,
        project_id=graph.project_id,
        name=graph.name,
        nodes=graph.nodes,
        edges=graph.edges,
        metadata=graph.graph_metadata,
        created_at=graph.created_at,
        updated_at=graph.updated_at,
    )


def _timeline_event_to_read(event: TimelineEvent) -> TimelineEventRead:
    """Purpose: Convert a TimelineEvent model into its public schema."""
    return TimelineEventRead(
        id=event.id,
        project_id=event.project_id,
        event_type=event.event_type,
        title=event.title,
        description=event.description,
        occurred_at=event.occurred_at,
        metadata=event.event_metadata,
    )


@router.post(
    "/projects/{project_id}/memory/notes",
    response_model=ResearchNoteResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_research_note(
    project_id: str,
    payload: ResearchNoteCreate,
    session: DbSessionDependency,
) -> ResearchNoteResponse:
    """Purpose: Store a project research note in SQLite."""
    service = ResearchNoteService(ResearchNoteRepository(session), _project_repository(session))
    note = await service.create(project_id, payload)
    return ResearchNoteResponse(data=_note_to_read(note))


@router.get("/projects/{project_id}/memory/notes", response_model=ResearchNotesResponse)
async def list_research_notes(
    project_id: str,
    session: DbSessionDependency,
) -> ResearchNotesResponse:
    """Purpose: List project research notes."""
    service = ResearchNoteService(ResearchNoteRepository(session), _project_repository(session))
    notes = await service.list_for_project(project_id)
    return ResearchNotesResponse(data=[_note_to_read(note) for note in notes])


@router.get("/memory/notes/{note_id}", response_model=ResearchNoteResponse)
async def get_research_note(note_id: str, session: DbSessionDependency) -> ResearchNoteResponse:
    """Purpose: Retrieve one project research note by ID."""
    service = ResearchNoteService(ResearchNoteRepository(session), _project_repository(session))
    note = await service.get(note_id)
    return ResearchNoteResponse(data=_note_to_read(note))


@router.post(
    "/projects/{project_id}/memory/evidence",
    response_model=EvidenceResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_evidence(
    project_id: str,
    payload: EvidenceCreate,
    session: DbSessionDependency,
) -> EvidenceResponse:
    """Purpose: Store a project evidence record in SQLite."""
    service = EvidenceService(EvidenceRepository(session), _project_repository(session))
    evidence = await service.create(project_id, payload)
    return EvidenceResponse(data=_evidence_to_read(evidence))


@router.get("/projects/{project_id}/memory/evidence", response_model=EvidenceListResponse)
async def list_evidence(project_id: str, session: DbSessionDependency) -> EvidenceListResponse:
    """Purpose: List project evidence records."""
    service = EvidenceService(EvidenceRepository(session), _project_repository(session))
    evidence_records = await service.list_for_project(project_id)
    return EvidenceListResponse(data=[_evidence_to_read(evidence) for evidence in evidence_records])


@router.get("/memory/evidence/{evidence_id}", response_model=EvidenceResponse)
async def get_evidence(evidence_id: str, session: DbSessionDependency) -> EvidenceResponse:
    """Purpose: Retrieve one project evidence record by ID."""
    service = EvidenceService(EvidenceRepository(session), _project_repository(session))
    evidence = await service.get(evidence_id)
    return EvidenceResponse(data=_evidence_to_read(evidence))


@router.post(
    "/projects/{project_id}/memory/hypotheses",
    response_model=HypothesisResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_hypothesis(
    project_id: str,
    payload: HypothesisCreate,
    session: DbSessionDependency,
) -> HypothesisResponse:
    """Purpose: Store a project hypothesis in SQLite."""
    service = HypothesisService(HypothesisRepository(session), _project_repository(session))
    hypothesis = await service.create(project_id, payload)
    return HypothesisResponse(data=_hypothesis_to_read(hypothesis))


@router.get("/projects/{project_id}/memory/hypotheses", response_model=HypothesesResponse)
async def list_hypotheses(project_id: str, session: DbSessionDependency) -> HypothesesResponse:
    """Purpose: List project hypotheses."""
    service = HypothesisService(HypothesisRepository(session), _project_repository(session))
    hypotheses = await service.list_for_project(project_id)
    return HypothesesResponse(data=[_hypothesis_to_read(hypothesis) for hypothesis in hypotheses])


@router.get("/memory/hypotheses/{hypothesis_id}", response_model=HypothesisResponse)
async def get_hypothesis(hypothesis_id: str, session: DbSessionDependency) -> HypothesisResponse:
    """Purpose: Retrieve one project hypothesis by ID."""
    service = HypothesisService(HypothesisRepository(session), _project_repository(session))
    hypothesis = await service.get(hypothesis_id)
    return HypothesisResponse(data=_hypothesis_to_read(hypothesis))


@router.post(
    "/projects/{project_id}/memory/knowledge-graphs",
    response_model=KnowledgeGraphResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_knowledge_graph(
    project_id: str,
    payload: KnowledgeGraphCreate,
    session: DbSessionDependency,
) -> KnowledgeGraphResponse:
    """Purpose: Store a project knowledge graph snapshot in SQLite."""
    service = KnowledgeGraphService(KnowledgeGraphRepository(session), _project_repository(session))
    graph = await service.create(project_id, payload)
    return KnowledgeGraphResponse(data=_graph_to_read(graph))


@router.get(
    "/projects/{project_id}/memory/knowledge-graphs",
    response_model=KnowledgeGraphsResponse,
)
async def list_knowledge_graphs(
    project_id: str,
    session: DbSessionDependency,
) -> KnowledgeGraphsResponse:
    """Purpose: List project knowledge graph snapshots."""
    service = KnowledgeGraphService(KnowledgeGraphRepository(session), _project_repository(session))
    graphs = await service.list_for_project(project_id)
    return KnowledgeGraphsResponse(data=[_graph_to_read(graph) for graph in graphs])


@router.get("/memory/knowledge-graphs/{graph_id}", response_model=KnowledgeGraphResponse)
async def get_knowledge_graph(
    graph_id: str, session: DbSessionDependency
) -> KnowledgeGraphResponse:
    """Purpose: Retrieve one project knowledge graph snapshot by ID."""
    service = KnowledgeGraphService(KnowledgeGraphRepository(session), _project_repository(session))
    graph = await service.get(graph_id)
    return KnowledgeGraphResponse(data=_graph_to_read(graph))


@router.post(
    "/projects/{project_id}/memory/timeline",
    response_model=TimelineEventResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_timeline_event(
    project_id: str,
    payload: TimelineEventCreate,
    session: DbSessionDependency,
) -> TimelineEventResponse:
    """Purpose: Store a project timeline event in SQLite."""
    service = TimelineEventService(TimelineEventRepository(session), _project_repository(session))
    event = await service.create(project_id, payload)
    return TimelineEventResponse(data=_timeline_event_to_read(event))


@router.get("/projects/{project_id}/memory/timeline", response_model=TimelineEventsResponse)
async def list_timeline_events(
    project_id: str,
    session: DbSessionDependency,
) -> TimelineEventsResponse:
    """Purpose: List project timeline events."""
    service = TimelineEventService(TimelineEventRepository(session), _project_repository(session))
    events = await service.list_for_project(project_id)
    return TimelineEventsResponse(data=[_timeline_event_to_read(event) for event in events])


@router.get("/memory/timeline/{event_id}", response_model=TimelineEventResponse)
async def get_timeline_event(event_id: str, session: DbSessionDependency) -> TimelineEventResponse:
    """Purpose: Retrieve one project timeline event by ID."""
    service = TimelineEventService(TimelineEventRepository(session), _project_repository(session))
    event = await service.get(event_id)
    return TimelineEventResponse(data=_timeline_event_to_read(event))
