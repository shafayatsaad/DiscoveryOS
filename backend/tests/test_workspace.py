"""Purpose: Test Discovery Workspace persistence and API CRUD operations."""

from fastapi.testclient import TestClient

from app.main import create_app


def test_workspace_get_creates_one_workspace() -> None:
    """GET workspace should create the one workspace owned by a project."""

    project_id = "project_workspace_api"

    with TestClient(create_app()) as client:
        first = client.get(f"/api/v1/projects/{project_id}/workspace")
        second = client.get(f"/api/v1/projects/{project_id}/workspace")

    assert first.status_code == 200
    assert second.status_code == 200
    assert first.json()["id"] == second.json()["id"]


def test_workspace_patch_updates_memory() -> None:
    """PATCH workspace should persist mutable workspace memory."""

    project_id = "project_workspace_patch_api"

    with TestClient(create_app()) as client:
        response = client.patch(
            f"/api/v1/projects/{project_id}/workspace",
            json={
                "research_goal": "Map evidence for microplastics and neuroinflammation.",
                "research_notes": [{"text": "Check contradictory animal model findings."}],
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["research_goal"] == "Map evidence for microplastics and neuroinflammation."
    assert payload["research_notes"][0]["text"] == "Check contradictory animal model findings."
