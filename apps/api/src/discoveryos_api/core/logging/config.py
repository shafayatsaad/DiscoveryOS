"""Purpose: Configure process-wide logging for local and production environments."""

import logging


def configure_logging(log_level: str) -> None:
    """Purpose: Install a consistent logging baseline for the API process."""
    normalized_level = getattr(logging, log_level.upper(), logging.INFO)
    logging.basicConfig(
        level=normalized_level,
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
        force=True,
    )
    logging.getLogger("uvicorn").setLevel(normalized_level)
    logging.getLogger("uvicorn.error").setLevel(normalized_level)
    logging.getLogger("uvicorn.access").setLevel(normalized_level)
