"""Purpose: Define SQLModel persistence for Discovery Workspace records."""

from datetime import UTC, datetime
from typing import Any

from sqlalchemy import JSON, Column
from sqlmodel import Field

from app.models.base import DiscoverySQLModel
from app.utils.ids import prefixed_id


def _utc_now() -> datetime:
    """Return timezone-aware UTC timestamp for persisted records."""
    return datetime.now(UTC)


class WorkspaceRecord(DiscoverySQLModel, table=True):
    """SQLite-backed workspace owned one-to-one by a project identifier."""

    __tablename__ = "workspaces"

    id: str = Field(default_factory=lambda: prefixed_id("workspace"), primary_key=True)
    project_id: str = Field(index=True, unique=True)
    research_goal: str | None = None
    research_plan: dict[str, Any] | None = Field(default=None, sa_column=Column(JSON))
    retrieved_papers: list[dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))
    extracted_evidence: list[dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))
    knowledge_graph: dict[str, Any] | None = Field(default=None, sa_column=Column(JSON))
    hypotheses: list[dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))
    research_notes: list[dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))
    timeline_events: list[dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))
    generated_reports: list[dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))
    contradictions: list[dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))
    novelty_analysis: dict[str, Any] | None = Field(default=None, sa_column=Column(JSON))
    suggested_experiments: list[dict[str, Any]] = Field(
        default_factory=list,
        sa_column=Column(JSON),
    )
    created_at: datetime = Field(default_factory=_utc_now)
    updated_at: datetime = Field(default_factory=_utc_now)
