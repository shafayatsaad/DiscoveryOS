"""Purpose: Provide a service boundary for listing and running DiscoveryOS agents."""

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
        return await agent.run(context)
