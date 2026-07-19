"""Purpose: Define the retriever agent placeholder for future literature search."""

from app.agents.base import PlaceholderResearchAgent


class RetrieverAgent(PlaceholderResearchAgent):
    """Agent boundary for retrieving and ranking research sources."""

    def __init__(self) -> None:
        super().__init__(
            name="retriever",
            description="Retriever Agent will search literature and preserve source metadata.",
        )
