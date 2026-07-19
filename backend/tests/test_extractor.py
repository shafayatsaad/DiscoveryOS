"""Purpose: Test Evidence Extraction Agent from the public test suite."""

import pytest

from app.agents.extractor.extractor import ExtractorAgent
from app.agents.extractor.schemas import EvidenceExtractionRequest, PaperEvidence
from app.agents.retriever.schemas import Paper


class FakeEvidenceClient:
    """Deterministic evidence client used to avoid live OpenAI calls in tests."""

    async def extract(self, paper: Paper, research_goal: str, domain: str) -> PaperEvidence:
        """Return a strict PaperEvidence object."""

        return PaperEvidence(
            paper_title=paper.title,
            source=paper.source,
            doi=paper.doi,
            claims=[
                {
                    "claim": "The abstract contains a testable relationship.",
                    "claim_type": "associational",
                    "support_level": "indirect",
                }
            ],
            methods=["abstract review"],
            results=["relationship described"],
            limitations=["unit test fixture"],
            confidence=0.75,
            key_entities=["relationship"],
            evidence_snippets=[{"text": "relationship described", "relevance": "high"}],
        )


@pytest.mark.asyncio
async def test_extractor_returns_evidence_collection() -> None:
    """ExtractorAgent should return strict structured evidence."""

    paper = Paper(
        title="Test paper",
        authors=["Researcher"],
        year=2026,
        abstract="The abstract contains a testable relationship.",
        doi="10.0000/extractor",
        url="https://example.com",
        source="FakeSource",
        keywords=["relationship"],
        citation_count=2,
    )

    evidence = await ExtractorAgent(client=FakeEvidenceClient()).run(
        EvidenceExtractionRequest(
            research_goal="Test goal",
            domain="General Science",
            papers=[paper],
        )
    )

    assert evidence.extracted_count == 1
    assert evidence.evidence[0].claims[0].claim_type == "associational"
