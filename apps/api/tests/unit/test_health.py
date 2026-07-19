"""Purpose: Verify the versioned health endpoint and infrastructure middleware."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_endpoint_returns_structured_response(api_client: AsyncClient) -> None:
    """Purpose: Confirm health responses use the shared success envelope."""
    response = await api_client.get("/api/v1/health", headers={"x-request-id": "test-request"})

    assert response.status_code == 200
    assert response.headers["x-request-id"] == "test-request"
    assert "x-process-time-ms" in response.headers
    assert response.json() == {
        "success": True,
        "data": {
            "status": "ok",
            "service": "DiscoveryOS API",
            "environment": "test",
            "version": "v1",
        },
        "meta": {
            "request_id": "test-request",
            "api_version": "v1",
        },
    }


@pytest.mark.asyncio
async def test_missing_route_returns_structured_error(api_client: AsyncClient) -> None:
    """Purpose: Confirm exception handlers normalize framework 404 errors."""
    response = await api_client.get("/api/v1/missing", headers={"x-request-id": "missing-route"})

    assert response.status_code == 404
    assert response.json()["success"] is False
    assert response.json()["error"]["code"] == "HTTP_ERROR"
    assert response.json()["meta"]["request_id"] == "missing-route"
