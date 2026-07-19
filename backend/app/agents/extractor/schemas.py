"""Purpose: Define strict evidence extraction schemas for structured outputs."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.agents.retriever.schemas import Paper


class EvidenceClaim(BaseModel):
    """Atomic source-linked claim extracted from a paper abstract."""

    claim: str
    claim_type: Literal["mechanistic", "associational", "methodological", "negative", "uncertain"]
    support_level: Literal["direct", "indirect", "mixed", "insufficient"]

    model_config = ConfigDict(extra="forbid")


class EvidenceSnippet(BaseModel):
    """Text span from the abstract that supports an evidence record."""

    text: str
    relevance: Literal["high", "medium", "low"]

    model_config = ConfigDict(extra="forbid")


class PaperEvidence(BaseModel):
    """Structured evidence extracted from one paper."""

    paper_title: str
    source: str
    doi: str | None = None
    claims: list[EvidenceClaim]
    methods: list[str]
    results: list[str]
    limitations: list[str]
    confidence: float = Field(ge=0.0, le=1.0)
    key_entities: list[str]
    evidence_snippets: list[EvidenceSnippet]

    model_config = ConfigDict(extra="forbid")


class EvidenceExtractionRequest(BaseModel):
    """Input accepted by the Evidence Extraction Agent."""

    research_goal: str
    domain: str
    papers: list[Paper]

    model_config = ConfigDict(extra="forbid")


class EvidenceCollection(BaseModel):
    """Evidence records extracted from a paper collection."""

    evidence: list[PaperEvidence]
    extracted_count: int

    model_config = ConfigDict(extra="forbid")
