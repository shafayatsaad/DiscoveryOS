"""Purpose: Provide FastAPI dependency functions for configuration, database, and services."""

from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session

from app.agents.registry import AgentRegistry, build_agent_registry
from app.config import Settings, get_settings
from app.database.session import get_session
from app.graph.repository import KnowledgeGraphRepository
from app.mcp.registry import MCPRegistry, build_mcp_registry
from app.mcp.service import MCPService
from app.orchestrator.orchestrator import DiscoveryOrchestrator
from app.orchestrator.service import OrchestratorService
from app.services.agent_service import AgentService
from app.services.pipeline_service import DiscoveryPipelineService
from app.storage.state import InMemoryStateBackend
from app.workspace.repository import WorkspaceRepository
from app.workspace.service import WorkspaceService


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
    session: Annotated[Session, Depends(database_session_dependency)],
) -> DiscoveryPipelineService:
    """Inject the pipeline service used by workflow-facing routes."""

    workspace_service = WorkspaceService(repository=WorkspaceRepository(session))
    return DiscoveryPipelineService(
        max_papers_for_extraction=settings.pipeline_max_papers,
        workspace_service=workspace_service,
    )


def workspace_service_dependency(
    session: Annotated[Session, Depends(database_session_dependency)],
) -> WorkspaceService:
    """Inject the Discovery Workspace service."""

    return WorkspaceService(repository=WorkspaceRepository(session))


def graph_repository_dependency(
    workspace_service: Annotated[WorkspaceService, Depends(workspace_service_dependency)],
) -> KnowledgeGraphRepository:
    """Inject the graph repository backed by workspace JSON storage."""

    return KnowledgeGraphRepository(workspace_service=workspace_service)


# Module-level singleton so POST (start) and GET (stream) share the same state backend.
_shared_state_backend = InMemoryStateBackend()


def orchestrator_service_dependency() -> OrchestratorService:
    """Inject the orchestrator service used by project pipeline routes."""

    return OrchestratorService(
        state_backend=_shared_state_backend,
    )


def mcp_service_dependency(
    settings: Annotated[Settings, Depends(settings_dependency)],
) -> MCPService:
    """Inject the MCP service used by MCP status routes."""

    registry = build_mcp_registry(settings)
    return MCPService(registry=registry)
