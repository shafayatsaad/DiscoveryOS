"""Purpose: Define the declarative SQLAlchemy base shared by future persistence models."""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Purpose: Provide SQLAlchemy metadata for Alembic without defining business tables."""
