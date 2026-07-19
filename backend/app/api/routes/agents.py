"""Purpose: Expose agent architecture metadata and placeholder execution endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import agent_service_dependency
from app.schemas.agent import AgentContext, AgentResult, AgentSummary
from app.services.agent_service import AgentService

router = APIRouter()


@router.get("", response_model=list[AgentSummary])
async def list_agents(
    service: Annotated[AgentService, Depends(agent_service_dependency)],
) -> list[AgentSummary]:
    """List registered placeholder agents so clients can inspect backend capabilities."""

    return service.list_agents()


@router.post("/{agent_name}/run", response_model=AgentResult)
async def run_agent(
    agent_name: str,
    context: AgentContext,
    service: Annotated[AgentService, Depends(agent_service_dependency)],
) -> AgentResult:
    """Run a placeholder agent through the shared interface without invoking AI logic."""

    result = await service.run_agent(agent_name=agent_name, context=context)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent '{agent_name}' is not registered.",
        )
    return result
