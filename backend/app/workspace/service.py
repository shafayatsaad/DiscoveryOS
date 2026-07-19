"""Purpose: Provide workspace use cases for routes and future agent orchestration."""

from typing import Any

from app.workspace.repository import WorkspaceRepository
from app.workspace.schemas import (
    ArtifactKind,
    TimelineEvent,
    Workspace,
    WorkspaceArtifactAppend,
    WorkspacePatch,
)

APPEND_FIELDS: set[ArtifactKind] = {
    "retrieved_papers",
    "extracted_evidence",
    "hypotheses",
    "research_notes",
    "timeline_events",
    "generated_reports",
    "contradictions",
    "suggested_experiments",
}


class WorkspaceService:
    """Coordinate workspace CRUD and generic artifact attachment."""

    def __init__(self, repository: WorkspaceRepository) -> None:
        self._repository = repository

    def get_workspace(self, project_id: str) -> Workspace:
        """Return the one workspace owned by a project, creating it if needed."""

        return self._repository.to_schema(self._repository.get_or_create(project_id=project_id))

    def update_workspace(self, project_id: str, patch: WorkspacePatch) -> Workspace:
        """Patch a workspace while preserving its stable identity."""

        record = self._repository.get_or_create(
            project_id=project_id,
            research_goal=patch.research_goal,
        )
        return self._repository.to_schema(self._repository.update(record=record, patch=patch))

    def append_artifact(self, project_id: str, request: WorkspaceArtifactAppend) -> Workspace:
        """Append an artifact through a stable generic extension point."""

        record = self._repository.get_or_create(project_id=project_id)
        if request.artifact_kind not in APPEND_FIELDS:
            patch = WorkspacePatch(**{request.artifact_kind: request.artifact})
            return self._repository.to_schema(self._repository.update(record=record, patch=patch))

        event = TimelineEvent(
            event_type=f"{request.artifact_kind}.appended",
            message=request.event_message,
            metadata={"artifact_kind": request.artifact_kind},
        )
        return self._repository.to_schema(
            self._repository.append_artifact(
                record=record,
                field_name=request.artifact_kind,
                artifact=request.artifact,
                event=event,
            )
        )

    def replace_artifact(
        self,
        project_id: str,
        field_name: str,
        value: dict[str, Any] | list[dict[str, Any]] | str | None,
        message: str,
    ) -> Workspace:
        """Replace a workspace artifact and add a timeline event for observability."""

        record = self._repository.get_or_create(project_id=project_id)
        events = list(record.timeline_events or [])
        events.append(
            TimelineEvent(
                event_type=f"{field_name}.updated",
                message=message,
            ).model_dump(mode="json")
        )
        patch = WorkspacePatch(**{field_name: value}, timeline_events=events)
        return self._repository.to_schema(self._repository.update(record=record, patch=patch))
