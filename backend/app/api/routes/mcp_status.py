"""Purpose: Expose MCP server status through the API."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import mcp_service_dependency
from app.mcp.service import MCPService

router = APIRouter()


@router.get("/mcp/status")
async def get_mcp_status(
    service: Annotated[MCPService, Depends(mcp_service_dependency)],
) -> dict:
    """Return the health status of all registered MCP servers."""
    return await service.get_status()


@router.get("/mcp/servers")
async def list_mcp_servers(
    service: Annotated[MCPService, Depends(mcp_service_dependency)],
) -> dict:
    """List all registered MCP servers with their metadata."""
    return {"servers": service.list_servers()}