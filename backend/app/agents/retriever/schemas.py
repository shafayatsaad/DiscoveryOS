"""Purpose: Define scientific literature metadata schemas for retrieval results."""

from pydantic import BaseModel, ConfigDict, Field


class Paper(BaseModel):
    """Normalized scientific paper metadata returned by all retrieval providers."""

    title: str
    authors: list[str] = Field(default_factory=list)
    year: int | None = None
    abstract: str | None = None
    doi: str | None = None
    url: str | None = None
    source: str
    keywords: list[str] = Field(default_factory=list)
    citation_count: int | None = None

    model_config = ConfigDict(extra="forbid")


class PaperCollection(BaseModel):
    """Collection of deduplicated papers with retrieval provenance metadata."""

    papers: list[Paper]
    query_count: int
    provider_count: int
    sources: list[str]

    model_config = ConfigDict(extra="forbid")
