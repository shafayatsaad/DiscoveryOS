"""Purpose: Verify the demo pipeline API contract used by the frontend dashboard."""

import pytest
from httpx import ASGITransport, AsyncClient

from discoveryos_api.core.config import Settings
from discoveryos_api.db.base import Base
from discoveryos_api.main import create_app
from discoveryos_api.models.project import Project

PRIMARY_FRONTEND_PROJECT_ID = "polymer-electrolyte-discovery"


@pytest.mark.asyncio
async def test_demo_pipeline_starts_for_frontend_project_id(test_settings: Settings) -> None:
    """Purpose: Ensure the dashboard run button can start the backend demo pipeline."""
    app = create_app(test_settings)
    async with app.router.lifespan_context(app):
        async with app.state.db.engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)

        async with app.state.db.session() as session:
            session.add(
                Project(
                    id=PRIMARY_FRONTEND_PROJECT_ID,
                    title="Solid-State Polymer Electrolytes",
                    description="Frontend-aligned demo project.",
                    status="active",
                    research_goal="Find polymer electrolyte candidates.",
                    domain="materials science",
                    owner_name="DiscoveryOS Demo",
                    project_metadata={"frontend_id": PRIMARY_FRONTEND_PROJECT_ID},
                )
            )
            await session.commit()

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as client:
            response = await client.post(
                f"/api/v1/projects/{PRIMARY_FRONTEND_PROJECT_ID}/run",
                json={"query": "Find polymer electrolyte candidates"},
            )

        async with app.state.db.engine.begin() as connection:
            await connection.run_sync(Base.metadata.drop_all)

    assert response.status_code == 202
    body = response.json()
    assert body["project_id"] == PRIMARY_FRONTEND_PROJECT_ID
    assert body["status"] == "running"
    assert body["current_stage"] == "planner"


@pytest.mark.asyncio
async def test_demo_pipeline_requires_query(api_client: AsyncClient) -> None:
    """Purpose: Keep the run endpoint from accepting empty research goals."""
    await api_client.post(
        "/api/v1/projects",
        json={
            "title": "Solid-State Polymer Electrolytes",
            "research_goal": "Find polymer electrolyte candidates.",
        },
    )
    projects = await api_client.get("/api/v1/projects")
    project_id = projects.json()["data"][0]["id"]

    response = await api_client.post(f"/api/v1/projects/{project_id}/run", json={"query": ""})

    assert response.status_code == 400
