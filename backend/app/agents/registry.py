"""Purpose: Register agent implementations behind a lookup boundary."""

from dataclasses import dataclass

from app.agents.base import BaseResearchAgent
from app.agents.contradiction.agent import ContradictionAgent
from app.agents.experiment.agent import ExperimentAgent
from app.agents.extractor.agent import ExtractorAgent
from app.agents.hypothesis.agent import HypothesisAgent
from app.agents.novelty.agent import NoveltyAgent
from app.agents.planner.agent import PlannerAgent
from app.agents.report.agent import ReportAgent
from app.agents.retriever.agent import RetrieverAgent
from app.agents.verifier.agent import VerifierAgent


@dataclass(frozen=True)
class AgentRegistry:
    """Immutable registry of configured research agents."""

    agents: tuple[BaseResearchAgent, ...]

    def get(self, name: str) -> BaseResearchAgent | None:
        """Return an agent by its stable name."""

        normalized_name = name.strip().lower()
        return next((agent for agent in self.agents if agent.name == normalized_name), None)


def build_agent_registry() -> AgentRegistry:
    """Construct the default agent registry for the DiscoveryOS workflow."""

    return AgentRegistry(
        agents=(
            PlannerAgent(),
            RetrieverAgent(),
            ExtractorAgent(),
            VerifierAgent(),
            ContradictionAgent(),
            HypothesisAgent(),
            NoveltyAgent(),
            ExperimentAgent(),
            ReportAgent(),
        ),
    )
