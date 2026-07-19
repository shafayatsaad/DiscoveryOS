"""Purpose: Generate stable prefixed IDs for future workflow and artifact records."""

from uuid import uuid4


def prefixed_id(prefix: str) -> str:
    """Return a readable unique ID with a stable resource prefix."""

    return f"{prefix}_{uuid4().hex}"
