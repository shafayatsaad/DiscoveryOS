"""Purpose: Configure process-wide logging before the FastAPI app starts serving requests."""

import logging

from app.config import Settings


def configure_logging(settings: Settings) -> None:
    """Set a consistent backend log format suitable for local development and demos."""

    logging.basicConfig(
        level=settings.log_level.upper(),
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    )
