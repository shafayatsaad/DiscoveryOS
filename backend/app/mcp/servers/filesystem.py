"""Purpose: Implement the Filesystem MCP Server for persisting research artifacts to disk."""

import json
import os
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from app.mcp.base import MCPServer
from app.mcp.client import MCPToolResult


class FilesystemMCPServer(MCPServer):
    """MCP server that persists research artifacts to the local filesystem.

    Tools:
    - write_file: Write content to a file within the configured root directory.
    - read_file: Read content from a file within the configured root directory.
    - list_files: List files under a prefix within the configured root directory.
    - delete_file: Delete a file within the configured root directory.
    """

    name = "filesystem"
    description = "Local filesystem persistence for research artifacts, reports, and workspace snapshots."
    available_tools = ["write_file", "read_file", "list_files", "delete_file"]

    def __init__(self, root_path: str = "./storage/artifacts") -> None:
        self._root = Path(root_path).resolve()
        self._root.mkdir(parents=True, exist_ok=True)

    def _resolve_path(self, relative_path: str) -> Path:
        """Resolve a relative path and ensure it stays within the root directory."""
        # Sanitize — prevent directory traversal
        sanitized = relative_path.replace("..", "").lstrip("/").lstrip("\\")
        full_path = (self._root / sanitized).resolve()
        if not str(full_path).startswith(str(self._root)):
            raise ValueError(f"Path traversal detected: {relative_path}")
        return full_path

    async def call_tool(self, tool_name: str, arguments: dict[str, Any]) -> MCPToolResult:
        """Execute a filesystem tool."""
        try:
            if tool_name == "write_file":
                return await self._write_file(**arguments)
            if tool_name == "read_file":
                return await self._read_file(**arguments)
            if tool_name == "list_files":
                return await self._list_files(**arguments)
            if tool_name == "delete_file":
                return await self._delete_file(**arguments)
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

    async def _write_file(self, path: str, content: str, **kwargs: Any) -> MCPToolResult:
        """Write content to a file. Creates parent directories if needed."""
        resolved = self._resolve_path(path)
        resolved.parent.mkdir(parents=True, exist_ok=True)
        resolved.write_text(content, encoding="utf-8")
        return MCPToolResult(
            tool_name="write_file",
            status="ok",
            output={"path": str(resolved), "size_bytes": resolved.stat().st_size},
        )

    async def _read_file(self, path: str, **kwargs: Any) -> MCPToolResult:
        """Read content from a file."""
        resolved = self._resolve_path(path)
        if not resolved.exists():
            return MCPToolResult(
                tool_name="read_file",
                status="error",
                output={"error": f"File not found: {path}"},
            )
        content = resolved.read_text(encoding="utf-8")
        return MCPToolResult(
            tool_name="read_file",
            status="ok",
            output={"path": str(resolved), "content": content},
        )

    async def _list_files(self, prefix: str = "", **kwargs: Any) -> MCPToolResult:
        """List files under a prefix path."""
        search_dir = self._resolve_path(prefix) if prefix else self._root
        if not search_dir.exists() or not search_dir.is_dir():
            return MCPToolResult(
                tool_name="list_files",
                status="ok",
                output={"files": [], "prefix": prefix},
            )
        files = []
        for child in sorted(search_dir.rglob("*")):
            if child.is_file():
                rel_path = str(child.relative_to(self._root))
                files.append({
                    "path": rel_path,
                    "size_bytes": child.stat().st_size,
                    "modified": datetime.fromtimestamp(
                        child.stat().st_mtime, tz=UTC
                    ).isoformat(),
                })
        return MCPToolResult(
            tool_name="list_files",
            status="ok",
            output={"files": files, "prefix": prefix, "count": len(files)},
        )

    async def _delete_file(self, path: str, **kwargs: Any) -> MCPToolResult:
        """Delete a file."""
        resolved = self._resolve_path(path)
        if not resolved.exists():
            return MCPToolResult(
                tool_name="delete_file",
                status="ok",
                output={"message": f"File does not exist: {path}"},
            )
        resolved.unlink()
        return MCPToolResult(
            tool_name="delete_file",
            status="ok",
            output={"path": str(resolved), "deleted": True},
        )

    async def get_status(self) -> dict[str, Any]:
        """Return filesystem server health and metadata."""
        return {
            "name": self.name,
            "description": self.description,
            "available_tools": self.available_tools,
            "root_path": str(self._root),
            "total_files": sum(1 for _ in self._root.rglob("*") if _.is_file()),
            "healthy": True,
        }