"""Purpose: Define async startup and shutdown lifecycle hooks for the backend."""

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import Settings

logger = logging.getLogger(__name__)


def build_lifespan(settings: Settings):
    """Purpose: Bind runtime settings to FastAPI's async lifespan context."""

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        """Purpose: Run infrastructure-only startup and shutdown tasks."""
        app.state.settings = settings
        logger.info(
            "Starting %s in %s mode.",
            settings.app_name,
            settings.environment,
        )
        yield
        logger.info("Shutting down %s.", settings.app_name)

    return lifespan
