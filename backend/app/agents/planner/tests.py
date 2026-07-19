"""Purpose: Unit-test the Planner Agent's deterministic structured output."""

import pytest

from app.agents.planner.planner import PlannerAgent
from app.schemas.agent import AgentContext


@pytest.mark.asyncio
async def test_planner_creates_machine_readable_plan() -> None:
    """Planner output should be typed and should not answer the research question."""

    agent = PlannerAgent()
    plan = await agent.run(
        AgentContext(research_goal="Can microplastics contribute to Alzheimer's disease?")
    )

    assert plan.research_goal == "Can microplastics contribute to Alzheimer's disease?"
    assert plan.research_domain == "Biomedical"
    assert plan.objectives
    assert plan.search_queries
    assert any(source.name == "OpenAlex" for source in plan.paper_sources)
