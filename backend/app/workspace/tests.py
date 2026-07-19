"""Purpose: Unit-test workspace service behavior with SQLite sessions."""

from sqlmodel import Session

from app.workspace.repository import WorkspaceRepository
from app.workspace.schemas import WorkspaceArtifactAppend, WorkspacePatch
from app.workspace.service import WorkspaceService


def test_workspace_is_created_once(session: Session) -> None:
    """Every project should resolve to exactly one workspace."""

    service = WorkspaceService(repository=WorkspaceRepository(session))

    first = service.get_workspace("project_workspace_test")
    second = service.get_workspace("project_workspace_test")

    assert first.id == second.id
    assert first.project_id == "project_workspace_test"


def test_workspace_can_patch_and_append_artifacts(session: Session) -> None:
    """Future agents should be able to append artifacts through a stable API."""

    service = WorkspaceService(repository=WorkspaceRepository(session))
    workspace = service.update_workspace(
        "project_patch_test",
        WorkspacePatch(research_goal="Map evidence for a scientific question."),
    )
    workspace = service.append_artifact(
        "project_patch_test",
        WorkspaceArtifactAppend(
            artifact_kind="research_notes",
            artifact={"note": "Important evidence gap."},
            event_message="Research note added.",
        ),
    )

    assert workspace.research_goal == "Map evidence for a scientific question."
    assert workspace.research_notes[-1]["note"] == "Important evidence gap."
