"""Purpose: Define a placeholder workflow graph boundary for future LangGraph orchestration."""

from typing import Protocol

from app.schemas.agent import AgentContext, AgentResult


class WorkflowGraph(Protocol):
    """Protocol representing a future LangGraph-compatible workflow executor."""

    async def run(self, context: AgentContext) -> list[AgentResult]:
        """Execute a graph of agents and return ordered agent results."""


class LangGraphWorkflowPlaceholder:
    """Non-AI placeholder that reserves the future LangGraph integration boundary."""

    async def run(self, context: AgentContext) -> list[AgentResult]:
        """Return no results until real orchestration is implemented."""

        _ = context
        return []
