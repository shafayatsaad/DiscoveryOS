"""Purpose: Configure reusable pytest fixtures for the FastAPI backend."""

import pytest
from app.core.config import Settings
from app.main import create_app
from httpx import ASGITransport, AsyncClient


@pytest.fixture
def test_settings() -> Settings:
    """Purpose: Provide deterministic settings for infrastructure tests."""
    return Settings(
        environment="test",
        debug=True,
        cors_origins=["http://testserver"],
        log_level="WARNING",
    )


@pytest.fixture
async def api_client(test_settings: Settings):
    """Purpose: Create an async HTTP client bound to the in-memory ASGI app."""
    app = create_app(test_settings)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client
