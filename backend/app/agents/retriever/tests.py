"""Purpose: Unit-test Retriever Agent provider orchestration without live HTTP calls."""

import pytest

from app.agents.planner.schemas import ResearchPlan, SearchQuery
from app.agents.retriever.retriever import RetrieverAgent
from app.agents.retriever.schemas import Paper


class FakeProvider:
    """Test provider that returns deterministic metadata."""

    name = "FakeSource"

    async def search(self, query: str, limit: int) -> list[Paper]:
        """Return one paper per query."""

        return [
            Paper(
                title=f"{query} evidence paper",
                authors=["Ada Lovelace"],
                year=2026,
                abstract="This abstract describes a method and result.",
                doi=f"10.0000/{query.replace(' ', '-')}",
                url="https://example.com/paper",
                source=self.name,
                keywords=query.split(),
                citation_count=7,
            )
        ]


@pytest.mark.asyncio
async def test_retriever_returns_deduplicated_collection() -> None:
    """RetrieverAgent should return a PaperCollection from modular providers."""

    plan = ResearchPlan(
        research_goal="Can microplastics contribute to Alzheimer's disease?",
        research_domain="Biomedical",
        objectives=["Retrieve literature."],
        sub_problems=["Search source metadata."],
        keywords=["microplastics", "alzheimer"],
        search_queries=[SearchQuery(query="microplastics alzheimer", rationale="test")],
        recommended_data_sources=["OpenAlex"],
        paper_sources=[],
        potential_risks=[],
        expected_deliverables=[],
    )

    collection = await RetrieverAgent(providers=[FakeProvider()]).run(plan)

    assert collection.query_count == 1
    assert collection.provider_count == 1
    assert collection.sources == ["FakeSource"]
    assert collection.papers[0].title == "microplastics alzheimer evidence paper"
