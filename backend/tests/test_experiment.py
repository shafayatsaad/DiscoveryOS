"""Purpose: Test experiment planning from the public test suite."""

from datetime import UTC, datetime

import pytest

from app.agents.experiment.planner import ExperimentAgent
from app.workspace.schemas import Workspace


@pytest.mark.asyncio
async def test_experiment_plan_contains_required_sections() -> None:
    """Experiment planning should return datasets, metrics, variables, risks, and outcomes."""

    workspace = Workspace(
        id="workspace_experiment_public",
        project_id="project_experiment_public",
        research_goal="Can microplastics contribute to Alzheimer's disease?",
        retrieved_papers=[{"title": "Paper", "doi": "10.0000/experiment"}],
        extracted_evidence=[{"key_entities": ["microplastics", "Alzheimer disease"]}],
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )

    plan = await ExperimentAgent().run(workspace)
    experiment = plan.suggested_experiments[0]

    assert experiment.required_datasets
    assert experiment.evaluation_metrics
    assert experiment.potential_risks
    assert experiment.expected_outcomes
