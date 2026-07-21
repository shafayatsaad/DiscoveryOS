"""Purpose: Configure process-wide logging for local and production environments."""

import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path


def configure_logging(log_level: str, log_dir: str = "logs") -> None:
    """Purpose: Install a consistent logging baseline for the API process."""
    normalized_level = getattr(logging, log_level.upper(), logging.INFO)
    log_path = Path(log_dir)
    log_path.mkdir(parents=True, exist_ok=True)

    formatter = logging.Formatter("%(asctime)s %(levelname)s [%(name)s] %(message)s")
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)

    handlers: list[logging.Handler] = [stream_handler]
    for file_name in [
        "planner.log",
        "retriever.log",
        "orchestrator.log",
        "mcp.log",
        "openai.log",
    ]:
        handler = RotatingFileHandler(
            log_path / file_name,
            maxBytes=2_000_000,
            backupCount=3,
            encoding="utf-8",
        )
        handler.setFormatter(formatter)
        handlers.append(handler)

    logging.basicConfig(
        level=normalized_level,
        handlers=handlers,
        force=True,
    )
    logging.getLogger("uvicorn").setLevel(normalized_level)
    logging.getLogger("uvicorn.error").setLevel(normalized_level)
    logging.getLogger("uvicorn.access").setLevel(normalized_level)
