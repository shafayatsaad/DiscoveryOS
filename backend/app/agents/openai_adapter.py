"""Purpose: Reserve the OpenAI Agents SDK adapter boundary without importing SDK code yet."""

from typing import Protocol

from app.schemas.agent import AgentContext, AgentResult


class OpenAIAgentAdapter(Protocol):
    """Protocol for future wrappers around OpenAI Agents SDK agent instances."""

    async def run(self, context: AgentContext) -> AgentResult:
        """Execute an OpenAI-backed agent and return the standard AgentResult envelope."""
