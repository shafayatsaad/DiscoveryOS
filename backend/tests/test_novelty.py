"""Purpose: Test novelty analysis from the public test suite."""

from datetime import UTC, datetime

import pytest

from app.agents.novelty.analyzer import NoveltyAgent
from app.workspace.schemas import Workspace


@pytest.mark.asyncio
async def test_novelty_analysis_is_an_estimate() -> None:
    """Novelty analysis should classify coverage without claiming true novelty."""

    workspace = Workspace(
        id="workspace_novelty_public",
        project_id="project_novelty_public",
        retrieved_papers=[{"title": "Paper", "source": "Crossref"}],
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )

    analysis = await NoveltyAgent().run(workspace)

    assert analysis.novelty_score > 0
    assert "not claimed as true novelty" in analysis.disclaimer
