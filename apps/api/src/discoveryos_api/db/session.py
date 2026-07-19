"""Purpose: Configure async SQLAlchemy engine and session management."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from discoveryos_api.core.config import Settings


class DatabaseSessionManager:
    """Purpose: Own the async SQLAlchemy engine and request-scoped session factory."""

    def __init__(self, settings: Settings) -> None:
        """Purpose: Create database infrastructure from environment-driven settings."""
        sqlite_path = settings.sqlite_database_path
        if sqlite_path is not None:
            sqlite_path.parent.mkdir(parents=True, exist_ok=True)

        self.engine: AsyncEngine = create_async_engine(
            settings.database_url,
            echo=settings.sqlalchemy_echo,
            pool_pre_ping=True,
        )
        self._session_factory = async_sessionmaker(
            bind=self.engine,
            expire_on_commit=False,
            autoflush=False,
        )

    @asynccontextmanager
    async def session(self) -> AsyncIterator[AsyncSession]:
        """Purpose: Yield an async session and close it reliably after use."""
        async with self._session_factory() as session:
            yield session

    async def dispose(self) -> None:
        """Purpose: Release database connections during application shutdown."""
        await self.engine.dispose()
