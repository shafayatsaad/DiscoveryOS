"""Purpose: Verify Research Job repository, service, and API behavior."""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from discoveryos_api.api.errors import ApplicationError
from discoveryos_api.repositories.projects import ProjectRepository
from discoveryos_api.repositories.research_jobs import ResearchJobRepository
from discoveryos_api.schemas.projects import ProjectCreate
from discoveryos_api.schemas.research_jobs import ResearchJobCreate, ResearchJobUpdate
from discoveryos_api.services.research_jobs import ResearchJobService


def _project_payload() -> dict:
    """Purpose: Provide a valid Project payload for job tests."""
    return {
        "title": "Autonomous literature review",
        "description": "Project used to test research job infrastructure.",
        "research_goal": "Map evidence-backed hypotheses from a narrow literature corpus.",
        "domain": "systems biology",
        "owner_name": "Grace Hopper",
        "metadata": {"test": "research-jobs"},
    }


async def _create_project(db_session: AsyncSession) -> str:
    """Purpose: Persist a project directly for repository and service tests."""
    project = await ProjectRepository(db_session).create(ProjectCreate(**_project_payload()))
    return project.id


@pytest.mark.asyncio
async def test_research_job_repository_creates_and_updates_job(
    db_session: AsyncSession,
) -> None:
    """Purpose: Confirm repository persistence supports future job state updates."""
    project_id = await _create_project(db_session)
    repository = ResearchJobRepository(db_session)

    job = await repository.create(
        project_id,
        ResearchJobCreate(current_step="planning", progress=10.0, logs=["job accepted"]),
    )
    updated = await repository.update(
        job,
        ResearchJobUpdate(status="running", progress=50.0, logs=["job accepted", "step changed"]),
    )

    assert updated.project_id == project_id
    assert updated.status == "running"
    assert updated.progress == 50.0
    assert updated.logs == ["job accepted", "step changed"]


@pytest.mark.asyncio
async def test_research_job_service_requires_existing_project(
    db_session: AsyncSession,
) -> None:
    """Purpose: Confirm project-scoped job creation fails for missing projects."""
    service = ResearchJobService(
        job_repository=ResearchJobRepository(db_session),
        project_repository=ProjectRepository(db_session),
    )

    with pytest.raises(ApplicationError) as exc_info:
        await service.create_job("missing-project", ResearchJobCreate())

    assert exc_info.value.code == "PROJECT_NOT_FOUND"
    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_research_job_service_raises_not_found_for_missing_job(
    db_session: AsyncSession,
) -> None:
    """Purpose: Confirm missing jobs become structured service errors."""
    service = ResearchJobService(
        job_repository=ResearchJobRepository(db_session),
        project_repository=ProjectRepository(db_session),
    )

    with pytest.raises(ApplicationError) as exc_info:
        await service.get_job("missing-job")

    assert exc_info.value.code == "RESEARCH_JOB_NOT_FOUND"
    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_create_list_get_and_patch_research_job_endpoints(
    api_client: AsyncClient,
) -> None:
    """Purpose: Verify the full Research Job router lifecycle through HTTP endpoints."""
    project_response = await api_client.post("/api/v1/projects", json=_project_payload())
    project_id = project_response.json()["data"]["id"]

    create_response = await api_client.post(f"/api/v1/projects/{project_id}/jobs")

    assert create_response.status_code == 201
    created = create_response.json()["data"]
    assert created["project_id"] == project_id
    assert created["status"] == "pending"
    assert created["progress"] == 0.0
    assert created["logs"] == []

    job_id = created["id"]

    patch_response = await api_client.patch(
        f"/api/v1/jobs/{job_id}",
        json={
            "status": "running",
            "current_step": "evidence_extraction",
            "progress": 42.5,
            "logs": ["retrieval finished", "extracting evidence"],
        },
    )
    assert patch_response.status_code == 200
    patched = patch_response.json()["data"]
    assert patched["status"] == "running"
    assert patched["current_step"] == "evidence_extraction"
    assert patched["progress"] == 42.5
    assert patched["logs"] == ["retrieval finished", "extracting evidence"]

    get_response = await api_client.get(f"/api/v1/jobs/{job_id}")
    assert get_response.status_code == 200
    assert get_response.json()["data"]["id"] == job_id

    list_response = await api_client.get(f"/api/v1/projects/{project_id}/jobs")
    assert list_response.status_code == 200
    assert [job["id"] for job in list_response.json()["data"]] == [job_id]


@pytest.mark.asyncio
async def test_research_job_endpoints_return_not_found_errors(api_client: AsyncClient) -> None:
    """Purpose: Confirm job endpoints return stable errors for missing resources."""
    create_response = await api_client.post("/api/v1/projects/missing-project/jobs")
    get_response = await api_client.get("/api/v1/jobs/missing-job")
    patch_response = await api_client.patch("/api/v1/jobs/missing-job", json={"progress": 10})

    assert create_response.status_code == 404
    assert create_response.json()["error"]["code"] == "PROJECT_NOT_FOUND"
    assert get_response.status_code == 404
    assert get_response.json()["error"]["code"] == "RESEARCH_JOB_NOT_FOUND"
    assert patch_response.status_code == 404
    assert patch_response.json()["error"]["code"] == "RESEARCH_JOB_NOT_FOUND"
