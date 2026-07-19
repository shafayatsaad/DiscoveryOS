"""Purpose: Test Planner Agent structured output from the public test suite."""

import pytest

from app.agents.planner.planner import PlannerAgent
from app.schemas.agent import AgentContext


@pytest.mark.asyncio
async def test_planner_returns_research_plan() -> None:
    """PlannerAgent should produce a ResearchPlan, not a direct answer."""

    plan = await PlannerAgent().run(
        AgentContext(research_goal="Can microplastics contribute to Alzheimer's disease?")
    )

    assert plan.research_goal == "Can microplastics contribute to Alzheimer's disease?"
    assert plan.research_domain == "Biomedical"
    assert "OpenAlex works metadata" in plan.recommended_data_sources
    assert len(plan.search_queries) >= 3
