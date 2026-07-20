"""Purpose: Implement the Memory MCP Server for in-memory key-value storage (dev/testing)."""

from datetime import UTC, datetime
from typing import Any

from app.mcp.base import MCPServer
from app.mcp.client import MCPToolResult


class MemoryMCPServer(MCPServer):
    """MCP server that stores research artifacts in memory.

    Useful for development, testing, and as a fallback when no persistent storage is configured.
    Data is lost when the process exits.

    Tools:
    - store: Store a value by key.
    - retrieve: Retrieve a value by key.
    - list_keys: List all keys with an optional prefix filter.
    - delete: Delete a value by key.
    - clear: Clear all stored values.
    """

    name = "memory"
    description = "In-memory key-value store for development, testing, and ephemeral artifact caching."
    available_tools = ["store", "retrieve", "list_keys", "delete", "clear"]

    def __init__(self) -> None:
        self._store: dict[str, str] = {}
        self._metadata: dict[str, dict[str, Any]] = {}

    async def call_tool(self, tool_name: str, arguments: dict[str, Any]) -> MCPToolResult:
        """Execute a memory tool."""
        try:
            if tool_name == "store":
                return await self._store_value(**arguments)
            if tool_name == "retrieve":
                return await self._retrieve_value(**arguments)
            if tool_name == "list_keys":
                return await self._list_keys(**arguments)
            if tool_name == "delete":
                return await self._delete_key(**arguments)
            if tool_name == "clear":
                return await self._clear_all(**arguments)
            return MCPToolResult(
                tool_name=tool_name,
                status="error",
                output={"error": f"Unknown tool: {tool_name}"},
            )
        except Exception as exc:
            return MCPToolResult(
                tool_name=tool_name,
                status="error",
                output={"error": str(exc)},
            )

    async def _store_value(self, key: str, value: str, **kwargs: Any) -> MCPToolResult:
        """Store a value by key."""
        self._store[key] = value
        self._metadata[key] = {
            "created_at": (
                self._metadata[key]["created_at"]
                if key in self._metadata
                else datetime.now(UTC).isoformat()
            ),
            "updated_at": datetime.now(UTC).isoformat(),
            "size_bytes": len(value),
        }
        return MCPToolResult(
            tool_name="store",
            status="ok",
            output={"key": key, "size_bytes": len(value)},
        )

    async def _retrieve_value(self, key: str, **kwargs: Any) -> MCPToolResult:
        """Retrieve a value by key."""
        value = self._store.get(key)
        if value is None:
            return MCPToolResult(
                tool_name="retrieve",
                status="error",
                output={"error": f"Key not found: {key}"},
            )
        return MCPToolResult(
            tool_name="retrieve",
            status="ok",
            output={"key": key, "value": value},
        )

    async def _list_keys(self, prefix: str = "", **kwargs: Any) -> MCPToolResult:
        """List all keys with an optional prefix filter."""
        keys = [
            {
                "key": k,
                "size_bytes": self._metadata.get(k, {}).get("size_bytes", 0),
                "created_at": self._metadata.get(k, {}).get("created_at"),
                "updated_at": self._metadata.get(k, {}).get("updated_at"),
            }
            for k in sorted(self._store.keys())
            if not prefix or k.startswith(prefix)
        ]
        return MCPToolResult(
            tool_name="list_keys",
            status="ok",
            output={"keys": keys, "count": len(keys)},
        )

    async def _delete_key(self, key: str, **kwargs: Any) -> MCPToolResult:
        """Delete a value by key."""
        existed = key in self._store
        self._store.pop(key, None)
        self._metadata.pop(key, None)
        return MCPToolResult(
            tool_name="delete",
            status="ok",
            output={"key": key, "deleted": existed},
        )

    async def _clear_all(self, **kwargs: Any) -> MCPToolResult:
        """Clear all stored values."""
        count = len(self._store)
        self._store.clear()
        self._metadata.clear()
        return MCPToolResult(
            tool_name="clear",
            status="ok",
            output={"cleared": True, "previous_count": count},
        )

    async def get_status(self) -> dict[str, Any]:
        """Return memory server health and metadata."""
        return {
            "name": self.name,
            "description": self.description,
            "available_tools": self.available_tools,
            "stored_keys": len(self._store),
            "healthy": True,
        }