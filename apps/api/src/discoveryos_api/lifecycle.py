"""Purpose: Define async startup and shutdown lifecycle hooks for backend infrastructure."""

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from discoveryos_api.core.config import Settings
from discoveryos_api.db.session import DatabaseSessionManager

logger = logging.getLogger(__name__)


def build_lifespan(settings: Settings):
    """Purpose: Bind infrastructure resources to the FastAPI lifespan context."""

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        """Purpose: Initialize and dispose infrastructure resources around app lifetime."""
        app.state.settings = settings
        app.state.db = DatabaseSessionManager(settings)

        logger.info("Starting %s in %s mode.", settings.app_name, settings.environment)
        yield

        await app.state.db.dispose()
        logger.info("Shutting down %s.", settings.app_name)

    return lifespan
