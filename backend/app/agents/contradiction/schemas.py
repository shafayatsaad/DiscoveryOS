"""Purpose: Define structured contradiction detection outputs."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.graph.schemas import KnowledgeGraph
from app.workspace.schemas import Workspace


class SupportingPaper(BaseModel):
    """Paper citation that supports one side of a detected contradiction."""

    title: str
    doi: str | None = None
    source: str | None = None

    model_config = ConfigDict(extra="forbid")


class Contradiction(BaseModel):
    """Conflicting evidence pair that cites supporting papers."""

    statement_a: str
    statement_b: str
    supporting_papers: list[SupportingPaper] = Field(min_length=2)
    possible_causes: list[str]
    confidence: float = Field(ge=0.0, le=1.0)
    severity: Literal["low", "medium", "high"]

    model_config = ConfigDict(extra="forbid")


class ContradictionDetectionRequest(BaseModel):
    """Input for contradiction detection across workspace evidence and graph context."""

    workspace: Workspace
    knowledge_graph: KnowledgeGraph | None = None

    model_config = ConfigDict(extra="forbid")


class ContradictionAnalysis(BaseModel):
    """Contradiction detection result for a workspace."""

    contradictions: list[Contradiction]
    analyzed_evidence_count: int
    notes: list[str] = Field(default_factory=list)

    model_config = ConfigDict(extra="forbid")
