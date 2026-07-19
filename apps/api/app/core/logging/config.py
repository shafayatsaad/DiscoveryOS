"""Purpose: Configure process-wide logging for local and production environments."""

import logging


def configure_logging(log_level: str) -> None:
    """Purpose: Install a simple structured-enough logging baseline for the API."""
    normalized_level = getattr(logging, log_level.upper(), logging.INFO)
    logging.basicConfig(
        level=normalized_level,
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    )
    logging.getLogger("uvicorn").setLevel(normalized_level)
    logging.getLogger("uvicorn.error").setLevel(normalized_level)
    logging.getLogger("uvicorn.access").setLevel(normalized_level)
