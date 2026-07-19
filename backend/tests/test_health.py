"""Purpose: Verify that the FastAPI app exposes healthy startup and route wiring."""

from fastapi.testclient import TestClient

from app.main import create_app


def test_health_endpoint() -> None:
    """The unversioned health endpoint should return an ok status."""

    client = TestClient(create_app())
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
