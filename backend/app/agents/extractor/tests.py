"""Purpose: Unit-test Evidence Extraction Agent without live OpenAI calls."""

import pytest

from app.agents.extractor.extractor import ExtractorAgent
from app.agents.extractor.schemas import EvidenceExtractionRequest, PaperEvidence
from app.agents.retriever.schemas import Paper


class FakeEvidenceClient:
    """Test extractor client that mimics validated structured output."""

    async def extract(self, paper: Paper, research_goal: str, domain: str) -> PaperEvidence:
        """Return deterministic evidence for one paper."""

        return PaperEvidence(
            paper_title=paper.title,
            source=paper.source,
            doi=paper.doi,
            claims=[
                {
                    "claim": "The abstract reports a measurable association.",
                    "claim_type": "associational",
                    "support_level": "indirect",
                }
            ],
            methods=["metadata-only test method"],
            results=["structured result"],
            limitations=["test limitation"],
            confidence=0.8,
            key_entities=["microplastics"],
            evidence_snippets=[{"text": "structured result", "relevance": "high"}],
        )


@pytest.mark.asyncio
async def test_extractor_returns_strict_evidence_collection() -> None:
    """ExtractorAgent should return validated evidence records."""

    paper = Paper(
        title="Microplastics and neuroinflammation",
        authors=["A. Researcher"],
        year=2026,
        abstract="The abstract reports a measurable association.",
        doi="10.1000/example",
        url="https://example.com",
        source="FakeSource",
        keywords=["microplastics"],
        citation_count=1,
    )
    agent = ExtractorAgent(client=FakeEvidenceClient())
    result = await agent.run(
        EvidenceExtractionRequest(
            research_goal="Can microplastics contribute to Alzheimer's disease?",
            domain="Biomedical",
            papers=[paper],
        )
    )

    assert result.extracted_count == 1
    assert result.evidence[0].confidence == 0.8
    assert result.evidence[0].claims[0].support_level == "indirect"
