"""Purpose: Expose database infrastructure primitives without domain models."""

from discoveryos_api.db.base import Base
from discoveryos_api.db.session import DatabaseSessionManager

__all__ = ["Base", "DatabaseSessionManager"]
