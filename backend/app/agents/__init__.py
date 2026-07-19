"""Purpose: Group specialized DiscoveryOS scientific agent modules."""

from app.agents.registry import AgentRegistry, build_agent_registry

__all__ = ["AgentRegistry", "build_agent_registry"]
