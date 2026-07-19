"""Purpose: Test Retriever Agent provider orchestration from the public test suite."""

import pytest

from app.agents.planner.schemas import ResearchPlan, SearchQuery
from app.agents.retriever.retriever import RetrieverAgent
from app.agents.retriever.schemas import Paper


class FakeProvider:
    """Deterministic literature provider used for unit tests."""

    name = "FakeSource"

    async def search(self, query: str, limit: int) -> list[Paper]:
        """Return duplicate DOI records so retriever deduplication is tested."""

        return [
            Paper(
                title=f"{query} paper",
                authors=["Grace Hopper"],
                year=2025,
                abstract="A structured abstract.",
                doi="10.0000/shared",
                url="https://example.com",
                source=self.name,
                keywords=query.split(),
                citation_count=4,
            )
        ]


@pytest.mark.asyncio
async def test_retriever_deduplicates_provider_results() -> None:
    """RetrieverAgent should deduplicate papers across queries and providers."""

    plan = ResearchPlan(
        research_goal="Test goal",
        research_domain="General Science",
        objectives=["Retrieve papers."],
        sub_problems=["Search metadata."],
        keywords=["test"],
        search_queries=[
            SearchQuery(query="test query one", rationale="test"),
            SearchQuery(query="test query two", rationale="test"),
        ],
        recommended_data_sources=[],
        paper_sources=[],
        potential_risks=[],
        expected_deliverables=[],
    )

    collection = await RetrieverAgent(providers=[FakeProvider()]).run(plan)

    assert collection.query_count == 2
    assert collection.provider_count == 1
    assert len(collection.papers) == 1
    assert collection.sources == ["FakeSource"]
