"""Purpose: Define API schemas for starting DiscoveryOS pipeline runs."""

from pydantic import BaseModel, ConfigDict, Field

from app.agents.extractor.schemas import PaperEvidence
from app.agents.planner.schemas import ResearchPlan
from app.agents.retriever.schemas import Paper


class PipelineStartRequest(BaseModel):
    """Request body for starting the first Discovery Pipeline."""

    query: str = Field(min_length=3)
    domain: str | None = None

    model_config = ConfigDict(extra="forbid")


class PipelineStartResponse(BaseModel):
    """Synchronous MVP pipeline response with future streaming metadata."""

    run_id: str
    status: str
    plan: ResearchPlan
    papers: list[Paper]
    evidence: list[PaperEvidence]
    events: list[str]
    stream_ready: bool = False

    model_config = ConfigDict(extra="forbid")
