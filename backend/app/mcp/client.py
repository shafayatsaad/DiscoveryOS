"""Purpose: Define MCP tool-client contracts without implementing external tool calls."""

from typing import Any, Protocol

from pydantic import BaseModel, ConfigDict, Field


class MCPToolResult(BaseModel):
    """Structured result envelope for future MCP tool calls."""

    tool_name: str
    status: str
    output: dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(extra="forbid")


class MCPToolClient(Protocol):
    """Protocol for future MCP clients used by retrieval and artifact agents."""

    async def call_tool(self, tool_name: str, arguments: dict[str, Any]) -> MCPToolResult:
        """Call an external MCP tool and return a structured result."""
