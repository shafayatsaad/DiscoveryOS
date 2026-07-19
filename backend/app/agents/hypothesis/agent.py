"""Purpose: Define the hypothesis agent placeholder for future hypothesis generation."""

from app.agents.base import PlaceholderResearchAgent


class HypothesisAgent(PlaceholderResearchAgent):
    """Agent boundary for generating evidence-backed candidate hypotheses."""

    def __init__(self) -> None:
        super().__init__(
            name="hypothesis",
            description=(
                "Hypothesis Agent will propose testable hypotheses from evidence and graph state."
            ),
        )
