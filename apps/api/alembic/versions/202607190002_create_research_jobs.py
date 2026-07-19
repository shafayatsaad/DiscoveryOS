"""create research jobs table

Purpose: Add project-scoped infrastructure jobs for DiscoveryOS workflow execution state.
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# Purpose: Identify this migration and its position in the Alembic revision graph.
revision: str = "202607190002"
down_revision: str | None = "202607190001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Purpose: Create the research_jobs table and lookup indexes."""
    op.create_table(
        "research_jobs",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("project_id", sa.String(length=36), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("current_step", sa.String(length=120), nullable=True),
        sa.Column("progress", sa.Float(), nullable=False),
        sa.Column("logs", sa.JSON(), nullable=False),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_research_jobs_project_id", "research_jobs", ["project_id"])
    op.create_index("ix_research_jobs_status", "research_jobs", ["status"])


def downgrade() -> None:
    """Purpose: Drop the research_jobs table and its indexes."""
    op.drop_index("ix_research_jobs_status", table_name="research_jobs")
    op.drop_index("ix_research_jobs_project_id", table_name="research_jobs")
    op.drop_table("research_jobs")
