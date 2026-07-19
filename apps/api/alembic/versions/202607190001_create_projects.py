"""create projects table

Purpose: Add persistent Project records for DiscoveryOS research sessions.
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# Purpose: Identify this migration and its position in the Alembic revision graph.
revision: str = "202607190001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Purpose: Create the projects table and lookup indexes."""
    op.create_table(
        "projects",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("research_goal", sa.Text(), nullable=False),
        sa.Column("domain", sa.String(length=120), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("owner_name", sa.String(length=160), nullable=True),
        sa.Column("metadata", sa.JSON(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_projects_domain", "projects", ["domain"])
    op.create_index("ix_projects_status", "projects", ["status"])
    op.create_index("ix_projects_title", "projects", ["title"])


def downgrade() -> None:
    """Purpose: Drop the projects table and its indexes."""
    op.drop_index("ix_projects_title", table_name="projects")
    op.drop_index("ix_projects_status", table_name="projects")
    op.drop_index("ix_projects_domain", table_name="projects")
    op.drop_table("projects")
