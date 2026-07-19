"""Purpose: Unit-test deterministic report generation."""

from datetime import UTC, datetime

import pytest

from app.agents.report.report import ReportAgent
from app.workspace.schemas import Workspace


@pytest.mark.asyncio
async def test_report_agent_returns_markdown_and_html() -> None:
    """Report generation should include required sections and future PDF-ready HTML."""

    workspace = Workspace(
        id="workspace_report",
        project_id="project_report",
        research_goal="Can microplastics contribute to Alzheimer's disease?",
        retrieved_papers=[{"title": "Paper", "source": "Fake", "doi": "10.0000/report"}],
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )

    report = await ReportAgent().run(workspace)

    assert "## Research Goal" in report.markdown
    assert "## References" in report.markdown
    assert "<article>" in report.html
