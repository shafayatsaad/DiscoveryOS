"""Purpose: Define structured scientific report outputs."""

from pydantic import BaseModel, ConfigDict, Field

from app.agents.contradiction.schemas import ContradictionAnalysis
from app.agents.experiment.schemas import ExperimentPlan
from app.agents.novelty.schemas import NoveltyAnalysis
from app.graph.schemas import KnowledgeGraph
from app.workspace.schemas import Workspace


class ScientificReportRequest(BaseModel):
    """Input for generating the complete scientific report artifact."""

    workspace: Workspace
    knowledge_graph: KnowledgeGraph | None = None
    contradictions: ContradictionAnalysis | None = None
    novelty_analysis: NoveltyAnalysis | None = None
    experiment_plan: ExperimentPlan | None = None

    model_config = ConfigDict(extra="forbid")


class ScientificReport(BaseModel):
    """Report artifact returned as Markdown and HTML for future PDF export."""

    title: str
    markdown: str
    html: str
    references: list[str] = Field(default_factory=list)

    model_config = ConfigDict(extra="forbid")
