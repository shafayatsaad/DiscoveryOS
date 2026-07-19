"""Purpose: Provide the high-level OrchestratorService for API and external use."""

from app.orchestrator.orchestrator import DiscoveryOrchestrator
from app.orchestrator.state import DiscoveryState
from app.storage.state import InMemoryStateBackend, StateBackend
from app.workspace.service import WorkspaceService


class OrchestratorService:
    """High-level service wrapping the orchestrator with state persistence.

    This service is the primary entry point for API routes. It manages
    pipeline lifecycle: start, get state, and resume.
    """

    def __init__(
        self,
        orchestrator: DiscoveryOrchestrator | None = None,
        state_backend: StateBackend | None = None,
    ) -> None:
        self._orchestrator = orchestrator or DiscoveryOrchestrator()
        self._state_backend = state_backend or InMemoryStateBackend()

    async def start_pipeline(
        self,
        project_id: str,
        research_question: str,
        domain: str | None = None,
    ) -> DiscoveryState:
        """Start a new pipeline execution from scratch."""
        return await self._orchestrator.run(
            project_id=project_id,
            research_question=research_question,
            domain=domain,
        )

    async def get_pipeline_state(self, run_id: str) -> DiscoveryState | None:
        """Retrieve the current state of a pipeline by run ID."""
        return await self._orchestrator.get_state(run_id)

    async def resume_pipeline(self, run_id: str) -> DiscoveryState | None:
        """Resume a previously paused or failed pipeline."""
        state = await self._orchestrator.get_state(run_id)
        if state is None:
            return None
        return await self._orchestrator.resume(state)