"""Purpose: Define structured novelty analysis outputs."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.agents.contradiction.schemas import ContradictionAnalysis
from app.graph.schemas import KnowledgeGraph
from app.workspace.schemas import Workspace

NoveltyCategory = Literal[
    "Well Studied",
    "Moderately Explored",
    "Underexplored",
    "Potential Research Gap",
]


class RelatedWork(BaseModel):
    """Retrieved source that informs novelty estimation."""

    title: str
    source: str | None = None
    doi: str | None = None
    relevance: str

    model_config = ConfigDict(extra="forbid")


class NoveltyAnalysisRequest(BaseModel):
    """Input for estimating literature coverage and research gaps."""

    workspace: Workspace
    knowledge_graph: KnowledgeGraph | None = None
    contradictions: ContradictionAnalysis | None = None

    model_config = ConfigDict(extra="forbid")


class NoveltyAnalysis(BaseModel):
    """Novelty estimate based only on retrieved literature and extracted evidence."""

    novelty_score: float = Field(ge=0.0, le=1.0)
    category: NoveltyCategory
    reasoning: list[str]
    related_work: list[RelatedWork]
    research_opportunities: list[str]
    disclaimer: str = "Novelty is estimated from the retrieved corpus, not claimed as true novelty."

    model_config = ConfigDict(extra="forbid")
