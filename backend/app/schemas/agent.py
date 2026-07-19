"""Purpose: Define shared schemas for agent context, output, and metadata."""

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

AgentStatus = Literal["not_implemented", "completed", "failed", "needs_review"]


class AgentContext(BaseModel):
    """Context envelope passed to every DiscoveryOS agent."""

    project_id: str | None = None
    run_id: str | None = None
    research_goal: str | None = None
    domain: str | None = None
    inputs: dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(extra="forbid")


class AgentResult(BaseModel):
    """Structured result returned by every agent run."""

    agent_name: str
    status: AgentStatus
    summary: str
    outputs: dict[str, Any] = Field(default_factory=dict)
    events: list[str] = Field(default_factory=list)

    model_config = ConfigDict(extra="forbid")


class AgentSummary(BaseModel):
    """Public metadata describing a registered backend agent."""

    name: str
    description: str

    model_config = ConfigDict(extra="forbid")
