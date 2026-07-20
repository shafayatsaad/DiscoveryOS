"""Purpose: Estimate literature coverage and research gaps using GPT-5 structured outputs."""

from typing import Protocol

from app.agents.base import BaseResearchAgent
from app.agents.novelty.prompts import (
    NOVELTY_PROMPT_VERSION,
    NOVELTY_SYSTEM_PROMPT,
    NOVELTY_TASK_PROMPT_TEMPLATE,
)
from app.agents.novelty.schemas import (
    NoveltyAnalysis,
    NoveltyAnalysisRequest,
    RelatedWork,
)
from app.agents.openai_adapter import OpenAIClient
from app.agents.prompt_templates import render_task_prompt
from app.config import Settings, get_settings
from app.graph.schemas import KnowledgeGraph
from app.schemas.agent import AgentContext
from app.workspace.schemas import Workspace


class NoveltyClient(Protocol):
    """Client boundary for novelty analysis implementations."""

    async def analyze(self, request: NoveltyAnalysisRequest) -> NoveltyAnalysis:
        """Return a structured novelty estimate."""


class OpenAINoveltyClient:
    """GPT-5 powered novelty analysis using the shared OpenAIClient."""

    def __init__(self, settings: Settings) -> None:
        self._client = OpenAIClient(
            settings=settings,
            system_prompt=NOVELTY_SYSTEM_PROMPT,
            prompt_version=NOVELTY_PROMPT_VERSION,
        )

    async def analyze(self, request: NoveltyAnalysisRequest) -> NoveltyAnalysis:
        """Analyze novelty using GPT-5 structured outputs."""
        user_content = render_task_prompt(
            NOVELTY_TASK_PROMPT_TEMPLATE,
            payload=request.model_dump_json(),
        )
        result = await self._client.parse(
            user_content=user_content,
            response_format=NoveltyAnalysis,
        )
        return result


class DeterministicNoveltyClient:
    """Local novelty estimator based on retrieved corpus density."""

    async def analyze(self, request: NoveltyAnalysisRequest) -> NoveltyAnalysis:
        """Estimate novelty from available artifact counts without external claims."""
        paper_count = len(request.workspace.retrieved_papers)
        evidence_count = len(request.workspace.extracted_evidence)
        contradiction_count = (
            len(request.contradictions.contradictions) if request.contradictions else 0
        )
        score = self._score(paper_count=paper_count, evidence_count=evidence_count)
        return NoveltyAnalysis(
            novelty_score=score,
            category=self._category(score),
            reasoning=[
                f"Retrieved corpus contains {paper_count} papers.",
                f"Evidence extraction produced {evidence_count} structured records.",
                f"Detected contradictions: {contradiction_count}.",
                "Estimate is limited to the retrieved literature snapshot.",
            ],
            related_work=[
                RelatedWork(
                    title=paper.get("title", "Untitled paper"),
                    source=paper.get("source"),
                    doi=paper.get("doi"),
                    relevance="Retrieved for the current research plan.",
                )
                for paper in request.workspace.retrieved_papers[:5]
            ],
            research_opportunities=[
                "Expand retrieval with domain-specific repositories.",
                "Compare mechanisms or methods across contradictory evidence.",
                "Prioritize hypotheses with evidence gaps and testable variables.",
            ],
        )

    def _score(self, paper_count: int, evidence_count: int) -> float:
        """Map corpus density to an estimated gap score."""
        density = paper_count + evidence_count
        if density >= 20:
            return 0.2
        if density >= 10:
            return 0.45
        if density >= 4:
            return 0.68
        return 0.85

    def _category(self, score: float) -> str:
        """Map novelty score to a careful qualitative category."""
        if score < 0.3:
            return "Well Studied"
        if score < 0.6:
            return "Moderately Explored"
        if score < 0.8:
            return "Underexplored"
        return "Potential Research Gap"


class NoveltyAgent(BaseResearchAgent):
    """Agent that estimates novelty from retrieved literature coverage.

    Uses GPT-5 via the shared OpenAIClient when OPENAI_API_KEY is set.
    Falls back to deterministic density-based estimation when no API key is available.
    """

    name = "novelty"
    description = "Novelty Agent estimates research-gap signals from retrieved evidence."

    def __init__(
        self,
        client: NoveltyClient | None = None,
        settings: Settings | None = None,
    ) -> None:
        self._settings = settings or get_settings()
        self._client = client or self._default_client(self._settings)

    async def run(
        self,
        request: NoveltyAnalysisRequest | Workspace | AgentContext,
    ) -> NoveltyAnalysis:
        """Run novelty analysis without claiming true scientific novelty."""
        return await self._client.analyze(self._normalize_request(request))

    def _default_client(self, settings: Settings) -> NoveltyClient:
        """Use OpenAI when configured, otherwise deterministic local analysis."""
        if settings.openai_api_key:
            return OpenAINoveltyClient(settings)
        return DeterministicNoveltyClient()

    def _normalize_request(
        self, request: NoveltyAnalysisRequest | Workspace | AgentContext,
    ) -> NoveltyAnalysisRequest:
        """Normalize generic invocations into the novelty request schema."""
        if isinstance(request, NoveltyAnalysisRequest):
            return request
        if isinstance(request, Workspace):
            graph = (
                KnowledgeGraph.model_validate(request.knowledge_graph)
                if request.knowledge_graph
                else None
            )
            return NoveltyAnalysisRequest(workspace=request, knowledge_graph=graph)
        candidate = request.inputs.get("workspace")
        if isinstance(candidate, Workspace):
            return NoveltyAnalysisRequest(workspace=candidate)
        if isinstance(candidate, dict):
            return NoveltyAnalysisRequest(workspace=Workspace.model_validate(candidate))
        raise ValueError("NoveltyAgent requires a Workspace.")
