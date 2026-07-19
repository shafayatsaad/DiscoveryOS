"""Purpose: Provide database session dependencies for future route handlers."""

from collections.abc import AsyncIterator

from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession


async def get_db_session(request: Request) -> AsyncIterator[AsyncSession]:
    """Purpose: Yield one async SQLAlchemy session for a request scope."""
    async with request.app.state.db.session() as session:
        yield session
