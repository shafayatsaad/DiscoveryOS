"""Purpose: Unit-test deterministic contradiction detection."""

from datetime import UTC, datetime

import pytest

from app.agents.contradiction.detector import ContradictionAgent
from app.workspace.schemas import Workspace


@pytest.mark.asyncio
async def test_contradiction_agent_cites_supporting_papers() -> None:
    """Contradictions should preserve citations to both supporting papers."""

    workspace = Workspace(
        id="workspace_contradiction",
        project_id="project_contradiction",
        extracted_evidence=[
            {
                "paper_title": "Paper A",
                "source": "Fake",
                "claims": [{"claim": "Method X improves performance significantly."}],
            },
            {
                "paper_title": "Paper B",
                "source": "Fake",
                "claims": [{"claim": "Method X did not improve performance."}],
            },
        ],
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )

    result = await ContradictionAgent().run(workspace)

    assert result.contradictions
    assert len(result.contradictions[0].supporting_papers) == 2
