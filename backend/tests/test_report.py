"""Purpose: Test complete scientific report generation from the public test suite."""

from datetime import UTC, datetime

import pytest

from app.agents.report.report import ReportAgent
from app.workspace.schemas import Workspace


@pytest.mark.asyncio
async def test_report_contains_required_sections() -> None:
    """Generated reports should include Markdown and HTML with required sections."""

    workspace = Workspace(
        id="workspace_report_public",
        project_id="project_report_public",
        research_goal="Can microplastics contribute to Alzheimer's disease?",
        retrieved_papers=[{"title": "Paper", "source": "OpenAlex", "doi": "10.0000/report"}],
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )

    report = await ReportAgent().run(workspace)

    for section in [
        "## Research Goal",
        "## Research Plan",
        "## Evidence Summary",
        "## Knowledge Graph Summary",
        "## Contradictions",
        "## Novelty Analysis",
        "## Suggested Experiments",
        "## References",
    ]:
        assert section in report.markdown
    assert report.html.startswith("<article>")
