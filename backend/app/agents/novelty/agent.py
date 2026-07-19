"""Purpose: Define the novelty agent placeholder for future novelty analysis."""

from app.agents.base import PlaceholderResearchAgent


class NoveltyAgent(PlaceholderResearchAgent):
    """Agent boundary for estimating novelty signals without overclaiming certainty."""

    def __init__(self) -> None:
        super().__init__(
            name="novelty",
            description="Novelty Agent will compare hypotheses against retrieved prior work.",
        )
