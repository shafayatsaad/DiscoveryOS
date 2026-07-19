"""Purpose: Unit-test deterministic experiment planning."""

from datetime import UTC, datetime

import pytest

from app.agents.experiment.planner import ExperimentAgent
from app.workspace.schemas import Workspace


@pytest.mark.asyncio
async def test_experiment_agent_returns_structured_plan() -> None:
    """Experiment planner should return datasets, metrics, variables, and risks."""

    workspace = Workspace(
        id="workspace_experiment",
        project_id="project_experiment",
        research_goal="Can microplastics contribute to Alzheimer's disease?",
        retrieved_papers=[{"title": "Paper", "doi": "10.0000/example"}],
        extracted_evidence=[{"key_entities": ["microplastics", "Alzheimer disease"]}],
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )

    result = await ExperimentAgent().run(workspace)

    experiment = result.suggested_experiments[0]
    assert experiment.required_datasets
    assert experiment.evaluation_metrics
    assert "microplastics" in experiment.variables
