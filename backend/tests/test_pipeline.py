"""Purpose: Integration-test the first Discovery Pipeline endpoint."""

from fastapi.testclient import TestClient

from app.agents.extractor.extractor import ExtractorAgent
from app.agents.extractor.schemas import PaperEvidence
from app.agents.planner.planner import PlannerAgent
from app.agents.retriever.retriever import RetrieverAgent
from app.agents.retriever.schemas import Paper
from app.api.dependencies import pipeline_service_dependency
from app.main import create_app
from app.services.pipeline_service import DiscoveryPipelineService


class FakeProvider:
    """Pipeline test provider that avoids external network calls."""

    name = "FakeSource"

    async def search(self, query: str, limit: int) -> list[Paper]:
        """Return a deterministic paper for integration tests."""

        return [
            Paper(
                title="Microplastics and neuroinflammation",
                authors=["A. Researcher"],
                year=2026,
                abstract="Microplastics are evaluated in relation to inflammatory markers.",
                doi="10.1000/pipeline",
                url="https://example.com/pipeline",
                source=self.name,
                keywords=["microplastics", "neuroinflammation"],
                citation_count=3,
            )
        ]


class FakeEvidenceClient:
    """Pipeline test extractor client that returns strict evidence."""

    async def extract(self, paper: Paper, research_goal: str, domain: str) -> PaperEvidence:
        """Return deterministic evidence for integration tests."""

        return PaperEvidence(
            paper_title=paper.title,
            source=paper.source,
            doi=paper.doi,
            claims=[
                {
                    "claim": "The paper evaluates inflammatory markers.",
                    "claim_type": "associational",
                    "support_level": "indirect",
                }
            ],
            methods=["abstract metadata review"],
            results=["inflammatory markers evaluated"],
            limitations=["full text not available"],
            confidence=0.7,
            key_entities=["microplastics", "inflammatory markers"],
            evidence_snippets=[
                {
                    "text": "Microplastics are evaluated in relation to inflammatory markers.",
                    "relevance": "high",
                }
            ],
        )


def test_pipeline_start_returns_plan_papers_and_evidence() -> None:
    """POST /pipeline/start should run the first typed pipeline slice."""

    app = create_app()

    def override_pipeline_service() -> DiscoveryPipelineService:
        return DiscoveryPipelineService(
            planner=PlannerAgent(),
            retriever=RetrieverAgent(providers=[FakeProvider()]),
            extractor=ExtractorAgent(client=FakeEvidenceClient()),
        )

    app.dependency_overrides[pipeline_service_dependency] = override_pipeline_service
    client = TestClient(app)

    response = client.post(
        "/api/v1/pipeline/start",
        json={"query": "Can microplastics contribute to Alzheimer's disease?"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "completed"
    assert payload["plan"]["research_domain"] == "Biomedical"
    assert payload["papers"][0]["source"] == "FakeSource"
    assert payload["evidence"][0]["confidence"] == 0.7
    assert "pipeline.completed" in payload["events"]
