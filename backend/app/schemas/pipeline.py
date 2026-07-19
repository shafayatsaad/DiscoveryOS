"""Purpose: Define API schemas for starting DiscoveryOS pipeline runs."""

from pydantic import BaseModel, ConfigDict, Field

from app.agents.contradiction.schemas import Contradiction
from app.agents.experiment.schemas import SuggestedExperiment
from app.agents.extractor.schemas import PaperEvidence
from app.agents.novelty.schemas import NoveltyAnalysis
from app.agents.planner.schemas import ResearchPlan
from app.agents.report.schemas import ScientificReport
from app.agents.retriever.schemas import Paper
from app.graph.schemas import KnowledgeGraph
from app.workspace.schemas import Workspace


class PipelineStartRequest(BaseModel):
    """Request body for starting the first Discovery Pipeline."""

    query: str = Field(min_length=3)
    project_id: str | None = None
    domain: str | None = None

    model_config = ConfigDict(extra="forbid")


class PipelineStartResponse(BaseModel):
    """Synchronous MVP pipeline response with future streaming metadata."""

    run_id: str
    project_id: str
    workspace_id: str
    status: str
    plan: ResearchPlan
    papers: list[Paper]
    evidence: list[PaperEvidence]
    knowledge_graph: KnowledgeGraph | None = None
    contradictions: list[Contradiction] = Field(default_factory=list)
    novelty_analysis: NoveltyAnalysis | None = None
    suggested_experiments: list[SuggestedExperiment] = Field(default_factory=list)
    report: ScientificReport | None = None
    workspace: Workspace | None = None
    events: list[str]
    stream_ready: bool = False

    model_config = ConfigDict(extra="forbid")
