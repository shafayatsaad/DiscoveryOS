"""Purpose: Define the experiment agent placeholder for future validation planning."""

from app.agents.base import PlaceholderResearchAgent


class ExperimentAgent(PlaceholderResearchAgent):
    """Agent boundary for transforming hypotheses into validation plans."""

    def __init__(self) -> None:
        super().__init__(
            name="experiment",
            description="Experiment Agent will propose validation plans, controls, and risks.",
        )
