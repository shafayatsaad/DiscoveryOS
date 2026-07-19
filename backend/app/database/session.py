"""Purpose: Configure the SQLModel engine and session dependency for SQLite persistence."""

from collections.abc import Generator
from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine

from app.config import get_settings


def _ensure_sqlite_parent(database_url: str) -> None:
    """Create the local SQLite folder before the engine opens the database file."""

    if not database_url.startswith("sqlite:///"):
        return
    database_path = database_url.replace("sqlite:///", "", 1)
    if database_path.startswith(":memory:"):
        return
    Path(database_path).parent.mkdir(parents=True, exist_ok=True)


def get_engine():
    """Return the SQLModel engine configured from environment settings."""

    settings = get_settings()
    _ensure_sqlite_parent(settings.database_url)
    connect_args = (
        {"check_same_thread": False}
        if settings.database_url.startswith("sqlite")
        else {}
    )
    return create_engine(settings.database_url, connect_args=connect_args)


engine = get_engine()


def create_database_and_tables() -> None:
    """Create currently registered SQLModel tables; no domain tables exist in this scaffold."""

    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Yield a SQLModel session for FastAPI dependency injection."""

    with Session(engine) as session:
        yield session
