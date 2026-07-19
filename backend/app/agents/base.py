"""Purpose: Define the abstract contract shared by every DiscoveryOS agent."""

from abc import ABC, abstractmethod

from app.schemas.agent import AgentContext, AgentResult


class BaseResearchAgent(ABC):
    """Abstract base class for all specialized research agents."""

    name: str
    description: str

    @abstractmethod
    async def run(self, context: AgentContext) -> AgentResult:
        """Execute an agent with structured context and return a structured result."""


class PlaceholderResearchAgent(BaseResearchAgent):
    """Reusable placeholder implementation that preserves future agent contracts."""

    def __init__(self, name: str, description: str) -> None:
        self.name = name
        self.description = description

    async def run(self, context: AgentContext) -> AgentResult:
        """Return a non-AI placeholder result while preserving the final method shape."""

        return AgentResult(
            agent_name=self.name,
            status="not_implemented",
            summary=(
                f"{self.description} This placeholder is ready for future OpenAI Agents SDK "
                "and LangGraph integration."
            ),
            outputs={
                "project_id": context.project_id,
                "run_id": context.run_id,
                "domain": context.domain,
            },
            events=[f"{self.name}.placeholder_invoked"],
        )
