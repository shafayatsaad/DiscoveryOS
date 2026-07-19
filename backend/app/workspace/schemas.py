"""Purpose: Define API and domain schemas for persistent Discovery Workspaces."""

from datetime import UTC, datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

ArtifactKind = Literal[
    "research_plan",
    "retrieved_papers",
    "extracted_evidence",
    "knowledge_graph",
    "hypotheses",
    "research_notes",
    "timeline_events",
    "generated_reports",
    "contradictions",
    "novelty_analysis",
    "suggested_experiments",
]


class TimelineEvent(BaseModel):
    """Append-only event describing how a workspace changed."""

    event_type: str
    message: str
    status: str = "completed"
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    metadata: dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(extra="forbid")


class Workspace(BaseModel):
    """Persistent memory owned by exactly one research project."""

    id: str
    project_id: str
    research_goal: str | None = None
    research_plan: dict[str, Any] | None = None
    retrieved_papers: list[dict[str, Any]] = Field(default_factory=list)
    extracted_evidence: list[dict[str, Any]] = Field(default_factory=list)
    knowledge_graph: dict[str, Any] | None = None
    hypotheses: list[dict[str, Any]] = Field(default_factory=list)
    research_notes: list[dict[str, Any]] = Field(default_factory=list)
    timeline_events: list[TimelineEvent] = Field(default_factory=list)
    generated_reports: list[dict[str, Any]] = Field(default_factory=list)
    contradictions: list[dict[str, Any]] = Field(default_factory=list)
    novelty_analysis: dict[str, Any] | None = None
    suggested_experiments: list[dict[str, Any]] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(extra="forbid")


class WorkspacePatch(BaseModel):
    """Partial workspace update accepted by PATCH endpoints and services."""

    research_goal: str | None = None
    research_plan: dict[str, Any] | None = None
    retrieved_papers: list[dict[str, Any]] | None = None
    extracted_evidence: list[dict[str, Any]] | None = None
    knowledge_graph: dict[str, Any] | None = None
    hypotheses: list[dict[str, Any]] | None = None
    research_notes: list[dict[str, Any]] | None = None
    timeline_events: list[dict[str, Any]] | None = None
    generated_reports: list[dict[str, Any]] | None = None
    contradictions: list[dict[str, Any]] | None = None
    novelty_analysis: dict[str, Any] | None = None
    suggested_experiments: list[dict[str, Any]] | None = None

    model_config = ConfigDict(extra="forbid")


class WorkspaceArtifactAppend(BaseModel):
    """Generic append request future agents can use without new workspace columns."""

    artifact_kind: ArtifactKind
    artifact: dict[str, Any]
    event_message: str

    model_config = ConfigDict(extra="forbid")
