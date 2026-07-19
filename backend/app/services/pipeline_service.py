"""Purpose: Coordinate the first Discovery Pipeline across typed agents."""

from datetime import UTC, datetime

from app.agents.contradiction.detector import ContradictionAgent
from app.agents.contradiction.schemas import ContradictionDetectionRequest
from app.agents.experiment.planner import ExperimentAgent
from app.agents.experiment.schemas import ExperimentPlanningRequest
from app.agents.extractor.extractor import ExtractorAgent
from app.agents.extractor.schemas import EvidenceExtractionRequest
from app.agents.novelty.analyzer import NoveltyAgent
from app.agents.novelty.schemas import NoveltyAnalysisRequest
from app.agents.planner.planner import PlannerAgent
from app.agents.report.report import ReportAgent
from app.agents.report.schemas import ScientificReportRequest
from app.agents.retriever.retriever import RetrieverAgent
from app.graph.builder import KnowledgeGraphBuilder
from app.schemas.agent import AgentContext
from app.schemas.pipeline import PipelineStartRequest, PipelineStartResponse
from app.utils.ids import prefixed_id
from app.workspace.schemas import Workspace, WorkspaceArtifactAppend, WorkspacePatch
from app.workspace.service import WorkspaceService


class DiscoveryPipelineService:
    """Run the MVP synchronous research pipeline with streaming-ready events."""

    def __init__(
        self,
        planner: PlannerAgent | None = None,
        retriever: RetrieverAgent | None = None,
        extractor: ExtractorAgent | None = None,
        contradiction: ContradictionAgent | None = None,
        novelty: NoveltyAgent | None = None,
        experiment: ExperimentAgent | None = None,
        report: ReportAgent | None = None,
        workspace_service: WorkspaceService | None = None,
        max_papers_for_extraction: int = 5,
    ) -> None:
        self._planner = planner or PlannerAgent()
        self._retriever = retriever or RetrieverAgent()
        self._extractor = extractor or ExtractorAgent()
        self._contradiction = contradiction or ContradictionAgent()
        self._novelty = novelty or NoveltyAgent()
        self._experiment = experiment or ExperimentAgent()
        self._report = report or ReportAgent()
        self._workspace_service = workspace_service
        self._max_papers_for_extraction = max_papers_for_extraction

    async def start(self, request: PipelineStartRequest) -> PipelineStartResponse:
        """Execute the demo-ready Discovery Pipeline in order."""

        run_id = prefixed_id("run")
        project_id = request.project_id or prefixed_id("project")
        events = ["pipeline.started", "planner.started"]
        plan = await self._planner.run(
            AgentContext(
                project_id=project_id,
                run_id=run_id,
                research_goal=request.query,
                domain=request.domain,
            )
        )

        events.extend(["planner.completed", "retriever.started"])
        paper_collection = await self._retriever.run(plan)

        events.extend(["retriever.completed", "extractor.started"])
        extraction = await self._extractor.run(
            EvidenceExtractionRequest(
                research_goal=plan.research_goal,
                domain=plan.research_domain,
                papers=paper_collection.papers[: self._max_papers_for_extraction],
            )
        )
        events.extend(["extractor.completed", "workspace.updating"])

        workspace = self._workspace(
            project_id=project_id,
            research_goal=request.query,
            plan=plan.model_dump(mode="json"),
            papers=[paper.model_dump(mode="json") for paper in paper_collection.papers],
            evidence=[record.model_dump(mode="json") for record in extraction.evidence],
        )

        events.extend(["workspace.updated", "graph.started"])
        graph = KnowledgeGraphBuilder().build(workspace=workspace)
        workspace = self._replace_workspace_artifact(
            workspace=workspace,
            field_name="knowledge_graph",
            value=graph.model_dump(mode="json"),
            message="Knowledge graph built from extracted evidence.",
        )

        events.extend(["graph.completed", "contradiction.started"])
        contradictions = await self._contradiction.run(
            ContradictionDetectionRequest(workspace=workspace, knowledge_graph=graph)
        )
        workspace = self._replace_workspace_artifact(
            workspace=workspace,
            field_name="contradictions",
            value=[item.model_dump(mode="json") for item in contradictions.contradictions],
            message="Contradiction analysis stored on workspace.",
        )

        events.extend(["contradiction.completed", "novelty.started"])
        novelty = await self._novelty.run(
            NoveltyAnalysisRequest(
                workspace=workspace,
                knowledge_graph=graph,
                contradictions=contradictions,
            )
        )
        workspace = self._replace_workspace_artifact(
            workspace=workspace,
            field_name="novelty_analysis",
            value=novelty.model_dump(mode="json"),
            message="Novelty analysis stored on workspace.",
        )

        events.extend(["novelty.completed", "experiment.started"])
        experiment = await self._experiment.run(
            ExperimentPlanningRequest(
                workspace=workspace,
                knowledge_graph=graph,
                novelty_analysis=novelty,
            )
        )
        workspace = self._replace_workspace_artifact(
            workspace=workspace,
            field_name="suggested_experiments",
            value=[item.model_dump(mode="json") for item in experiment.suggested_experiments],
            message="Experiment plan stored on workspace.",
        )

        events.extend(["experiment.completed", "report.started"])
        report = await self._report.run(
            ScientificReportRequest(
                workspace=workspace,
                knowledge_graph=graph,
                contradictions=contradictions,
                novelty_analysis=novelty,
                experiment_plan=experiment,
            )
        )
        workspace = self._append_report(workspace=workspace, report=report)
        events.extend(["report.completed", "pipeline.completed"])

        return PipelineStartResponse(
            run_id=run_id,
            project_id=project_id,
            workspace_id=workspace.id,
            status="completed",
            plan=plan,
            papers=paper_collection.papers,
            evidence=extraction.evidence,
            knowledge_graph=graph,
            contradictions=contradictions.contradictions,
            novelty_analysis=novelty,
            suggested_experiments=experiment.suggested_experiments,
            report=report,
            workspace=workspace,
            events=events,
            stream_ready=False,
        )

    def _workspace(
        self,
        project_id: str,
        research_goal: str,
        plan: dict,
        papers: list[dict],
        evidence: list[dict],
    ) -> Workspace:
        """Create or update workspace memory for the pipeline run."""

        if self._workspace_service is not None:
            return self._workspace_service.update_workspace(
                project_id,
                WorkspacePatch(
                    research_goal=research_goal,
                    research_plan=plan,
                    retrieved_papers=papers,
                    extracted_evidence=evidence,
                ),
            )

        now = datetime.now(UTC)
        return Workspace(
            id=prefixed_id("workspace"),
            project_id=project_id,
            research_goal=research_goal,
            research_plan=plan,
            retrieved_papers=papers,
            extracted_evidence=evidence,
            created_at=now,
            updated_at=now,
        )

    def _replace_workspace_artifact(
        self,
        workspace: Workspace,
        field_name: str,
        value: dict | list[dict],
        message: str,
    ) -> Workspace:
        """Replace a workspace artifact through persistence when available."""

        if self._workspace_service is not None:
            return self._workspace_service.replace_artifact(
                project_id=workspace.project_id,
                field_name=field_name,
                value=value,
                message=message,
            )
        return workspace.model_copy(update={field_name: value})

    def _append_report(self, workspace: Workspace, report) -> Workspace:
        """Append the generated report to workspace memory."""

        report_payload = report.model_dump(mode="json")
        if self._workspace_service is not None:
            return self._workspace_service.append_artifact(
                project_id=workspace.project_id,
                request=WorkspaceArtifactAppend(
                    artifact_kind="generated_reports",
                    artifact=report_payload,
                    event_message="Scientific report generated.",
                ),
            )
        reports = [*workspace.generated_reports, report_payload]
        return workspace.model_copy(update={"generated_reports": reports})
