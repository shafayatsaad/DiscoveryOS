"""Purpose: Define FastAPI startup and shutdown lifecycle hooks for backend resources."""

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import get_settings
from app.database.session import create_database_and_tables
from app.logging_config import configure_logging

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Prepare shared infrastructure and release it cleanly when the app stops."""

    settings = get_settings()
    configure_logging(settings)
    create_database_and_tables()
    logger.info("DiscoveryOS backend started", extra={"environment": settings.environment})
    yield
    logger.info("DiscoveryOS backend stopped")
