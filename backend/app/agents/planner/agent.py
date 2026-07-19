"""Purpose: Define the planner agent placeholder for future research-plan generation."""

from app.agents.base import PlaceholderResearchAgent


class PlannerAgent(PlaceholderResearchAgent):
    """Agent boundary for converting research goals into workflow plans."""

    def __init__(self) -> None:
        super().__init__(
            name="planner",
            description="Planner Agent will decompose research goals into structured workflows.",
        )
