"""Purpose: Integration tests for the Discovery Orchestrator pipeline."""

import pytest

from app.agents.base import BaseResearchAgent
from app.agents.contradiction.schemas import (
    Contradiction,
    ContradictionAnalysis,
    ContradictionDetectionRequest,
    SupportingPaper,
)
from app.agents.experiment.schemas import ExperimentPlan, ExperimentPlanningRequest, SuggestedExperiment
from app.agents.extractor.schemas import EvidenceCollection, EvidenceExtractionRequest, PaperEvidence
from app.agents.novelty.schemas import NoveltyAnalysis, NoveltyAnalysisRequest, RelatedWork
from app.agents.planner.schemas import PaperSource, ResearchPlan, SearchQuery
from app.agents.report.schemas import ScientificReport, ScientificReportRequest
from app.agents.retriever.schemas import Paper, PaperCollection
from app.graph.schemas import GraphEdge, GraphNode, KnowledgeGraph
from app.orchestrator.events import DiscoveryEvent, make_event
from app.orchestrator.orchestrator import DiscoveryOrchestrator
from app.orchestrator.service import OrchestratorService
from app.orchestrator.state import (
    STAGE_ORDER,
    DiscoveryState,
    StageState,
    StageStatus,
)
from app.schemas.agent import AgentContext
from app.storage.state import InMemoryStateBackend


# ---------------------------------------------------------------------------
# Mock agents
# ---------------------------------------------------------------------------


class MockPlanner(BaseResearchAgent):
    """Mock planner that returns a deterministic ResearchPlan."""

    name = "planner"
    description = "Mock planner for testing."

    async def run(self, context: AgentContext) -> ResearchPlan:
        return ResearchPlan(
            research_goal=context.research_goal or "Test question",
            research_domain=context.domain or "General Science",
            objectives=["Test objective"],
            sub_problems=["Test sub-problem"],
            keywords=["test", "mock"],
            search_queries=[SearchQuery(query="test query", rationale="Test rationale")],
            recommended_data_sources=["Test source"],
            paper_sources=[PaperSource(name="Test", priority=1, reason="Test reason")],
            potential_risks=["Test risk"],
            expected_deliverables=["Test deliverable"],
        )


class MockRetriever(BaseResearchAgent):
    """Mock retriever that returns a deterministic PaperCollection."""

    name = "retriever"
    description = "Mock retriever for testing."

    async def run(self, plan: ResearchPlan) -> PaperCollection:
        return PaperCollection(
            papers=[
                Paper(
                    title="Test Paper",
                    authors=["Author A"],
                    year=2024,
                    doi="10.1234/test",
                    source="Mock",
                    abstract="This is a test abstract for testing purposes.",
                    keywords=["test"],
                ),
            ],
            query_count=1,
            provider_count=1,
            sources=["Mock"],
        )


class MockExtractor(BaseResearchAgent):
    """Mock extractor that returns deterministic evidence."""

    name = "extractor"
    description = "Mock extractor for testing."

    async def run(self, request: EvidenceExtractionRequest) -> EvidenceCollection:
        return EvidenceCollection(
            evidence=[
                PaperEvidence(
                    paper_title=request.papers[0].title if request.papers else "Test",
                    source="Mock",
                    doi=request.papers[0].doi if request.papers else None,
                    claims=[],
                    methods=[],
                    results=[],
                    limitations=[],
                    confidence=0.5,
                    key_entities=["test_entity"],
                    evidence_snippets=[],
                ),
            ],
            extracted_count=1,
        )


class MockContradiction(BaseResearchAgent):
    """Mock contradiction detector."""

    name = "contradiction"
    description = "Mock contradiction for testing."

    async def run(self, request: ContradictionDetectionRequest) -> ContradictionAnalysis:
        return ContradictionAnalysis(
            contradictions=[
                Contradiction(
                    statement_a="Claim A",
                    statement_b="Claim B",
                    supporting_papers=[
                        SupportingPaper(title="Paper 1", doi="10.1234/1", source="Mock"),
                        SupportingPaper(title="Paper 2", doi="10.1234/2", source="Mock"),
                    ],
                    possible_causes=["Different methods"],
                    confidence=0.6,
                    severity="medium",
                ),
            ],
            analyzed_evidence_count=1,
        )


class MockNovelty(BaseResearchAgent):
    """Mock novelty analyzer."""

    name = "novelty"
    description = "Mock novelty for testing."

    async def run(self, request: NoveltyAnalysisRequest) -> NoveltyAnalysis:
        return NoveltyAnalysis(
            novelty_score=0.5,
            category="Moderately Explored",
            reasoning=["Test reasoning"],
            related_work=[],
            research_opportunities=["Test opportunity"],
        )


class MockExperiment(BaseResearchAgent):
    """Mock experiment planner."""

    name = "experiment"
    description = "Mock experiment for testing."

    async def run(self, request: ExperimentPlanningRequest) -> ExperimentPlan:
        return ExperimentPlan(
            suggested_experiments=[
                SuggestedExperiment(
                    title="Test Experiment",
                    objective="Test objective",
                    required_datasets=["Test dataset"],
                    evaluation_metrics=["Test metric"],
                    variables=["Test variable"],
                    potential_risks=["Test risk"],
                    expected_outcomes=["Test outcome"],
                    evidence_links=["10.1234/test"],
                ),
            ],
            planning_notes=["Test note"],
        )


class MockReport(BaseResearchAgent):
    """Mock report generator."""

    name = "report"
    description = "Mock report for testing."

    async def run(self, request: ScientificReportRequest) -> ScientificReport:
        return ScientificReport(
            title="Test Report",
            markdown="# Test Report\n\nTest content.",
            html="<article><h1>Test Report</h1><p>Test content.</p></article>",
            references=["Test reference"],
        )


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture
def mock_orchestrator() -> DiscoveryOrchestrator:
    """Create an orchestrator with all mock agents."""
    return DiscoveryOrchestrator(
        planner=MockPlanner(),
        retriever=MockRetriever(),
        extractor=MockExtractor(),
        contradiction=MockContradiction(),
        novelty=MockNovelty(),
        experiment=MockExperiment(),
        report=MockReport(),
        state_backend=InMemoryStateBackend(),
    )


@pytest.fixture
def orchestrator_service(mock_orchestrator: DiscoveryOrchestrator) -> OrchestratorService:
    """Create an orchestrator service with mock agents."""
    return OrchestratorService(
        orchestrator=mock_orchestrator,
        state_backend=InMemoryStateBackend(),
    )


# ---------------------------------------------------------------------------
# State tests
# ---------------------------------------------------------------------------


class TestDiscoveryState:
    """Verify DiscoveryState transitions and helpers."""

    def test_initial_state(self) -> None:
        """A fresh state should start with running status and zero progress."""
        state = DiscoveryState(
            run_id="run_test",
            project_id="project_test",
            research_question="Test question",
        )
        assert state.status == "running"
        assert state.progress == 0.0
        assert state.current_stage is None
        assert len(state.stages) == 0

    def test_mark_stage_running(self) -> None:
        """mark_stage_running should set the stage to RUNNING."""
        state = DiscoveryState(
            run_id="run_test",
            project_id="project_test",
            research_question="Test question",
        )
        state.mark_stage_running("planner")
        assert state.current_stage == "planner"
        assert state.stages["planner"].status == StageStatus.RUNNING
        assert state.stages["planner"].started_at is not None

    def test_mark_stage_completed(self) -> None:
        """mark_stage_completed should advance progress."""
        state = DiscoveryState(
            run_id="run_test",
            project_id="project_test",
            research_question="Test question",
        )
        state.mark_stage_running("planner")
        state.mark_stage_completed("planner")
        assert state.stages["planner"].status == StageStatus.COMPLETED
        assert state.progress > 0.0

    def test_mark_stage_failed(self) -> None:
        """mark_stage_failed should halt the pipeline."""
        state = DiscoveryState(
            run_id="run_test",
            project_id="project_test",
            research_question="Test question",
        )
        state.mark_stage_running("planner")
        state.mark_stage_failed("planner", "Something went wrong")
        assert state.stages["planner"].status == StageStatus.FAILED
        assert state.stages["planner"].error == "Something went wrong"
        assert state.status == "failed"

    def test_completed_stages(self) -> None:
        """completed_stages should return only completed stage names."""
        state = DiscoveryState(
            run_id="run_test",
            project_id="project_test",
            research_question="Test question",
        )
        state.mark_stage_running("planner")
        state.mark_stage_completed("planner")
        state.mark_stage_running("retriever")
        assert state.completed_stages() == ["planner"]

    def test_next_pending_stage(self) -> None:
        """next_pending_stage should return the first uncompleted stage."""
        state = DiscoveryState(
            run_id="run_test",
            project_id="project_test",
            research_question="Test question",
        )
        assert state.next_pending_stage() == "planner"
        state.mark_stage_running("planner")
        state.mark_stage_completed("planner")
        assert state.next_pending_stage() == "retriever"

    def test_stage_progress_weight(self) -> None:
        """Each stage should contribute equal progress weight."""
        state = DiscoveryState(
            run_id="run_test",
            project_id="project_test",
            research_question="Test question",
        )
        weight = state.stage_progress_weight()
        assert weight == 100.0 / len(STAGE_ORDER)
        assert weight > 0


# ---------------------------------------------------------------------------
# Event tests
# ---------------------------------------------------------------------------


class TestDiscoveryEvents:
    """Verify event creation and validation."""

    def test_make_event_valid(self) -> None:
        """A valid event type should produce a DiscoveryEvent."""
        event = make_event("stage.started", stage="planner", message="Test")
        assert event.event_type == "stage.started"
        assert event.stage == "planner"
        assert event.message == "Test"

    def test_make_event_invalid_type(self) -> None:
        """An invalid event type should raise ValueError."""
        with pytest.raises(ValueError, match="Unknown event type"):
            make_event("invalid.type")

    def test_event_serialization(self) -> None:
        """Events should serialize to dict for storage."""
        event = make_event("pipeline.started", message="Pipeline started")
        data = event.model_dump(mode="json")
        assert data["event_type"] == "pipeline.started"
        assert data["message"] == "Pipeline started"


# ---------------------------------------------------------------------------
# Orchestrator integration tests
# ---------------------------------------------------------------------------


class TestDiscoveryOrchestrator:
    """Verify the full pipeline execution with mock agents."""

    @pytest.mark.asyncio
    async def test_full_pipeline_completes(self, mock_orchestrator: DiscoveryOrchestrator) -> None:
        """The full 8-stage pipeline should complete successfully."""
        state = await mock_orchestrator.run(
            project_id="project_test",
            research_question="What is the effect of microplastics on inflammation?",
            domain="Biomedical",
        )
        assert state.status == "completed"
        assert state.progress == 100.0
        assert len(state.completed_stages()) == len(STAGE_ORDER)
        assert state.plan is not None
        assert len(state.papers) > 0
        assert len(state.evidence) > 0
        assert state.knowledge_graph is not None
        assert len(state.contradictions) > 0
        assert state.novelty_analysis is not None
        assert len(state.suggested_experiments) > 0
        assert state.report is not None

    @pytest.mark.asyncio
    async def test_pipeline_events_emitted(self, mock_orchestrator: DiscoveryOrchestrator) -> None:
        """The pipeline should emit events for each stage."""
        state = await mock_orchestrator.run(
            project_id="project_test",
            research_question="Test question",
        )
        event_types = [e["event_type"] for e in state.events]
        assert "pipeline.started" in event_types
        assert "pipeline.completed" in event_types
        assert "stage.started" in event_types
        assert "stage.completed" in event_types

    @pytest.mark.asyncio
    async def test_pipeline_progress_increments(
        self,
        mock_orchestrator: DiscoveryOrchestrator,
    ) -> None:
        """Progress should increase after each completed stage."""
        state = await mock_orchestrator.run(
            project_id="project_test",
            research_question="Test question",
        )
        expected_progress = len(STAGE_ORDER) * state.stage_progress_weight()
        assert state.progress == expected_progress

    @pytest.mark.asyncio
    async def test_resume_completed_pipeline(
        self,
        mock_orchestrator: DiscoveryOrchestrator,
    ) -> None:
        """Resuming a completed pipeline should not re-run stages."""
        state = await mock_orchestrator.run(
            project_id="project_test",
            research_question="Test question",
        )
        resumed = await mock_orchestrator.resume(state)
        assert resumed.status == "completed"
        # No additional stage.started events beyond the original run
        stage_starts = [
            e for e in resumed.events if e["event_type"] == "stage.started"
        ]
        assert len(stage_starts) == len(STAGE_ORDER)

    @pytest.mark.asyncio
    async def test_state_persistence(self, mock_orchestrator: DiscoveryOrchestrator) -> None:
        """State should be persisted and retrievable."""
        state = await mock_orchestrator.run(
            project_id="project_test",
            research_question="Test question",
        )
        loaded = await mock_orchestrator.get_state(state.run_id)
        assert loaded is not None
        assert loaded.run_id == state.run_id
        assert loaded.status == "completed"

    @pytest.mark.asyncio
    async def test_pipeline_without_domain(self, mock_orchestrator: DiscoveryOrchestrator) -> None:
        """Pipeline should infer domain from the planner if not provided."""
        state = await mock_orchestrator.run(
            project_id="project_test",
            research_question="Test question",
        )
        assert state.status == "completed"
        # Domain should be set by the mock planner
        assert state.domain is not None


# ---------------------------------------------------------------------------
# Service tests
# ---------------------------------------------------------------------------


class TestOrchestratorService:
    """Verify the high-level OrchestratorService."""

    @pytest.mark.asyncio
    async def test_start_pipeline(self, orchestrator_service: OrchestratorService) -> None:
        """Starting a pipeline should return a completed state."""
        state = await orchestrator_service.start_pipeline(
            project_id="project_test",
            research_question="Test question",
        )
        assert state.status == "completed"
        assert state.run_id == "run_project_test"

    @pytest.mark.asyncio
    async def test_get_pipeline_state(self, orchestrator_service: OrchestratorService) -> None:
        """Getting pipeline state should return the persisted state."""
        state = await orchestrator_service.start_pipeline(
            project_id="project_test",
            research_question="Test question",
        )
        loaded = await orchestrator_service.get_pipeline_state(state.run_id)
        assert loaded is not None
        assert loaded.run_id == state.run_id

    @pytest.mark.asyncio
    async def test_get_nonexistent_state(
        self,
        orchestrator_service: OrchestratorService,
    ) -> None:
        """Getting state for a nonexistent run should return None."""
        loaded = await orchestrator_service.get_pipeline_state("nonexistent")
        assert loaded is None

    @pytest.mark.asyncio
    async def test_resume_pipeline(self, orchestrator_service: OrchestratorService) -> None:
        """Resuming a pipeline should work."""
        state = await orchestrator_service.start_pipeline(
            project_id="project_test",
            research_question="Test question",
        )
        resumed = await orchestrator_service.resume_pipeline(state.run_id)
        assert resumed is not None
        assert resumed.status == "completed"

    @pytest.mark.asyncio
    async def test_resume_nonexistent(self, orchestrator_service: OrchestratorService) -> None:
        """Resuming a nonexistent pipeline should return None."""
        resumed = await orchestrator_service.resume_pipeline("nonexistent")
        assert resumed is None