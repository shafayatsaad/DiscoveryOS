"""Purpose: Define the contradiction agent placeholder for future conflict analysis."""

from app.agents.base import PlaceholderResearchAgent


class ContradictionAgent(PlaceholderResearchAgent):
    """Agent boundary for identifying conflicting claims and weak assumptions."""

    def __init__(self) -> None:
        super().__init__(
            name="contradiction",
            description=(
                "Contradiction Agent will find conflicting evidence and uncertainty clusters."
            ),
        )
