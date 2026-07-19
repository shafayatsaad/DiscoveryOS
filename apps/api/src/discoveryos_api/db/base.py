"""Purpose: Define the declarative SQLAlchemy base shared by persistence models."""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Purpose: Provide SQLAlchemy metadata for Alembic and database table creation."""


# Purpose: Import models after Base is defined so Alembic can discover table metadata.
from discoveryos_api.models.project import Project  # noqa: E402, F401
from discoveryos_api.models.research_job import ResearchJob  # noqa: E402, F401
