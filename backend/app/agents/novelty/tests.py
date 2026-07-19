"""Purpose: Unit-test deterministic novelty analysis."""

from datetime import UTC, datetime

import pytest

from app.agents.novelty.analyzer import NoveltyAgent
from app.workspace.schemas import Workspace


@pytest.mark.asyncio
async def test_novelty_agent_returns_careful_estimate() -> None:
    """Novelty analysis should estimate corpus coverage without claiming proof."""

    workspace = Workspace(
        id="workspace_novelty",
        project_id="project_novelty",
        retrieved_papers=[{"title": "Sparse paper", "source": "Fake"}],
        extracted_evidence=[],
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )

    result = await NoveltyAgent().run(workspace)

    assert result.category == "Potential Research Gap"
    assert "not claimed as true novelty" in result.disclaimer
