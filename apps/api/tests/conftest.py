"""Purpose: Configure reusable pytest fixtures for the FastAPI backend."""

import pytest
from httpx import ASGITransport, AsyncClient

from discoveryos_api.core.config import Settings
from discoveryos_api.db.base import Base
from discoveryos_api.db.session import DatabaseSessionManager
from discoveryos_api.main import create_app


@pytest.fixture
def test_settings(tmp_path) -> Settings:
    """Purpose: Provide deterministic settings for infrastructure tests."""
    database_path = tmp_path / "discoveryos-test.db"
    return Settings(
        environment="test",
        debug=True,
        cors_origins=["http://testserver"],
        database_url=f"sqlite+aiosqlite:///{database_path.as_posix()}",
        log_level="WARNING",
    )


@pytest.fixture
async def api_client(test_settings: Settings):
    """Purpose: Create an async HTTP client bound to the in-memory ASGI app."""
    app = create_app(test_settings)
    async with app.router.lifespan_context(app):
        async with app.state.db.engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as client:
            yield client

        async with app.state.db.engine.begin() as connection:
            await connection.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def db_session(test_settings: Settings):
    """Purpose: Provide an isolated async SQLAlchemy session for service and repository tests."""
    manager = DatabaseSessionManager(test_settings)
    async with manager.engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    try:
        async with manager.session() as session:
            yield session
    finally:
        async with manager.engine.begin() as connection:
            await connection.run_sync(Base.metadata.drop_all)
        await manager.dispose()
