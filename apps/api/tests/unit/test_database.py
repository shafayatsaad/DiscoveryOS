"""Purpose: Verify async SQLAlchemy infrastructure without creating business tables."""

import pytest
from sqlalchemy import text

from discoveryos_api.core.config import Settings
from discoveryos_api.db.session import DatabaseSessionManager


@pytest.mark.asyncio
async def test_database_session_manager_executes_simple_query() -> None:
    """Purpose: Confirm the async database session boundary is usable by future services."""
    manager = DatabaseSessionManager(
        Settings(
            environment="test",
            database_url="sqlite+aiosqlite:///:memory:",
            log_level="WARNING",
        )
    )

    try:
        async with manager.session() as session:
            result = await session.execute(text("SELECT 1"))
            assert result.scalar_one() == 1
    finally:
        await manager.dispose()
