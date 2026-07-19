"""Purpose: Define machine-readable schemas produced by the Planner Agent."""

from pydantic import BaseModel, ConfigDict, Field


class PlannerInput(BaseModel):
    """Input required to turn a research question into an investigation plan."""

    research_question: str = Field(min_length=3)
    domain: str | None = None

    model_config = ConfigDict(extra="forbid")


class SearchQuery(BaseModel):
    """Search query prepared for a retrieval provider or scientific index."""

    query: str
    rationale: str

    model_config = ConfigDict(extra="forbid")


class PaperSource(BaseModel):
    """Scientific paper source recommended by the planner."""

    name: str
    priority: int = Field(ge=1, le=5)
    reason: str

    model_config = ConfigDict(extra="forbid")


class ResearchPlan(BaseModel):
    """Structured plan that downstream agents can consume without free-form parsing."""

    research_goal: str
    research_domain: str
    objectives: list[str]
    sub_problems: list[str]
    keywords: list[str]
    search_queries: list[SearchQuery]
    recommended_data_sources: list[str]
    paper_sources: list[PaperSource]
    potential_risks: list[str]
    expected_deliverables: list[str]

    model_config = ConfigDict(extra="forbid")
