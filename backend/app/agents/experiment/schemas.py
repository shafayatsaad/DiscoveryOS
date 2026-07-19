"""Purpose: Define structured experiment planning outputs."""

from pydantic import BaseModel, ConfigDict, Field

from app.agents.novelty.schemas import NoveltyAnalysis
from app.graph.schemas import KnowledgeGraph
from app.workspace.schemas import Workspace


class SuggestedExperiment(BaseModel):
    """One testable experiment or validation study suggested by DiscoveryOS."""

    title: str
    objective: str
    required_datasets: list[str]
    evaluation_metrics: list[str]
    variables: list[str]
    potential_risks: list[str]
    expected_outcomes: list[str]
    evidence_links: list[str] = Field(default_factory=list)

    model_config = ConfigDict(extra="forbid")


class ExperimentPlanningRequest(BaseModel):
    """Input for experiment planning from workspace artifacts."""

    workspace: Workspace
    knowledge_graph: KnowledgeGraph | None = None
    novelty_analysis: NoveltyAnalysis | None = None

    model_config = ConfigDict(extra="forbid")


class ExperimentPlan(BaseModel):
    """Structured experiment planning result."""

    suggested_experiments: list[SuggestedExperiment]
    planning_notes: list[str]

    model_config = ConfigDict(extra="forbid")
