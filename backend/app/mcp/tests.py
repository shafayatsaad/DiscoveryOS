"""Purpose: Unit and integration tests for MCP servers, registry, and service."""

import json
import tempfile
from pathlib import Path

import pytest

from app.mcp.registry import MCPRegistry
from app.mcp.servers.filesystem import FilesystemMCPServer
from app.mcp.servers.memory import MemoryMCPServer
from app.mcp.service import MCPService


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture
def memory_server() -> MemoryMCPServer:
    return MemoryMCPServer()


@pytest.fixture
def fs_server() -> FilesystemMCPServer:
    with tempfile.TemporaryDirectory() as tmpdir:
        server = FilesystemMCPServer(root_path=tmpdir)
        yield server


@pytest.fixture
def registry(memory_server: MemoryMCPServer) -> MCPRegistry:
    return MCPRegistry(servers=[memory_server])


@pytest.fixture
def mcp_service(registry: MCPRegistry) -> MCPService:
    return MCPService(registry=registry)


# ---------------------------------------------------------------------------
# Memory Server Tests
# ---------------------------------------------------------------------------


class TestMemoryMCPServer:
    """Verify in-memory key-value storage operations."""

    @pytest.mark.asyncio
    async def test_store_and_retrieve(self, memory_server: MemoryMCPServer) -> None:
        """Store a value and retrieve it."""
        store_result = await memory_server.call_tool("store", {"key": "test_key", "value": "test_value"})
        assert store_result.status == "ok"

        retrieve_result = await memory_server.call_tool("retrieve", {"key": "test_key"})
        assert retrieve_result.status == "ok"
        assert retrieve_result.output["value"] == "test_value"

    @pytest.mark.asyncio
    async def test_retrieve_nonexistent(self, memory_server: MemoryMCPServer) -> None:
        """Retrieving a nonexistent key returns an error."""
        result = await memory_server.call_tool("retrieve", {"key": "nonexistent"})
        assert result.status == "error"

    @pytest.mark.asyncio
    async def test_list_keys(self, memory_server: MemoryMCPServer) -> None:
        """List keys with prefix filtering."""
        await memory_server.call_tool("store", {"key": "report:123", "value": "data"})
        await memory_server.call_tool("store", {"key": "workspace:123", "value": "data"})
        await memory_server.call_tool("store", {"key": "report:456", "value": "data"})

        result = await memory_server.call_tool("list_keys", {"prefix": "report:"})
        assert result.status == "ok"
        assert result.output["count"] == 2

    @pytest.mark.asyncio
    async def test_delete_key(self, memory_server: MemoryMCPServer) -> None:
        """Delete a stored key."""
        await memory_server.call_tool("store", {"key": "delete_me", "value": "data"})
        result = await memory_server.call_tool("delete", {"key": "delete_me"})
        assert result.status == "ok"
        assert result.output["deleted"] is True

        # Verify it's gone
        retrieve = await memory_server.call_tool("retrieve", {"key": "delete_me"})
        assert retrieve.status == "error"

    @pytest.mark.asyncio
    async def test_clear_all(self, memory_server: MemoryMCPServer) -> None:
        """Clear all stored keys."""
        await memory_server.call_tool("store", {"key": "a", "value": "1"})
        await memory_server.call_tool("store", {"key": "b", "value": "2"})
        result = await memory_server.call_tool("clear", {})
        assert result.status == "ok"
        assert result.output["previous_count"] == 2

    @pytest.mark.asyncio
    async def test_get_status(self, memory_server: MemoryMCPServer) -> None:
        """Status should report health."""
        status = await memory_server.get_status()
        assert status["healthy"] is True
        assert status["name"] == "memory"

    @pytest.mark.asyncio
    async def test_unknown_tool(self, memory_server: MemoryMCPServer) -> None:
        """Unknown tool returns error."""
        result = await memory_server.call_tool("nonexistent", {})
        assert result.status == "error"


# ---------------------------------------------------------------------------
# Filesystem Server Tests
# ---------------------------------------------------------------------------


class TestFilesystemMCPServer:
    """Verify filesystem persistence operations."""

    @pytest.mark.asyncio
    async def test_write_and_read_file(self, fs_server: FilesystemMCPServer) -> None:
        """Write content to a file and read it back."""
        write_result = await fs_server.call_tool(
            "write_file", {"path": "test/hello.txt", "content": "Hello, World!"},
        )
        assert write_result.status == "ok"
        assert write_result.output["size_bytes"] > 0

        read_result = await fs_server.call_tool("read_file", {"path": "test/hello.txt"})
        assert read_result.status == "ok"
        assert read_result.output["content"] == "Hello, World!"

    @pytest.mark.asyncio
    async def test_list_files(self, fs_server: FilesystemMCPServer) -> None:
        """List files under a prefix."""
        await fs_server.call_tool("write_file", {"path": "project1/report.md", "content": "# Report"})
        await fs_server.call_tool("write_file", {"path": "project2/report.md", "content": "# Report 2"})

        result = await fs_server.call_tool("list_files", {"prefix": "project1"})
        assert result.status == "ok"
        assert result.output["count"] == 1

    @pytest.mark.asyncio
    async def test_delete_file(self, fs_server: FilesystemMCPServer) -> None:
        """Delete a file."""
        await fs_server.call_tool("write_file", {"path": "delete_me.txt", "content": "bye"})
        result = await fs_server.call_tool("delete_file", {"path": "delete_me.txt"})
        assert result.status == "ok"
        assert result.output["deleted"] is True

    @pytest.mark.asyncio
    async def test_read_nonexistent(self, fs_server: FilesystemMCPServer) -> None:
        """Reading a nonexistent file returns error."""
        result = await fs_server.call_tool("read_file", {"path": "nonexistent.txt"})
        assert result.status == "error"

    def test_path_traversal_prevented(self) -> None:
        """Directory traversal should be prevented."""
        import tempfile
        with tempfile.TemporaryDirectory() as tmpdir:
            server = FilesystemMCPServer(root_path=tmpdir)
            with pytest.raises(ValueError, match="Path traversal"):
                server._resolve_path("../../etc/passwd")


# ---------------------------------------------------------------------------
# Registry Tests
# ---------------------------------------------------------------------------


class TestMCPRegistry:
    """Verify server registry operations."""

    def test_register_and_get(self, memory_server: MemoryMCPServer) -> None:
        """Register a server and retrieve it by name."""
        registry = MCPRegistry()
        registry.register(memory_server)
        assert registry.get("memory") is memory_server
        assert registry.get("nonexistent") is None

    def test_list_servers(self, memory_server: MemoryMCPServer) -> None:
        """List all registered servers."""
        registry = MCPRegistry(servers=[memory_server])
        servers = registry.list_servers()
        assert "memory" in servers

    @pytest.mark.asyncio
    async def test_call_tool_unknown_server(self, registry: MCPRegistry) -> None:
        """Calling a tool on an unknown server returns error."""
        result = await registry.call_tool("nonexistent", "store", {})
        assert result.status == "error"

    @pytest.mark.asyncio
    async def test_all_status(self, registry: MCPRegistry) -> None:
        """All servers should report health status."""
        statuses = await registry.all_status()
        assert "memory" in statuses
        assert statuses["memory"]["healthy"] is True


# ---------------------------------------------------------------------------
# Service Tests
# ---------------------------------------------------------------------------


class TestMCPService:
    """Verify high-level MCPService operations."""

    @pytest.mark.asyncio
    async def test_save_report(self, mcp_service: MCPService) -> None:
        """Saving a report should persist through memory server."""
        report = {
            "title": "Test Report",
            "markdown": "# Test",
            "references": ["Ref 1"],
        }
        results = await mcp_service.save_report("project_123", report)
        assert len(results) > 0
        # At least the memory server result should be ok
        memory_results = [r for r in results if r["tool_name"] == "store"]
        assert len(memory_results) > 0

    @pytest.mark.asyncio
    async def test_save_report_none(self, mcp_service: MCPService) -> None:
        """Saving a None report returns empty list."""
        results = await mcp_service.save_report("project_123", None)
        assert results == []

    @pytest.mark.asyncio
    async def test_persist_workspace(self, mcp_service: MCPService) -> None:
        """Persisting workspace should store data."""
        workspace = {"project_id": "p123", "papers": []}
        results = await mcp_service.persist_workspace("p123", workspace)
        assert len(results) > 0

    @pytest.mark.asyncio
    async def test_save_stage_artifact(self, mcp_service: MCPService) -> None:
        """Saving a stage artifact should persist."""
        artifact = {"stage": "planner", "plan": {}}
        results = await mcp_service.save_stage_artifact("p123", "planner", artifact)
        assert len(results) > 0

    @pytest.mark.asyncio
    async def test_get_status(self, mcp_service: MCPService) -> None:
        """Status should report all servers."""
        status = await mcp_service.get_status()
        assert status["enabled"] is True
        assert status["server_count"] > 0

    def test_list_servers(self, mcp_service: MCPService) -> None:
        """List servers should return metadata."""
        servers = mcp_service.list_servers()
        assert "memory" in servers