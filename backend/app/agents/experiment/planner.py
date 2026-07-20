"""Purpose: Suggest structured validation experiments using GPT-5 structured outputs."""

from typing import Protocol

from app.agents.base import BaseResearchAgent
from app.agents.experiment.prompts import EXPERIMENT_PROMPT_VERSION, EXPERIMENT_SYSTEM_PROMPT
from app.agents.experiment.schemas import (
    ExperimentPlan,
    ExperimentPlanningRequest,
    SuggestedExperiment,
)
from app.agents.novelty.schemas import NoveltyAnalysis
from app.agents.openai_adapter import OpenAIClient
from app.config import Settings, get_settings
from app.graph.schemas import KnowledgeGraph
from app.schemas.agent import AgentContext
from app.workspace.schemas import Workspace


class ExperimentPlanningClient(Protocol):
    """Client boundary for experiment planning implementations."""

    async def plan(self, request: ExperimentPlanningRequest) -> ExperimentPlan:
        """Return structured experiment suggestions."""


class OpenAIExperimentPlanningClient:
    """GPT-5 powered experiment planning using the shared OpenAIClient."""

    def __init__(self, settings: Settings) -> None:
        self._client = OpenAIClient(
            settings=settings,
            system_prompt=EXPERIMENT_SYSTEM_PROMPT,
            prompt_version=EXPERIMENT_PROMPT_VERSION,
        )

    async def plan(self, request: ExperimentPlanningRequest) -> ExperimentPlan:
        """Plan experiments using GPT-5 structured outputs."""
        user_content = request.model_dump_json()
        result = await self._client.parse(
            user_content=user_content,
            response_format=ExperimentPlan,
        )
        return result


class DeterministicExperimentPlanningClient:
    """Local planner that creates conservative validation suggestions."""

    async def plan(self, request: ExperimentPlanningRequest) -> ExperimentPlan:
        """Create experiment suggestions from entities and evidence links."""
        entities = self._entities(request.workspace)
        goal = request.workspace.research_goal or "current research goal"
        references = [
            paper.get("doi") or paper.get("title", "Untitled paper")
            for paper in request.workspace.retrieved_papers[:5]
        ]
        return ExperimentPlan(
            suggested_experiments=[
                SuggestedExperiment(
                    title=f"Validation study for {goal[:80]}",
                    objective="Test whether the extracted evidence pattern is reproducible.",
                    required_datasets=[
                        "Retrieved paper corpus with abstracts",
                        "Domain-specific validation dataset or experimental measurements",
                    ],
                    evaluation_metrics=[
                        "Effect direction consistency",
                        "Statistical significance or confidence interval",
                        "Replication rate across sources",
                    ],
                    variables=entities[:6] or ["primary exposure", "primary outcome"],
                    potential_risks=[
                        "Available abstracts may omit confounders or negative controls.",
                        "Retrieved literature may not represent the full research landscape.",
                    ],
                    expected_outcomes=[
                        "A clearer estimate of whether the proposed relationship is testable.",
                        "A ranked list of evidence gaps requiring stronger data.",
                    ],
                    evidence_links=[str(reference) for reference in references],
                )
            ],
            planning_notes=[
                "Generated as a structured planning artifact, not a lab protocol.",
                "Human domain review is required before operational use.",
            ],
        )

    def _entities(self, workspace: Workspace) -> list[str]:
        """Collect candidate variables from extracted evidence entities."""
        entities: list[str] = []
        for evidence in workspace.extracted_evidence:
            for entity in evidence.get("key_entities", []):
                if entity not in entities:
                    entities.append(str(entity))
        return entities


class ExperimentAgent(BaseResearchAgent):
    """Agent that converts workspace artifacts into validation experiment suggestions.

    Uses GPT-5 via the shared OpenAIClient when OPENAI_API_KEY is set.
    Falls back to deterministic entity-based planning when no API key is available.
    """

    name = "experiment"
    description = "Experiment Agent proposes validation plans, datasets, metrics, and risks."

    def __init__(
        self,
        client: ExperimentPlanningClient | None = None,
        settings: Settings | None = None,
    ) -> None:
        self._settings = settings or get_settings()
        self._client = client or self._default_client(self._settings)

    async def run(
        self,
        request: ExperimentPlanningRequest | Workspace | AgentContext,
    ) -> ExperimentPlan:
        """Run structured experiment planning."""
        return await self._client.plan(self._normalize_request(request))

    def _default_client(self, settings: Settings) -> ExperimentPlanningClient:
        """Use OpenAI when configured, otherwise deterministic local planning."""
        if settings.openai_api_key:
            return OpenAIExperimentPlanningClient(settings)
        return DeterministicExperimentPlanningClient()

    def _normalize_request(
        self, request: ExperimentPlanningRequest | Workspace | AgentContext,
    ) -> ExperimentPlanningRequest:
        """Normalize generic invocations into the experiment request schema."""
        if isinstance(request, ExperimentPlanningRequest):
            return request
        if isinstance(request, Workspace):
            graph = (
                KnowledgeGraph.model_validate(request.knowledge_graph)
                if request.knowledge_graph
                else None
            )
            novelty = (
                NoveltyAnalysis.model_validate(request.novelty_analysis)
                if request.novelty_analysis
                else None
            )
            return ExperimentPlanningRequest(
                workspace=request, knowledge_graph=graph, novelty_analysis=novelty,
            )
        candidate = request.inputs.get("workspace")
        if isinstance(candidate, Workspace):
            return ExperimentPlanningRequest(workspace=candidate)
        if isinstance(candidate, dict):
            return ExperimentPlanningRequest(workspace=Workspace.model_validate(candidate))
        raise ValueError("ExperimentAgent requires a Workspace.")