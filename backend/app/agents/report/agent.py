"""Purpose: Define the report agent placeholder for future evidence-backed reporting."""

from app.agents.base import PlaceholderResearchAgent


class ReportAgent(PlaceholderResearchAgent):
    """Agent boundary for generating final reports from structured research artifacts."""

    def __init__(self) -> None:
        super().__init__(
            name="report",
            description="Report Agent will synthesize structured artifacts into auditable reports.",
        )
