"""Purpose: Suggest structured validation experiments from workspace artifacts."""

from typing import Protocol

from app.agents.base import BaseResearchAgent
from app.agents.experiment.prompts import EXPERIMENT_SYSTEM_PROMPT
from app.agents.experiment.schemas import (
    ExperimentPlan,
    ExperimentPlanningRequest,
    SuggestedExperiment,
)
from app.agents.novelty.schemas import NoveltyAnalysis
from app.config import Settings, get_settings
from app.graph.schemas import KnowledgeGraph
from app.schemas.agent import AgentContext
from app.workspace.schemas import Workspace


class ExperimentPlanningClient(Protocol):
    """Client boundary for experiment planning implementations."""

    async def plan(self, request: ExperimentPlanningRequest) -> ExperimentPlan:
        """Return structured experiment suggestions."""


class OpenAIExperimentPlanningClient:
    """OpenAI Responses API implementation for experiment planning."""

    def __init__(self, api_key: str, model: str) -> None:
        self._api_key = api_key
        self._model = model

    async def plan(self, request: ExperimentPlanningRequest) -> ExperimentPlan:
        """Call OpenAI with strict structured output validation."""

        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=self._api_key)
        response = await client.responses.parse(
            model=self._model,
            input=[
                {"role": "system", "content": EXPERIMENT_SYSTEM_PROMPT},
                {"role": "user", "content": request.model_dump_json()},
            ],
            text_format=ExperimentPlan,
        )
        if response.output_parsed is None:
            raise ValueError("OpenAI response did not include parsed ExperimentPlan.")
        return response.output_parsed


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
    """Agent that converts workspace artifacts into validation experiment suggestions."""

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
            return OpenAIExperimentPlanningClient(settings.openai_api_key, settings.openai_model)
        return DeterministicExperimentPlanningClient()

    def _normalize_request(
        self,
        request: ExperimentPlanningRequest | Workspace | AgentContext,
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
                workspace=request,
                knowledge_graph=graph,
                novelty_analysis=novelty,
            )
        candidate = request.inputs.get("workspace")
        if isinstance(candidate, Workspace):
            return ExperimentPlanningRequest(workspace=candidate)
        if isinstance(candidate, dict):
            return ExperimentPlanningRequest(workspace=Workspace.model_validate(candidate))
        raise ValueError("ExperimentAgent requires a Workspace.")
