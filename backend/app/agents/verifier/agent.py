"""Purpose: Define the verifier agent placeholder for future claim provenance checks."""

from app.agents.base import PlaceholderResearchAgent


class VerifierAgent(PlaceholderResearchAgent):
    """Agent boundary for checking claim support and evidence provenance."""

    def __init__(self) -> None:
        super().__init__(
            name="verifier",
            description="Verifier Agent will validate extracted claims against source evidence.",
        )
