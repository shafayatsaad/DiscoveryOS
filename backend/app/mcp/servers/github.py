"""Purpose: Implement the GitHub MCP Server for saving research artifacts to GitHub."""

import json
from typing import Any

import httpx

from app.config import Settings, get_settings
from app.mcp.base import MCPServer
from app.mcp.client import MCPToolResult


class GitHubMCPServer(MCPServer):
    """MCP server that persists research artifacts to GitHub Gists and repositories.

    Requires DISCOVERYOS_GITHUB_TOKEN to be set in environment.
    Falls back gracefully when token is not configured.

    Tools:
    - create_gist: Create a public Gist with one or more files.
    - create_or_update_file: Create or update a file in a repository.
    - get_repo_contents: List contents of a repository path.
    """

    name = "github"
    description = "GitHub integration for saving research reports, gists, and repository artifacts."
    available_tools = ["create_gist", "create_or_update_file", "get_repo_contents"]

    def __init__(
        self,
        token: str | None = None,
        default_repo: str | None = None,
    ) -> None:
        self._token = token
        self._default_repo = default_repo
        self._api_base = "https://api.github.com"

    @property
    def is_available(self) -> bool:
        """Return True when a GitHub token is configured."""
        return bool(self._token)

    async def call_tool(self, tool_name: str, arguments: dict[str, Any]) -> MCPToolResult:
        """Execute a GitHub tool."""
        if not self.is_available:
            return MCPToolResult(
                tool_name=tool_name,
                status="error",
                output={"error": "GitHub token not configured. Set DISCOVERYOS_GITHUB_TOKEN."},
            )
        try:
            if tool_name == "create_gist":
                return await self._create_gist(**arguments)
            if tool_name == "create_or_update_file":
                return await self._create_or_update_file(**arguments)
            if tool_name == "get_repo_contents":
                return await self._get_repo_contents(**arguments)
            return MCPToolResult(
                tool_name=tool_name,
                status="error",
                output={"error": f"Unknown tool: {tool_name}"},
            )
        except httpx.HTTPStatusError as exc:
            return MCPToolResult(
                tool_name=tool_name,
                status="error",
                output={
                    "error": f"GitHub API error: {exc.response.status_code}",
                    "detail": exc.response.text,
                },
            )
        except Exception as exc:
            return MCPToolResult(
                tool_name=tool_name,
                status="error",
                output={"error": str(exc)},
            )

    async def _create_gist(
        self,
        filename: str,
        content: str,
        description: str = "DiscoveryOS research artifact",
        public: bool = False,
        **kwargs: Any,
    ) -> MCPToolResult:
        """Create a GitHub Gist with the given content."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self._api_base}/gists",
                headers=self._headers(),
                json={
                    "description": description,
                    "public": public,
                    "files": {filename: {"content": content}},
                },
            )
            response.raise_for_status()
            data = response.json()
            return MCPToolResult(
                tool_name="create_gist",
                status="ok",
                output={
                    "gist_id": data["id"],
                    "gist_url": data["html_url"],
                    "filename": filename,
                },
            )

    async def _create_or_update_file(
        self,
        path: str,
        content: str,
        message: str = "DiscoveryOS artifact update",
        repo: str | None = None,
        **kwargs: Any,
    ) -> MCPToolResult:
        """Create or update a file in a GitHub repository."""
        target_repo = repo or self._default_repo
        if not target_repo:
            return MCPToolResult(
                tool_name="create_or_update_file",
                status="error",
                output={"error": "No repository specified and no default repo configured."},
            )

        async with httpx.AsyncClient() as client:
            # Try to get existing file SHA
            get_response = await client.get(
                f"{self._api_base}/repos/{target_repo}/contents/{path}",
                headers=self._headers(),
            )
            sha = None
            if get_response.status_code == 200:
                sha = get_response.json().get("sha")

            # Create or update the file
            payload: dict[str, Any] = {
                "message": message,
                "content": self._encode_base64(content),
            }
            if sha:
                payload["sha"] = sha

            response = await client.put(
                f"{self._api_base}/repos/{target_repo}/contents/{path}",
                headers=self._headers(),
                json=payload,
            )
            response.raise_for_status()
            data = response.json()
            return MCPToolResult(
                tool_name="create_or_update_file",
                status="ok",
                output={
                    "repo": target_repo,
                    "path": path,
                    "commit_sha": data.get("content", {}).get("sha", ""),
                    "commit_url": f"https://github.com/{target_repo}/blob/main/{path}",
                },
            )

    async def _get_repo_contents(
        self,
        path: str = "",
        repo: str | None = None,
        **kwargs: Any,
    ) -> MCPToolResult:
        """List contents of a repository path."""
        target_repo = repo or self._default_repo
        if not target_repo:
            return MCPToolResult(
                tool_name="get_repo_contents",
                status="error",
                output={"error": "No repository specified."},
            )

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self._api_base}/repos/{target_repo}/contents/{path}",
                headers=self._headers(),
            )
            if response.status_code == 404:
                return MCPToolResult(
                    tool_name="get_repo_contents",
                    status="ok",
                    output={"files": [], "repo": target_repo, "path": path},
                )
            response.raise_for_status()
            data = response.json()
            files = [
                {"name": item["name"], "type": item["type"], "path": item["path"]}
                for item in (data if isinstance(data, list) else [data])
            ]
            return MCPToolResult(
                tool_name="get_repo_contents",
                status="ok",
                output={"files": files, "repo": target_repo, "path": path},
            )

    def _headers(self) -> dict[str, str]:
        """Return GitHub API headers with authorization."""
        return {
            "Authorization": f"Bearer {self._token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "DiscoveryOS/1.0",
        }

    def _encode_base64(self, content: str) -> str:
        """Encode content as base64 for GitHub API."""
        import base64
        return base64.b64encode(content.encode("utf-8")).decode("ascii")

    async def get_status(self) -> dict[str, Any]:
        """Return GitHub server health and metadata."""
        return {
            "name": self.name,
            "description": self.description,
            "available_tools": self.available_tools,
            "configured": self.is_available,
            "default_repo": self._default_repo,
            "healthy": self.is_available,
        }