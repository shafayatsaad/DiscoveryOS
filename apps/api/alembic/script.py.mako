"""${message}

Purpose: Define one Alembic migration revision for the DiscoveryOS backend.
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


# Purpose: Identify this migration and its position in the Alembic revision graph.
revision: str = ${repr(up_revision)}
down_revision: str | None = ${repr(down_revision)}
branch_labels: str | Sequence[str] | None = ${repr(branch_labels)}
depends_on: str | Sequence[str] | None = ${repr(depends_on)}


def upgrade() -> None:
    """Purpose: Apply this migration."""
    pass


def downgrade() -> None:
    """Purpose: Revert this migration."""
    pass

