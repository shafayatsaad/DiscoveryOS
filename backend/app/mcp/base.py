"""Purpose: Define the abstract base class shared by all MCP server implementations."""

from abc import ABC, abstractmethod
from typing import Any

from app.mcp.client import MCPToolResult


class MCPServer(ABC):
    """Abstract base for all MCP server integrations.

    Each server subclass provides:
    - A stable name and description
    - call_tool() for executing operations
    - get_status() for health checking

    New servers can be added by subclassing this and registering in the registry.
    Agents are NOT coupled to MCP servers — they interact only through the MCPService.
    """

    name: str = ""
    description: str = ""
    available_tools: list[str] = []

    @abstractmethod
    async def call_tool(self, tool_name: str, arguments: dict[str, Any]) -> MCPToolResult:
        """Execute a tool on this MCP server and return a structured result."""

    @abstractmethod
    async def get_status(self) -> dict[str, Any]:
        """Return health and metadata for this server."""