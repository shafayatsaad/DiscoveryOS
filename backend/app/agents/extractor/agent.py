"""Purpose: Define the extractor agent placeholder for future evidence extraction."""

from app.agents.base import PlaceholderResearchAgent


class ExtractorAgent(PlaceholderResearchAgent):
    """Agent boundary for converting sources into structured evidence records."""

    def __init__(self) -> None:
        super().__init__(
            name="extractor",
            description="Extractor Agent will extract claims, methods, limitations, and evidence.",
        )
