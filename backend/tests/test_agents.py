"""Purpose: Verify that placeholder agents share a stable run(context) contract."""

from fastapi.testclient import TestClient

from app.main import create_app


def test_agents_are_listed() -> None:
    """The backend should expose the registered scientific agent boundaries."""

    client = TestClient(create_app())
    response = client.get("/api/v1/agents")

    assert response.status_code == 200
    assert {agent["name"] for agent in response.json()} == {
        "planner",
        "retriever",
        "extractor",
        "verifier",
        "contradiction",
        "hypothesis",
        "novelty",
        "experiment",
        "report",
    }


def test_placeholder_agent_run_returns_agent_result() -> None:
    """Running a placeholder agent should return the AgentResult envelope."""

    client = TestClient(create_app())
    response = client.post(
        "/api/v1/agents/planner/run",
        json={"project_id": "project_demo", "research_goal": "Find evidence-backed hypotheses."},
    )

    assert response.status_code == 200
    assert response.json()["agent_name"] == "planner"
    assert response.json()["status"] == "completed"
    assert response.json()["outputs"]["research_domain"] == "General Science"
