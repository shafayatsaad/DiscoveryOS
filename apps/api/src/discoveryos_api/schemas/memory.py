"""Purpose: Define Pydantic schemas for project-owned DiscoveryOS Memory resources."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class ResearchNoteCreate(BaseModel):
    """Purpose: Validate input for storing a project research note."""

    title: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1)
    tags: list[str] = Field(default_factory=list)


class ResearchNoteRead(ResearchNoteCreate):
    """Purpose: Serialize a persisted research note."""

    id: str
    project_id: str
    created_at: datetime
    updated_at: datetime


class EvidenceCreate(BaseModel):
    """Purpose: Validate input for storing one evidence record."""

    claim: str = Field(min_length=1)
    source_title: str | None = Field(default=None, max_length=300)
    source_url: str | None = Field(default=None, max_length=1000)
    citation: str | None = None
    evidence_type: str | None = Field(default=None, max_length=120)
    strength: str | None = Field(default=None, max_length=80)
    metadata: dict[str, Any] = Field(default_factory=dict)


class EvidenceRead(EvidenceCreate):
    """Purpose: Serialize a persisted evidence record."""

    id: str
    project_id: str
    created_at: datetime


class HypothesisCreate(BaseModel):
    """Purpose: Validate input for storing one candidate hypothesis."""

    statement: str = Field(min_length=1)
    rationale: str | None = None
    status: str = Field(default="draft", max_length=50)
    confidence: float | None = Field(default=None, ge=0.0, le=1.0)
    metadata: dict[str, Any] = Field(default_factory=dict)


class HypothesisRead(HypothesisCreate):
    """Purpose: Serialize a persisted candidate hypothesis."""

    id: str
    project_id: str
    created_at: datetime
    updated_at: datetime


class KnowledgeGraphCreate(BaseModel):
    """Purpose: Validate input for storing a project knowledge graph snapshot."""

    name: str = Field(default="Project graph", min_length=1, max_length=200)
    nodes: list[dict[str, Any]] = Field(default_factory=list)
    edges: list[dict[str, Any]] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class KnowledgeGraphRead(KnowledgeGraphCreate):
    """Purpose: Serialize a persisted knowledge graph snapshot."""

    id: str
    project_id: str
    created_at: datetime
    updated_at: datetime


class TimelineEventCreate(BaseModel):
    """Purpose: Validate input for storing one project timeline event."""

    event_type: str = Field(min_length=1, max_length=120)
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    occurred_at: datetime | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class TimelineEventRead(BaseModel):
    """Purpose: Serialize a persisted project timeline event."""

    id: str
    project_id: str
    event_type: str
    title: str
    description: str | None
    occurred_at: datetime
    metadata: dict[str, Any]


class ResearchNoteResponse(BaseModel):
    """Purpose: Wrap one research note in a stable API response envelope."""

    success: bool = True
    data: ResearchNoteRead


class ResearchNotesResponse(BaseModel):
    """Purpose: Wrap research notes in a stable API response envelope."""

    success: bool = True
    data: list[ResearchNoteRead]


class EvidenceResponse(BaseModel):
    """Purpose: Wrap one evidence record in a stable API response envelope."""

    success: bool = True
    data: EvidenceRead


class EvidenceListResponse(BaseModel):
    """Purpose: Wrap evidence records in a stable API response envelope."""

    success: bool = True
    data: list[EvidenceRead]


class HypothesisResponse(BaseModel):
    """Purpose: Wrap one hypothesis in a stable API response envelope."""

    success: bool = True
    data: HypothesisRead


class HypothesesResponse(BaseModel):
    """Purpose: Wrap hypotheses in a stable API response envelope."""

    success: bool = True
    data: list[HypothesisRead]


class KnowledgeGraphResponse(BaseModel):
    """Purpose: Wrap one knowledge graph snapshot in a stable API response envelope."""

    success: bool = True
    data: KnowledgeGraphRead


class KnowledgeGraphsResponse(BaseModel):
    """Purpose: Wrap knowledge graph snapshots in a stable API response envelope."""

    success: bool = True
    data: list[KnowledgeGraphRead]


class TimelineEventResponse(BaseModel):
    """Purpose: Wrap one timeline event in a stable API response envelope."""

    success: bool = True
    data: TimelineEventRead


class TimelineEventsResponse(BaseModel):
    """Purpose: Wrap timeline events in a stable API response envelope."""

    success: bool = True
    data: list[TimelineEventRead]
