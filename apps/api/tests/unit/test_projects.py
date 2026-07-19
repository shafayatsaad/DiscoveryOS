"""Purpose: Verify Project repository, service, and API behavior."""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from discoveryos_api.api.errors import ApplicationError
from discoveryos_api.repositories.projects import ProjectRepository
from discoveryos_api.schemas.projects import ProjectCreate
from discoveryos_api.services.projects import ProjectService


def _project_payload() -> dict:
    """Purpose: Provide a representative Project creation payload for tests."""
    return {
        "title": "Metformin and neuroinflammation",
        "description": "Investigate evidence-backed links in Alzheimer's disease.",
        "status": "active",
        "research_goal": "Find hypotheses connecting metformin and neuroinflammation.",
        "domain": "biomedical research",
        "owner_name": "Ada Lovelace",
        "metadata": {"source": "unit-test"},
    }


@pytest.mark.asyncio
async def test_project_repository_creates_and_reads_project(db_session: AsyncSession) -> None:
    """Purpose: Confirm repository persistence preserves all Project fields."""
    repository = ProjectRepository(db_session)
    project = await repository.create(ProjectCreate(**_project_payload()))

    fetched = await repository.get(project.id)

    assert fetched is not None
    assert fetched.id == project.id
    assert fetched.title == "Metformin and neuroinflammation"
    assert fetched.project_metadata == {"source": "unit-test"}


@pytest.mark.asyncio
async def test_project_service_raises_not_found(db_session: AsyncSession) -> None:
    """Purpose: Confirm service converts missing records into structured application errors."""
    service = ProjectService(ProjectRepository(db_session))

    with pytest.raises(ApplicationError) as exc_info:
        await service.get_project("missing-project")

    assert exc_info.value.code == "PROJECT_NOT_FOUND"
    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_create_list_get_and_delete_project_endpoints(api_client: AsyncClient) -> None:
    """Purpose: Verify the full Project router lifecycle through HTTP endpoints."""
    create_response = await api_client.post("/api/v1/projects", json=_project_payload())

    assert create_response.status_code == 201
    created = create_response.json()["data"]
    assert created["title"] == "Metformin and neuroinflammation"
    assert created["metadata"] == {"source": "unit-test"}

    project_id = created["id"]

    list_response = await api_client.get("/api/v1/projects")
    assert list_response.status_code == 200
    assert [project["id"] for project in list_response.json()["data"]] == [project_id]

    get_response = await api_client.get(f"/api/v1/projects/{project_id}")
    assert get_response.status_code == 200
    assert get_response.json()["data"]["research_goal"] == _project_payload()["research_goal"]

    delete_response = await api_client.delete(f"/api/v1/projects/{project_id}")
    assert delete_response.status_code == 204
    assert delete_response.content == b""

    missing_response = await api_client.get(f"/api/v1/projects/{project_id}")
    assert missing_response.status_code == 404
    assert missing_response.json()["error"]["code"] == "PROJECT_NOT_FOUND"
