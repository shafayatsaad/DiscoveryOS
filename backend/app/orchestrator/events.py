"""Purpose: Define typed pipeline timeline events emitted during orchestration."""

from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


PIPELINE_EVENT_TYPES = {
    "pipeline.started",
    "pipeline.completed",
    "pipeline.failed",
    "pipeline.resumed",
    "stage.started",
    "stage.completed",
    "stage.failed",
    "stage.skipped",
    "workspace.updated",
    "workspace.artifact_appended",
    "progress.updated",
}


def _utc_now() -> datetime:
    """Return timezone-aware UTC timestamp."""
    return datetime.now(UTC)


class DiscoveryEvent(BaseModel):
    """Immutable timeline event emitted during pipeline execution."""

    event_type: str
    stage: str | None = None
    timestamp: datetime = Field(default_factory=_utc_now)
    message: str
    metadata: dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(extra="forbid")


def make_event(
    event_type: str,
    stage: str | None = None,
    message: str = "",
    **metadata: Any,
) -> DiscoveryEvent:
    """Convenience factory for creating typed pipeline events."""

    if event_type not in PIPELINE_EVENT_TYPES:
        raise ValueError(f"Unknown event type: {event_type}. Must be one of {PIPELINE_EVENT_TYPES}")

    return DiscoveryEvent(
        event_type=event_type,
        stage=stage,
        message=message or event_type,
        metadata=metadata,
    )