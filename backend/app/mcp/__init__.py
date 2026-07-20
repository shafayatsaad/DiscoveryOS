"""Purpose: Group MCP-ready interfaces for external research tool integrations."""

from app.mcp.base import MCPServer
from app.mcp.client import MCPToolClient, MCPToolResult
from app.mcp.registry import MCPRegistry, build_mcp_registry
from app.mcp.service import MCPService

__all__ = [
    "MCPServer",
    "MCPToolClient",
    "MCPToolResult",
    "MCPRegistry",
    "build_mcp_registry",
    "MCPService",
]