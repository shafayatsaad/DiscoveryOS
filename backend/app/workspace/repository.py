"""Purpose: Encapsulate SQLite CRUD operations for Discovery Workspaces."""

from typing import Any

from sqlmodel import Session, select

from app.workspace.schemas import TimelineEvent, Workspace, WorkspacePatch
from app.workspace.workspace import WorkspaceRecord, utc_now


class WorkspaceRepository:
    """Repository boundary for workspace persistence and artifact mutation."""

    def __init__(self, session: Session) -> None:
        self._session = session

    def get_by_project_id(self, project_id: str) -> WorkspaceRecord | None:
        """Return the workspace owned by a project if it already exists."""

        statement = select(WorkspaceRecord).where(WorkspaceRecord.project_id == project_id)
        return self._session.exec(statement).first()

    def get_or_create(self, project_id: str, research_goal: str | None = None) -> WorkspaceRecord:
        """Return one workspace per project, creating it on first access."""

        record = self.get_by_project_id(project_id)
        if record is not None:
            return record

        record = WorkspaceRecord(
            project_id=project_id,
            research_goal=research_goal,
            timeline_events=[
                TimelineEvent(
                    event_type="workspace.created",
                    message="Discovery Workspace created.",
                ).model_dump(mode="json")
            ],
        )
        self._session.add(record)
        self._session.commit()
        self._session.refresh(record)
        return record

    def update(self, record: WorkspaceRecord, patch: WorkspacePatch) -> WorkspaceRecord:
        """Apply a partial update to a workspace record."""

        for field_name, value in patch.model_dump(exclude_unset=True).items():
            setattr(record, field_name, value)
        record.updated_at = utc_now()
        self._session.add(record)
        self._session.commit()
        self._session.refresh(record)
        return record

    def append_artifact(
        self,
        record: WorkspaceRecord,
        field_name: str,
        artifact: dict[str, Any],
        event: TimelineEvent,
    ) -> WorkspaceRecord:
        """Append an artifact and matching timeline event to list-like workspace fields."""

        artifacts = list(getattr(record, field_name) or [])
        artifacts.append(artifact)
        setattr(record, field_name, artifacts)

        events = list(record.timeline_events or [])
        events.append(event.model_dump(mode="json"))
        record.timeline_events = events
        record.updated_at = utc_now()

        self._session.add(record)
        self._session.commit()
        self._session.refresh(record)
        return record

    def to_schema(self, record: WorkspaceRecord) -> Workspace:
        """Convert a database row into the public Workspace schema."""

        return Workspace.model_validate(record.model_dump())
