"""Purpose: Define the SQLAlchemy Project model for persistent research sessions."""

from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy import JSON, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from discoveryos_api.db.base import Base


def utc_now() -> datetime:
    """Purpose: Provide timezone-aware timestamps for created and updated records."""
    return datetime.now(UTC)


class Project(Base):
    """Purpose: Persist one DiscoveryOS research session as a project."""

    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    title: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="active", index=True)
    research_goal: Mapped[str] = mapped_column(Text, nullable=False)
    domain: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
        nullable=False,
    )
    owner_name: Mapped[str | None] = mapped_column(String(160), nullable=True)
    project_metadata: Mapped[dict] = mapped_column("metadata", JSON, default=dict, nullable=False)
