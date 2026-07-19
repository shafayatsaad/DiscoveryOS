"""Purpose: Provide a service boundary for listing and running DiscoveryOS agents."""

from typing import Any

from pydantic import BaseModel

from app.agents.registry import AgentRegistry
from app.schemas.agent import AgentContext, AgentResult, AgentSummary


class AgentService:
    """Coordinate agent access without exposing registry internals to route handlers."""

    def __init__(self, registry: AgentRegistry) -> None:
        self._registry = registry

    def list_agents(self) -> list[AgentSummary]:
        """Return registered agent metadata."""

        return [
            AgentSummary(name=agent.name, description=agent.description)
            for agent in self._registry.agents
        ]

    async def run_agent(self, agent_name: str, context: AgentContext) -> AgentResult | None:
        """Run a registered placeholder agent by name."""

        agent = self._registry.get(agent_name)
        if agent is None:
            return None
        result = await agent.run(context)
        return self._to_agent_result(agent_name=agent.name, result=result)

    def _to_agent_result(self, agent_name: str, result: Any) -> AgentResult:
        """Wrap typed agent outputs for the generic agent-inspection API."""

        if isinstance(result, AgentResult):
            return result

        if isinstance(result, BaseModel):
            outputs = result.model_dump(mode="json")
        else:
            outputs = {"value": result}

        return AgentResult(
            agent_name=agent_name,
            status="completed",
            summary=f"{agent_name} produced a structured output.",
            outputs=outputs,
            events=[f"{agent_name}.completed"],
        )
