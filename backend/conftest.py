"""Purpose: Provide shared backend test fixtures for database-backed components."""

import pytest
from sqlmodel import Session

from app.database.session import create_database_and_tables, engine


@pytest.fixture
def session() -> Session:
    """Return a SQLModel session after ensuring tables exist."""

    create_database_and_tables()
    with Session(engine) as database_session:
        yield database_session
