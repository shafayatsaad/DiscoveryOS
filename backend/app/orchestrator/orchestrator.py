"""Purpose: Coordinate the complete DiscoveryOS pipeline across all agents."""

from datetime import UTC, datetime
from typing import Any

from app.agents.base import BaseResearchAgent
from app.agents.contradiction.detector import ContradictionAgent
from app.agents.contradiction.schemas import ContradictionDetectionRequest
from app.agents.experiment.planner import ExperimentAgent
from app.agents.experiment.schemas import ExperimentPlanningRequest
from app.agents.extractor.extractor import ExtractorAgent
from app.agents.extractor.schemas import EvidenceExtractionRequest
from app.agents.novelty.analyzer import NoveltyAgent
from app.agents.novelty.schemas import NoveltyAnalysisRequest
from app.agents.planner.planner import PlannerAgent
from app.agents.planner.schemas import ResearchPlan
from app.agents.report.report import ReportAgent
from app.agents.report.schemas import ScientificReportRequest
from app.agents.retriever.retriever import RetrieverAgent
from app.agents.retriever.schemas import PaperCollection
from app.graph.builder import KnowledgeGraphBuilder
from app.graph.schemas import KnowledgeGraph
from app.orchestrator.events import DiscoveryEvent, make_event
from app.orchestrator.state import (
    STAGE_LABELS,
    STAGE_ORDER,
    DiscoveryState,
    StageStatus,
)
from app.schemas.agent import AgentContext
from app.storage.state import InMemoryStateBackend, StateBackend
from app.workspace.schemas import (
    TimelineEvent,
    Workspace,
    WorkspaceArtifactAppend,
    WorkspacePatch,
)
from app.workspace.service import WorkspaceService


class DiscoveryOrchestrator:
    """Orchestrate the 8-stage DiscoveryOS pipeline with state tracking and resumability.

    Architectural decisions:
    - Dependency injection: All agents and services are injected, making the
      orchestrator fully testable without real infrastructure.
    - State as backbone: DiscoveryState is the single source of truth. Every
      stage reads from and writes to it, enabling resumability.
    - Stage abstraction: _execute_stage() handles timing, state transitions,
      progress, workspace saves, and event emission uniformly.
    - Streaming-ready: The event system and state object are designed so that
      a future streaming endpoint can emit events as they happen.
    - Resumable: resume() skips completed stages and runs from the first
      PENDING or FAILED stage.
    """

    def __init__(
        self,
        planner: PlannerAgent | None = None,
        retriever: RetrieverAgent | None = None,
        extractor: ExtractorAgent | None = None,
        contradiction: ContradictionAgent | None = None,
        novelty: NoveltyAgent | None = None,
        experiment: ExperimentAgent | None = None,
        report: ReportAgent | None = None,
        graph_builder: KnowledgeGraphBuilder | None = None,
        workspace_service: WorkspaceService | None = None,
        state_backend: StateBackend | None = None,
        max_papers_for_extraction: int = 5,
    ) -> None:
        self._planner = planner or PlannerAgent()
        self._retriever = retriever or RetrieverAgent()
        self._extractor = extractor or ExtractorAgent()
        self._contradiction = contradiction or ContradictionAgent()
        self._novelty = novelty or NoveltyAgent()
        self._experiment = experiment or ExperimentAgent()
        self._report = report or ReportAgent()
        self._graph_builder = graph_builder or KnowledgeGraphBuilder()
        self._workspace_service = workspace_service
        self._state_backend = state_backend or InMemoryStateBackend()
        self._max_papers_for_extraction = max_papers_for_extraction

    async def run(
        self,
        project_id: str,
        research_question: str,
        domain: str | None = None,
    ) -> DiscoveryState:
        """Execute the full 8-stage pipeline from scratch."""
        state = DiscoveryState(
            run_id=f"run_{project_id}",
            project_id=project_id,
            research_question=research_question,
            domain=domain,
        )
        return await self._execute_pipeline(state)

    async def resume(self, state: DiscoveryState) -> DiscoveryState:
        """Resume a previously paused or failed pipeline, skipping completed stages."""
        state.status = "running"
        event = make_event("pipeline.resumed", message="Pipeline execution resumed.")
        state.events.append(event.model_dump(mode="json"))
        return await self._execute_pipeline(state)

    async def get_state(self, run_id: str) -> DiscoveryState | None:
        """Load a pipeline state from the backend by run ID."""
        raw = await self._state_backend.get(f"pipeline:{run_id}")
        if raw is None:
            return None
        return DiscoveryState.model_validate_json(raw)

    async def _execute_pipeline(self, state: DiscoveryState) -> DiscoveryState:
        """Run all pending stages in order, updating state after each."""
        # Emit pipeline started event on first run
        if state.current_stage is None:
            event = make_event("pipeline.started", message="Pipeline execution started.")
            state.events.append(event.model_dump(mode="json"))
            await self._persist_state(state)

        for stage_name in STAGE_ORDER:
            # Skip already completed stages
            stage_state = state.stages.get(stage_name)
            if stage_state is not None and stage_state.status == StageStatus.COMPLETED:
                continue

            # Skip failed stages — pipeline is halted
            if stage_state is not None and stage_state.status == StageStatus.FAILED:
                continue

            state.mark_stage_running(stage_name)
            event = make_event(
                "stage.started",
                stage=stage_name,
                message=f"Starting stage: {STAGE_LABELS.get(stage_name, stage_name)}",
            )
            state.events.append(event.model_dump(mode="json"))
            await self._persist_state(state)

            try:
                await self._execute_stage(stage_name, state)
                state.mark_stage_completed(stage_name)
                event = make_event(
                    "stage.completed",
                    stage=stage_name,
                    message=f"Completed stage: {STAGE_LABELS.get(stage_name, stage_name)}",
                )
                state.events.append(event.model_dump(mode="json"))
                await self._update_workspace(stage_name, state)
                await self._persist_state(state)
            except Exception as exc:
                state.mark_stage_failed(stage_name, str(exc))
                event = make_event(
                    "stage.failed",
                    stage=stage_name,
                    message=f"Stage failed: {STAGE_LABELS.get(stage_name, stage_name)}",
                    error=str(exc),
                )
                state.events.append(event.model_dump(mode="json"))
                await self._persist_state(state)
                break

        # Check if all stages completed
        if state.status != "failed":
            completed = len(state.completed_stages())
            if completed == len(STAGE_ORDER):
                state.status = "completed"
                event = make_event(
                    "pipeline.completed",
                    message="Pipeline execution completed successfully.",
                )
                state.events.append(event.model_dump(mode="json"))
                await self._persist_state(state)

        return state

    async def _execute_stage(self, stage_name: str, state: DiscoveryState) -> None:
        """Execute a single pipeline stage by name."""
        stage_map = {
            "planner": self._run_planner,
            "retriever": self._run_retriever,
            "extractor": self._run_extractor,
            "knowledge_graph": self._run_knowledge_graph,
            "contradiction": self._run_contradiction,
            "novelty": self._run_novelty,
            "experiment": self._run_experiment,
            "report": self._run_report,
        }
        handler = stage_map.get(stage_name)
        if handler is None:
            raise ValueError(f"Unknown stage: {stage_name}")
        await handler(state)

    async def _run_planner(self, state: DiscoveryState) -> None:
        """Stage 1: Create a structured research plan."""
        context = AgentContext(
            project_id=state.project_id,
            research_goal=state.research_question,
            domain=state.domain,
        )
        plan: ResearchPlan = await self._planner.run(context)
        state.plan = plan.model_dump(mode="json")
        if state.domain is None:
            state.domain = plan.research_domain

    async def _run_retriever(self, state: DiscoveryState) -> None:
        """Stage 2: Retrieve literature based on the research plan."""
        if state.plan is None:
            raise RuntimeError("Cannot run retriever without a plan.")
        plan = ResearchPlan.model_validate(state.plan)
        collection: PaperCollection = await self._retriever.run(plan)
        state.papers = [paper.model_dump(mode="json") for paper in collection.papers]

    async def _run_extractor(self, state: DiscoveryState) -> None:
        """Stage 3: Extract structured evidence from retrieved papers."""
        if not state.papers:
            raise RuntimeError("Cannot run extractor without retrieved papers.")
        from app.agents.extractor.schemas import EvidenceCollection
        from app.agents.retriever.schemas import Paper

        papers = [Paper.model_validate(p) for p in state.papers[:self._max_papers_for_extraction]]
        request = EvidenceExtractionRequest(
            research_goal=state.research_question,
            domain=state.domain or "General Science",
            papers=papers,
        )
        evidence: EvidenceCollection = await self._extractor.run(request)
        state.evidence = [e.model_dump(mode="json") for e in evidence.evidence]

    async def _run_knowledge_graph(self, state: DiscoveryState) -> None:
        """Stage 4: Build a knowledge graph from extracted evidence."""
        workspace = self._build_workspace_from_state(state)
        graph: KnowledgeGraph = self._graph_builder.build(workspace)
        state.knowledge_graph = graph.model_dump(mode="json")

    async def _run_contradiction(self, state: DiscoveryState) -> None:
        """Stage 5: Detect contradictions across evidence."""
        workspace = self._build_workspace_from_state(state)
        graph = (
            KnowledgeGraph.model_validate(state.knowledge_graph)
            if state.knowledge_graph
            else None
        )
        request = ContradictionDetectionRequest(workspace=workspace, knowledge_graph=graph)
        from app.agents.contradiction.schemas import ContradictionAnalysis
        analysis: ContradictionAnalysis = await self._contradiction.run(request)
        state.contradictions = [c.model_dump(mode="json") for c in analysis.contradictions]

    async def _run_novelty(self, state: DiscoveryState) -> None:
        """Stage 6: Analyze novelty of the research."""
        workspace = self._build_workspace_from_state(state)
        graph = (
            KnowledgeGraph.model_validate(state.knowledge_graph)
            if state.knowledge_graph
            else None
        )
        from app.agents.contradiction.schemas import ContradictionAnalysis
        contradictions = ContradictionAnalysis(
            contradictions=[
                # Reconstruct from serialized dicts
            ],
            analyzed_evidence_count=len(state.evidence),
        )
        if state.contradictions:
            from app.agents.contradiction.schemas import Contradiction
            contradictions.contradictions = [
                Contradiction.model_validate(c) for c in state.contradictions
            ]
        request = NoveltyAnalysisRequest(
            workspace=workspace,
            knowledge_graph=graph,
            contradictions=contradictions,
        )
        from app.agents.novelty.schemas import NoveltyAnalysis
        analysis: NoveltyAnalysis = await self._novelty.run(request)
        state.novelty_analysis = analysis.model_dump(mode="json")

    async def _run_experiment(self, state: DiscoveryState) -> None:
        """Stage 7: Plan validation experiments."""
        workspace = self._build_workspace_from_state(state)
        graph = (
            KnowledgeGraph.model_validate(state.knowledge_graph)
            if state.knowledge_graph
            else None
        )
        novelty = (
            None
            if state.novelty_analysis is None
            else None  # Will be passed as dict via workspace
        )
        request = ExperimentPlanningRequest(
            workspace=workspace,
            knowledge_graph=graph,
            novelty_analysis=(
                None
                if state.novelty_analysis is None
                else None
            ),
        )
        from app.agents.experiment.schemas import ExperimentPlan
        plan: ExperimentPlan = await self._experiment.run(request)
        state.suggested_experiments = [
            e.model_dump(mode="json") for e in plan.suggested_experiments
        ]

    async def _run_report(self, state: DiscoveryState) -> None:
        """Stage 8: Generate the final research report."""
        workspace = self._build_workspace_from_state(state)
        graph = (
            KnowledgeGraph.model_validate(state.knowledge_graph)
            if state.knowledge_graph
            else None
        )
        request = ScientificReportRequest(
            workspace=workspace,
            knowledge_graph=graph,
        )
        from app.agents.report.schemas import ScientificReport
        report: ScientificReport = await self._report.run(request)
        state.report = report.model_dump(mode="json")

    def _build_workspace_from_state(self, state: DiscoveryState) -> Workspace:
        """Build a Workspace schema from the current DiscoveryState for agent compatibility."""
        now = datetime.now(UTC)
        return Workspace(
            id=f"ws_{state.project_id}",
            project_id=state.project_id,
            research_goal=state.research_question,
            research_plan=state.plan,
            retrieved_papers=state.papers,
            extracted_evidence=state.evidence,
            knowledge_graph=state.knowledge_graph,
            contradictions=state.contradictions,
            novelty_analysis=state.novelty_analysis,
            suggested_experiments=state.suggested_experiments,
            generated_reports=(
                [state.report] if state.report else []
            ),
            created_at=now,
            updated_at=now,
        )

    async def _update_workspace(self, stage_name: str, state: DiscoveryState) -> None:
        """Persist the current pipeline outputs to the workspace service."""
        if self._workspace_service is None:
            return

        workspace = self._build_workspace_from_state(state)
        patch = WorkspacePatch(
            research_goal=state.research_question,
            research_plan=state.plan,
            retrieved_papers=state.papers,
            extracted_evidence=state.evidence,
            knowledge_graph=state.knowledge_graph,
            contradictions=state.contradictions,
            novelty_analysis=state.novelty_analysis,
            suggested_experiments=state.suggested_experiments,
        )
        self._workspace_service.update_workspace(state.project_id, patch)

        # Append timeline event
        self._workspace_service.append_artifact(
            project_id=state.project_id,
            request=WorkspaceArtifactAppend(
                artifact_kind="timeline_events",
                artifact={
                    "event_type": f"stage.{stage_name}.completed",
                    "message": f"Stage completed: {STAGE_LABELS.get(stage_name, stage_name)}",
                    "status": "completed",
                },
                event_message=f"Stage completed: {STAGE_LABELS.get(stage_name, stage_name)}",
            ),
        )

    async def _persist_state(self, state: DiscoveryState) -> None:
        """Persist the current state to the state backend for resumability."""
        await self._state_backend.set(
            f"pipeline:{state.run_id}",
            state.model_dump_json(),
        )