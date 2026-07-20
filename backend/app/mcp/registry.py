"""Purpose: Maintain a registry of MCP servers and provide a factory for building them."""

from typing import Any

from app.config import Settings
from app.mcp.base import MCPServer
from app.mcp.client import MCPToolResult
from app.mcp.servers.filesystem import FilesystemMCPServer
from app.mcp.servers.github import GitHubMCPServer
from app.mcp.servers.memory import MemoryMCPServer


class MCPRegistry:
    """Registry of MCP servers that can be looked up by name.

    New servers can be added by registering them here. Agents and services
    access servers through this registry, so adding a new server requires
    no changes outside this module and the factory function.
    """

    def __init__(self, servers: list[MCPServer] | None = None) -> None:
        self._servers: dict[str, MCPServer] = {}
        if servers:
            for server in servers:
                self._servers[server.name] = server

    def register(self, server: MCPServer) -> None:
        """Register a new MCP server."""
        self._servers[server.name] = server

    def get(self, name: str) -> MCPServer | None:
        """Get a server by name."""
        return self._servers.get(name)

    def list_servers(self) -> dict[str, dict[str, Any]]:
        """List all registered servers with their metadata."""
        return {
            name: {
                "name": server.name,
                "description": server.description,
                "available_tools": server.available_tools,
            }
            for name, server in self._servers.items()
        }

    async def call_tool(
        self,
        server_name: str,
        tool_name: str,
        arguments: dict[str, Any],
    ) -> MCPToolResult:
        """Call a tool on a specific server by name."""
        server = self.get(server_name)
        if server is None:
            return MCPToolResult(
                tool_name=tool_name,
                status="error",
                output={"error": f"Unknown MCP server: {server_name}"},
            )
        return await server.call_tool(tool_name, arguments)

    async def all_status(self) -> dict[str, dict[str, Any]]:
        """Get health status of all registered servers."""
        statuses: dict[str, dict[str, Any]] = {}
        for name, server in self._servers.items():
            try:
                statuses[name] = await server.get_status()
            except Exception as exc:
                statuses[name] = {
                    "name": name,
                    "healthy": False,
                    "error": str(exc),
                }
        return statuses


def build_mcp_registry(settings: Settings) -> MCPRegistry:
    """Build the default MCP registry with configured servers.

    Adding a new server type:
    1. Create the server class in app/mcp/servers/
    2. Import it here
    3. Instantiate and register it below

    No other code needs to change.
    """
    servers: list[MCPServer] = [
        FilesystemMCPServer(
            root_path=settings.mcp_filesystem_root,
        ),
        GitHubMCPServer(
            token=settings.github_token,
            default_repo=settings.github_repo,
        ),
        MemoryMCPServer(),
    ]
    return MCPRegistry(servers=servers)