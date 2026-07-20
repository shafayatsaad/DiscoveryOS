"""Purpose: Define the DiscoveryState object passed between all pipeline stages."""

from datetime import UTC, datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class StageStatus(str, Enum):
    """Status of an individual pipeline stage."""

    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class StageState(BaseModel):
    """Snapshot of a single pipeline stage's execution state."""

    name: str
    status: StageStatus = StageStatus.PENDING
    started_at: datetime | None = None
    completed_at: datetime | None = None
    error: str | None = None

    model_config = ConfigDict(extra="forbid")


STAGE_ORDER = [
    "planner",
    "retriever",
    "extractor",
    "knowledge_graph",
    "contradiction",
    "novelty",
    "experiment",
    "report",
]

STAGE_LABELS = {
    "planner": "Research Planning",
    "retriever": "Literature Retrieval",
    "extractor": "Evidence Extraction",
    "knowledge_graph": "Knowledge Graph Construction",
    "contradiction": "Contradiction Detection",
    "novelty": "Novelty Analysis",
    "experiment": "Experiment Planning",
    "report": "Report Generation",
}


def _utc_now() -> datetime:
    """Return timezone-aware UTC timestamp."""
    return datetime.now(UTC)


class DiscoveryState(BaseModel):
    """Single source of truth for a pipeline run, passed between all stages."""

    run_id: str
    project_id: str
    research_question: str
    domain: str | None = None
    status: str = "running"  # running | paused | completed | failed
    current_stage: str | None = None
    progress: float = 0.0  # 0.0 – 100.0
    stages: dict[str, StageState] = Field(default_factory=dict)
    events: list[dict[str, Any]] = Field(default_factory=list)

    # Agent outputs — populated as the pipeline progresses
    plan: dict[str, Any] | None = None
    papers: list[dict[str, Any]] = Field(default_factory=list)
    evidence: list[dict[str, Any]] = Field(default_factory=list)
    knowledge_graph: dict[str, Any] | None = None
    contradictions: list[dict[str, Any]] = Field(default_factory=list)
    novelty_analysis: dict[str, Any] | None = None
    suggested_experiments: list[dict[str, Any]] = Field(default_factory=list)
    report: dict[str, Any] | None = None

    created_at: datetime = Field(default_factory=_utc_now)
    updated_at: datetime = Field(default_factory=_utc_now)

    # Performance: cached metadata for SSE streaming to avoid recomputing on every poll.
    _metadata_cache: dict[str, Any] | None = None
    _last_known_event_count: int = 0

    model_config = ConfigDict(extra="forbid")

    def stage_progress_weight(self) -> float:
        """Return the progress weight per stage (100 / number of stages)."""
        return 100.0 / len(STAGE_ORDER)

    def mark_stage_running(self, stage_name: str) -> None:
        """Transition a stage to RUNNING and update timestamps."""
        now = _utc_now()
        stage = self.stages.setdefault(
            stage_name,
            StageState(name=stage_name),
        )
        stage.status = StageStatus.RUNNING
        stage.started_at = now
        self.current_stage = stage_name
        self.updated_at = now
        self._invalidate_metadata_cache()

    def mark_stage_completed(self, stage_name: str) -> None:
        """Transition a stage to COMPLETED and advance progress."""
        now = _utc_now()
        stage = self.stages.get(stage_name)
        if stage is not None:
            stage.status = StageStatus.COMPLETED
            stage.completed_at = now
        self.progress = min(
            self.progress + self.stage_progress_weight(),
            100.0,
        )
        self.updated_at = now
        self._invalidate_metadata_cache()

    def mark_stage_failed(self, stage_name: str, error: str) -> None:
        """Transition a stage to FAILED and halt the pipeline."""
        now = _utc_now()
        stage = self.stages.get(stage_name)
        if stage is not None:
            stage.status = StageStatus.FAILED
            stage.completed_at = now
            stage.error = error
        self.status = "failed"
        self.updated_at = now
        self._invalidate_metadata_cache()

    def completed_stages(self) -> list[str]:
        """Return names of stages that have completed successfully."""
        return [
            name
            for name, stage in self.stages.items()
            if stage.status == StageStatus.COMPLETED
        ]

    def next_pending_stage(self) -> str | None:
        """Return the first stage that hasn't completed yet."""
        completed = set(self.completed_stages())
        for stage_name in STAGE_ORDER:
            if stage_name not in completed:
                return stage_name
        return None

    def _invalidate_metadata_cache(self) -> None:
        """Clear cached metadata whenever the state changes."""
        self._metadata_cache = None

    def get_cached_metadata(self) -> dict[str, Any]:
        """Return cached metadata, recomputing only when state has changed since last call."""
        current_event_count = len(self.events)
        if self._metadata_cache is not None and current_event_count == self._last_known_event_count:
            return self._metadata_cache

        self._metadata_cache = {
            "papers_count": len(self.papers) if self.papers else 0,
            "evidence_count": len(self.evidence) if self.evidence else 0,
            "contradictions_count": len(self.contradictions) if self.contradictions else 0,
            "novelty_score": (
                self.novelty_analysis.get("novelty_score")
                if self.novelty_analysis
                else None
            ),
            "current_agent": self.current_stage,
            "execution_time_ms": self._calculate_execution_time(),
            "stages": {
                name: {
                    "status": stage.status.value,
                    "label": STAGE_LABELS.get(name, name),
                }
                for name, stage in self.stages.items()
            },
        }
        self._last_known_event_count = current_event_count
        return self._metadata_cache

    def _calculate_execution_time(self) -> int:
        """Calculate total execution time in milliseconds from stage timestamps."""
        total = 0
        for stage in self.stages.values():
            if stage.started_at and stage.completed_at:
                diff = stage.completed_at - stage.started_at
                total += int(diff.total_seconds() * 1000)
        return total

    def get_new_events_since(self, last_index: int) -> tuple[list[dict[str, Any]], int]:
        """Return events appended since last_index, plus current event count."""
        current_count = len(self.events)
        if last_index >= current_count:
            return [], current_count
        return self.events[last_index:], current_count