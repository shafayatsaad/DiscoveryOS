"""Purpose: Provide FastAPI dependency functions for configuration, database, and services."""

from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session

from app.agents.registry import AgentRegistry, build_agent_registry
from app.config import Settings, get_settings
from app.database.session import get_session
from app.services.agent_service import AgentService
from app.services.pipeline_service import DiscoveryPipelineService


def settings_dependency() -> Settings:
    """Inject application settings into routes and services."""

    return get_settings()


def database_session_dependency() -> Generator[Session, None, None]:
    """Inject a SQLModel session for future persistence operations."""

    yield from get_session()


def agent_registry_dependency() -> AgentRegistry:
    """Inject the configured agent registry without constructing agents in route code."""

    return build_agent_registry()


def agent_service_dependency(
    registry: Annotated[AgentRegistry, Depends(agent_registry_dependency)],
) -> AgentService:
    """Inject the agent service boundary used by agent-facing routes."""

    return AgentService(registry=registry)


def pipeline_service_dependency(
    settings: Annotated[Settings, Depends(settings_dependency)],
) -> DiscoveryPipelineService:
    """Inject the pipeline service used by workflow-facing routes."""

    return DiscoveryPipelineService(max_papers_for_extraction=settings.pipeline_max_papers)
