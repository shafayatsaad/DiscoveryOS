"""Purpose: Coordinate the first Discovery Pipeline across typed agents."""

from app.agents.extractor.extractor import ExtractorAgent
from app.agents.extractor.schemas import EvidenceExtractionRequest
from app.agents.planner.planner import PlannerAgent
from app.agents.retriever.retriever import RetrieverAgent
from app.schemas.agent import AgentContext
from app.schemas.pipeline import PipelineStartRequest, PipelineStartResponse
from app.utils.ids import prefixed_id


class DiscoveryPipelineService:
    """Run the MVP synchronous research pipeline with streaming-ready events."""

    def __init__(
        self,
        planner: PlannerAgent | None = None,
        retriever: RetrieverAgent | None = None,
        extractor: ExtractorAgent | None = None,
        max_papers_for_extraction: int = 5,
    ) -> None:
        self._planner = planner or PlannerAgent()
        self._retriever = retriever or RetrieverAgent()
        self._extractor = extractor or ExtractorAgent()
        self._max_papers_for_extraction = max_papers_for_extraction

    async def start(self, request: PipelineStartRequest) -> PipelineStartResponse:
        """Execute planner, retriever, and extractor stages in order."""

        run_id = prefixed_id("run")
        events = ["pipeline.started", "planner.started"]
        plan = await self._planner.run(
            AgentContext(
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
        events.extend(["extractor.completed", "pipeline.completed"])

        return PipelineStartResponse(
            run_id=run_id,
            status="completed",
            plan=plan,
            papers=paper_collection.papers,
            evidence=extraction.evidence,
            events=events,
            stream_ready=False,
        )
