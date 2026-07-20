"""Purpose: Provide high-level MCPService for orchestrator and API integration.

Agents are NOT coupled to MCP. They don't know MCP exists.
The MCPService is called by the orchestrator after pipeline stages complete.
"""

import json
from typing import Any

from app.mcp.registry import MCPRegistry


class MCPService:
    """High-level service wrapping MCP registry operations for the orchestrator.

    The orchestrator calls save_report() and persist_workspace() after pipeline stages.
    Individual MCP servers handle their specific persistence mechanisms.
    """

    def __init__(self, registry: MCPRegistry) -> None:
        self._registry = registry

    async def save_report(
        self,
        project_id: str,
        report: dict[str, Any] | None,
    ) -> list[dict[str, Any]]:
        """Save a research report through all available MCP servers.

        Saves to filesystem and optionally to GitHub.
        Returns a list of results from each server.
        """
        if report is None:
            return []

        results: list[dict[str, Any]] = []
        report_json = json.dumps(report, indent=2)

        # Save to filesystem
        fs_result = await self._registry.call_tool(
            "filesystem",
            "write_file",
            {
                "path": f"projects/{project_id}/report.json",
                "content": report_json,
            },
        )
        results.append(fs_result.model_dump(mode="json"))

        # Also save markdown if available
        markdown = report.get("markdown")
        if markdown:
            md_result = await self._registry.call_tool(
                "filesystem",
                "write_file",
                {
                    "path": f"projects/{project_id}/report.md",
                    "content": markdown,
                },
            )
            results.append(md_result.model_dump(mode="json"))

        # Save to memory for quick access
        mem_result = await self._registry.call_tool(
            "memory",
            "store",
            {
                "key": f"report:{project_id}",
                "value": report_json,
            },
        )
        results.append(mem_result.model_dump(mode="json"))

        # Try GitHub if configured
        gist_result = await self._registry.call_tool(
            "github",
            "create_gist",
            {
                "filename": f"discoveryos-report-{project_id}.md",
                "content": markdown or report_json,
                "description": f"DiscoveryOS research report for project {project_id}",
            },
        )
        results.append(gist_result.model_dump(mode="json"))

        return results

    async def persist_workspace(
        self,
        project_id: str,
        workspace_data: dict[str, Any],
    ) -> list[dict[str, Any]]:
        """Persist workspace artifacts through MCP servers."""
        results: list[dict[str, Any]] = []
        data_json = json.dumps(workspace_data, indent=2)

        # Save to filesystem
        fs_result = await self._registry.call_tool(
            "filesystem",
            "write_file",
            {
                "path": f"projects/{project_id}/workspace.json",
                "content": data_json,
            },
        )
        results.append(fs_result.model_dump(mode="json"))

        # Save to memory
        mem_result = await self._registry.call_tool(
            "memory",
            "store",
            {
                "key": f"workspace:{project_id}",
                "value": data_json,
            },
        )
        results.append(mem_result.model_dump(mode="json"))

        return results

    async def save_stage_artifact(
        self,
        project_id: str,
        stage_name: str,
        artifact: dict[str, Any],
    ) -> list[dict[str, Any]]:
        """Persist a single stage artifact through MCP servers."""
        results: list[dict[str, Any]] = []
        data_json = json.dumps(artifact, indent=2)

        # Save to filesystem
        fs_result = await self._registry.call_tool(
            "filesystem",
            "write_file",
            {
                "path": f"projects/{project_id}/stages/{stage_name}.json",
                "content": data_json,
            },
        )
        results.append(fs_result.model_dump(mode="json"))

        return results

    async def get_status(self) -> dict[str, Any]:
        """Return health status of all registered MCP servers."""
        return {
            "enabled": True,
            "servers": await self._registry.all_status(),
            "server_count": len(self._registry.list_servers()),
        }

    def list_servers(self) -> dict[str, Any]:
        """List all registered MCP servers with their metadata."""
        return self._registry.list_servers()