"""create project memory tables

Purpose: Add SQLite-backed DiscoveryOS Memory resources owned by Projects.
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# Purpose: Identify this migration and its position in the Alembic revision graph.
revision: str = "202607190003"
down_revision: str | None = "202607190002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Purpose: Create project-owned memory tables and lookup indexes."""
    op.create_table(
        "research_notes",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("project_id", sa.String(length=36), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("tags", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_research_notes_project_id", "research_notes", ["project_id"])

    op.create_table(
        "evidence",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("project_id", sa.String(length=36), nullable=False),
        sa.Column("claim", sa.Text(), nullable=False),
        sa.Column("source_title", sa.String(length=300), nullable=True),
        sa.Column("source_url", sa.String(length=1000), nullable=True),
        sa.Column("citation", sa.Text(), nullable=True),
        sa.Column("evidence_type", sa.String(length=120), nullable=True),
        sa.Column("strength", sa.String(length=80), nullable=True),
        sa.Column("metadata", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_evidence_project_id", "evidence", ["project_id"])

    op.create_table(
        "hypotheses",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("project_id", sa.String(length=36), nullable=False),
        sa.Column("statement", sa.Text(), nullable=False),
        sa.Column("rationale", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=True),
        sa.Column("metadata", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_hypotheses_project_id", "hypotheses", ["project_id"])
    op.create_index("ix_hypotheses_status", "hypotheses", ["status"])

    op.create_table(
        "knowledge_graph_snapshots",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("project_id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("nodes", sa.JSON(), nullable=False),
        sa.Column("edges", sa.JSON(), nullable=False),
        sa.Column("metadata", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_knowledge_graph_snapshots_project_id",
        "knowledge_graph_snapshots",
        ["project_id"],
    )

    op.create_table(
        "timeline_events",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("project_id", sa.String(length=36), nullable=False),
        sa.Column("event_type", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("occurred_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("metadata", sa.JSON(), nullable=False),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_timeline_events_event_type", "timeline_events", ["event_type"])
    op.create_index("ix_timeline_events_project_id", "timeline_events", ["project_id"])


def downgrade() -> None:
    """Purpose: Drop project-owned memory tables and indexes."""
    op.drop_index("ix_timeline_events_project_id", table_name="timeline_events")
    op.drop_index("ix_timeline_events_event_type", table_name="timeline_events")
    op.drop_table("timeline_events")

    op.drop_index(
        "ix_knowledge_graph_snapshots_project_id",
        table_name="knowledge_graph_snapshots",
    )
    op.drop_table("knowledge_graph_snapshots")

    op.drop_index("ix_hypotheses_status", table_name="hypotheses")
    op.drop_index("ix_hypotheses_project_id", table_name="hypotheses")
    op.drop_table("hypotheses")

    op.drop_index("ix_evidence_project_id", table_name="evidence")
    op.drop_table("evidence")

    op.drop_index("ix_research_notes_project_id", table_name="research_notes")
    op.drop_table("research_notes")
