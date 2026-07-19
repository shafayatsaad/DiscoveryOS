"""Purpose: Verify DiscoveryOS Memory repositories, services, and API endpoints."""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from discoveryos_api.api.errors import ApplicationError
from discoveryos_api.repositories.memory import ResearchNoteRepository
from discoveryos_api.repositories.projects import ProjectRepository
from discoveryos_api.schemas.memory import ResearchNoteCreate
from discoveryos_api.schemas.projects import ProjectCreate
from discoveryos_api.services.memory import ResearchNoteService


def _project_payload() -> dict:
    """Purpose: Provide a valid Project payload for memory tests."""
    return {
        "title": "Memory-backed research workspace",
        "description": "Project used to test DiscoveryOS Memory.",
        "research_goal": "Persist notes, evidence, hypotheses, graph, and timeline.",
        "domain": "scientific infrastructure",
        "owner_name": "Katherine Johnson",
        "metadata": {"test": "memory"},
    }


async def _create_project(db_session: AsyncSession) -> str:
    """Purpose: Persist a project directly for repository and service tests."""
    project = await ProjectRepository(db_session).create(ProjectCreate(**_project_payload()))
    return project.id


@pytest.mark.asyncio
async def test_research_note_repository_persists_project_memory(
    db_session: AsyncSession,
) -> None:
    """Purpose: Confirm memory repositories store project-owned SQLite records."""
    project_id = await _create_project(db_session)
    repository = ResearchNoteRepository(db_session)

    note = await repository.create(
        project_id,
        ResearchNoteCreate(
            title="Initial note", content="Research memory starts here.", tags=["seed"]
        ),
    )
    fetched = await repository.get(note.id)
    listed = await repository.list_by_project(project_id)

    assert fetched is not None
    assert fetched.content == "Research memory starts here."
    assert listed[0].id == note.id


@pytest.mark.asyncio
async def test_memory_service_requires_existing_project(db_session: AsyncSession) -> None:
    """Purpose: Confirm project-owned memory cannot be created for missing projects."""
    service = ResearchNoteService(
        ResearchNoteRepository(db_session),
        ProjectRepository(db_session),
    )

    with pytest.raises(ApplicationError) as exc_info:
        await service.create(
            "missing-project",
            ResearchNoteCreate(title="Orphan note", content="No project owns this."),
        )

    assert exc_info.value.code == "PROJECT_NOT_FOUND"
    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_memory_service_raises_resource_specific_not_found(
    db_session: AsyncSession,
) -> None:
    """Purpose: Confirm missing memory items use stable resource-specific errors."""
    service = ResearchNoteService(
        ResearchNoteRepository(db_session),
        ProjectRepository(db_session),
    )

    with pytest.raises(ApplicationError) as exc_info:
        await service.get("missing-note")

    assert exc_info.value.code == "RESEARCH_NOTE_NOT_FOUND"
    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_memory_endpoints_store_all_project_memory_resources(
    api_client: AsyncClient,
) -> None:
    """Purpose: Verify create, list, and get endpoints for all DiscoveryOS Memory resources."""
    project_response = await api_client.post("/api/v1/projects", json=_project_payload())
    project_id = project_response.json()["data"]["id"]

    note_response = await api_client.post(
        f"/api/v1/projects/{project_id}/memory/notes",
        json={"title": "Reading notes", "content": "Track source context.", "tags": ["literature"]},
    )
    evidence_response = await api_client.post(
        f"/api/v1/projects/{project_id}/memory/evidence",
        json={
            "claim": "Evidence must remain linked to source context.",
            "source_title": "DiscoveryOS Architecture",
            "evidence_type": "design",
            "strength": "direct",
            "metadata": {"section": "memory"},
        },
    )
    hypothesis_response = await api_client.post(
        f"/api/v1/projects/{project_id}/memory/hypotheses",
        json={
            "statement": "Persistent memory improves research reproducibility.",
            "rationale": "Project state survives beyond a chat session.",
            "confidence": 0.7,
            "metadata": {"origin": "manual"},
        },
    )
    graph_response = await api_client.post(
        f"/api/v1/projects/{project_id}/memory/knowledge-graphs",
        json={
            "name": "Seed graph",
            "nodes": [{"id": "claim-1", "label": "Evidence"}],
            "edges": [],
            "metadata": {"version": 1},
        },
    )
    timeline_response = await api_client.post(
        f"/api/v1/projects/{project_id}/memory/timeline",
        json={
            "event_type": "memory_created",
            "title": "Memory initialized",
            "description": "The project memory layer was seeded.",
            "metadata": {"actor": "test"},
        },
    )

    created_items = [
        ("notes", "notes", note_response, "title", "Reading notes"),
        (
            "evidence",
            "evidence",
            evidence_response,
            "claim",
            "Evidence must remain linked to source context.",
        ),
        (
            "hypotheses",
            "hypotheses",
            hypothesis_response,
            "statement",
            "Persistent memory improves research reproducibility.",
        ),
        ("knowledge-graphs", "knowledge-graphs", graph_response, "name", "Seed graph"),
        ("timeline", "timeline", timeline_response, "title", "Memory initialized"),
    ]

    for collection_path, item_path, response, field_name, expected_value in created_items:
        assert response.status_code == 201
        item = response.json()["data"]
        assert item["project_id"] == project_id
        assert item[field_name] == expected_value

        list_response = await api_client.get(
            f"/api/v1/projects/{project_id}/memory/{collection_path}"
        )
        get_response = await api_client.get(f"/api/v1/memory/{item_path}/{item['id']}")

        assert list_response.status_code == 200
        assert [listed_item["id"] for listed_item in list_response.json()["data"]] == [item["id"]]
        assert get_response.status_code == 200
        assert get_response.json()["data"]["id"] == item["id"]


@pytest.mark.asyncio
async def test_memory_endpoints_return_not_found_errors(api_client: AsyncClient) -> None:
    """Purpose: Confirm memory endpoints return stable errors for missing resources."""
    create_response = await api_client.post(
        "/api/v1/projects/missing-project/memory/notes",
        json={"title": "Missing", "content": "No project."},
    )
    get_response = await api_client.get("/api/v1/memory/notes/missing-note")

    assert create_response.status_code == 404
    assert create_response.json()["error"]["code"] == "PROJECT_NOT_FOUND"
    assert get_response.status_code == 404
    assert get_response.json()["error"]["code"] == "RESEARCH_NOTE_NOT_FOUND"
