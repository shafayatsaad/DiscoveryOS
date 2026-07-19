"""Purpose: Test contradiction detection from the public test suite."""

from datetime import UTC, datetime

import pytest

from app.agents.contradiction.detector import ContradictionAgent
from app.workspace.schemas import Workspace


@pytest.mark.asyncio
async def test_contradiction_detection_requires_cited_papers() -> None:
    """Detected contradictions should cite at least two papers."""

    workspace = Workspace(
        id="workspace_contradiction_public",
        project_id="project_contradiction_public",
        extracted_evidence=[
            {
                "paper_title": "Paper A",
                "source": "OpenAlex",
                "claims": [{"claim": "Method X improves benchmark performance."}],
            },
            {
                "paper_title": "Paper B",
                "source": "arXiv",
                "claims": [{"claim": "Method X did not improve benchmark performance."}],
            },
        ],
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )

    analysis = await ContradictionAgent().run(workspace)

    assert analysis.contradictions
    assert len(analysis.contradictions[0].supporting_papers) == 2
