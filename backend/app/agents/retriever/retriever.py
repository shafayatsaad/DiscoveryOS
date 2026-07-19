"""Purpose: Implement the Retriever Agent and provider orchestration."""

import asyncio

from app.agents.base import BaseResearchAgent
from app.agents.planner.schemas import ResearchPlan
from app.agents.retriever.providers import ArxivProvider, CrossrefProvider, OpenAlexProvider
from app.agents.retriever.providers.base import LiteratureProvider
from app.agents.retriever.schemas import Paper, PaperCollection
from app.schemas.agent import AgentContext


class RetrieverAgent(BaseResearchAgent):
    """Retrieve scientific literature metadata from modular provider backends."""

    name = "retriever"
    description = "Retriever Agent searches scientific indexes and returns source metadata."

    def __init__(
        self,
        providers: list[LiteratureProvider] | None = None,
        per_query_limit: int = 3,
    ) -> None:
        self._providers = providers or [OpenAlexProvider(), CrossrefProvider(), ArxivProvider()]
        self._per_query_limit = per_query_limit

    async def run(self, plan: ResearchPlan | AgentContext) -> PaperCollection:
        """Search all configured providers using a ResearchPlan."""

        research_plan = self._normalize_plan(plan)
        queries = [search_query.query for search_query in research_plan.search_queries[:3]]
        provider_results = await asyncio.gather(
            *[
                self._search_provider(provider, query)
                for provider in self._providers
                for query in queries
            ],
            return_exceptions=True,
        )

        papers: list[Paper] = []
        for result in provider_results:
            if isinstance(result, Exception):
                continue
            papers.extend(result)

        deduplicated = self._deduplicate(papers)
        return PaperCollection(
            papers=deduplicated,
            query_count=len(queries),
            provider_count=len(self._providers),
            sources=sorted({paper.source for paper in deduplicated}),
        )

    def _normalize_plan(self, plan: ResearchPlan | AgentContext) -> ResearchPlan:
        """Accept a concrete ResearchPlan or a serialized plan from AgentContext."""

        if isinstance(plan, ResearchPlan):
            return plan
        candidate = plan.inputs.get("plan")
        if isinstance(candidate, ResearchPlan):
            return candidate
        if isinstance(candidate, dict):
            return ResearchPlan.model_validate(candidate)
        raise ValueError("RetrieverAgent requires a ResearchPlan.")

    async def _search_provider(self, provider: LiteratureProvider, query: str) -> list[Paper]:
        """Run one provider search behind an isolated failure boundary."""

        return await provider.search(query=query, limit=self._per_query_limit)

    def _deduplicate(self, papers: list[Paper]) -> list[Paper]:
        """Deduplicate papers by DOI first, falling back to normalized title."""

        seen: set[str] = set()
        deduplicated: list[Paper] = []
        for paper in papers:
            key = paper.doi or paper.title.lower().strip()
            if key in seen:
                continue
            seen.add(key)
            deduplicated.append(paper)
        return deduplicated
