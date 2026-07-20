"""Purpose: Expose project-level pipeline run and SSE streaming endpoints."""

import asyncio
import json
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse

from app.api.dependencies import orchestrator_service_dependency
from app.orchestrator.service import OrchestratorService
from app.orchestrator.state import STAGE_LABELS, STAGE_ORDER

router = APIRouter()


@router.post("/projects/{project_id}/run", status_code=status.HTTP_202_ACCEPTED)
async def start_project_pipeline(
    project_id: str,
    body: dict,
    service: Annotated[OrchestratorService, Depends(orchestrator_service_dependency)],
) -> dict:
    """Start a new discovery pipeline for a project.

    Accepts:
    ```json
    { "query": "research question", "domain": "optional domain" }
    ```
    """
    query = body.get("query", "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="query is required")

    domain = body.get("domain")
    state = await service.start_pipeline(
        project_id=project_id,
        research_question=query,
        domain=domain,
    )

    return {
        "run_id": state.run_id,
        "project_id": state.project_id,
        "status": state.status,
        "progress": state.progress,
        "current_stage": state.current_stage,
    }


@router.get("/projects/{project_id}/stream")
async def stream_project_pipeline(
    project_id: str,
    request: Request,
    service: Annotated[OrchestratorService, Depends(orchestrator_service_dependency)],
) -> StreamingResponse:
    """Subscribe to real-time pipeline updates via Server-Sent Events.

    Streams JSON events with the following shape:
    ```json
    {
      "event_type": "stage.completed",
      "stage": "planner",
      "progress": 12.5,
      "message": "Completed stage: Research Planning",
      "metadata": {
        "papers_count": 0,
        "evidence_count": 0,
        "contradictions_count": 0,
        "novelty_score": null,
        "current_agent": "planner",
        "execution_time_ms": 1234
      }
    }
    ```
    """

    async def event_generator():
        last_event_count = -1
        last_progress = -1.0
        last_status = None
        keepalive_interval = 15  # seconds
        max_wait_seconds = 300  # 5 minutes max streaming duration
        elapsed = 0.0

        while elapsed < max_wait_seconds:
            # Check if client disconnected
            if await request.is_disconnected():
                break

            # Try to find the latest run for this project
            run_id = f"run_{project_id}"
            state = await service.get_pipeline_state(run_id)

            if state is not None:
                current_event_count = len(state.events)
                current_progress = state.progress
                current_status = state.status

                # Send new events
                for i in range(last_event_count + 1, current_event_count):
                    if i < len(state.events):
                        event = state.events[i]
                        metadata = _build_metadata(state)
                        payload = {
                            "event_type": event.get("event_type", "unknown"),
                            "stage": event.get("stage"),
                            "progress": state.progress,
                            "message": event.get("message", ""),
                            "timestamp": event.get("timestamp"),
                            "metadata": metadata,
                        }
                        yield f"data: {json.dumps(payload)}\n\n"

                last_event_count = current_event_count - 1 if current_event_count > 0 else -1
                last_progress = current_progress
                last_status = current_status

                # If pipeline completed or failed, send final event and stop
                if state.status in ("completed", "failed"):
                    metadata = _build_metadata(state)
                    payload = {
                        "event_type": f"pipeline.{state.status}",
                        "stage": state.current_stage,
                        "progress": state.progress,
                        "message": f"Pipeline {state.status}",
                        "timestamp": None,
                        "metadata": metadata,
                    }
                    yield f"data: {json.dumps(payload)}\n\n"
                    break
            else:
                # No state yet — send a waiting event
                if last_status is None:
                    payload = {
                        "event_type": "pipeline.waiting",
                        "stage": None,
                        "progress": 0.0,
                        "message": "Waiting for pipeline to start...",
                        "timestamp": None,
                        "metadata": _empty_metadata(),
                    }
                    yield f"data: {json.dumps(payload)}\n\n"
                    last_status = "waiting"

                # If no state after 60s, stop waiting
                if elapsed >= 60:
                    payload = {
                        "event_type": "pipeline.timeout",
                        "stage": None,
                        "progress": 0.0,
                        "message": "Pipeline did not start within 60 seconds.",
                        "timestamp": None,
                        "metadata": _empty_metadata(),
                    }
                    yield f"data: {json.dumps(payload)}\n\n"
                    break

            # Keepalive ping
            yield f": keepalive\n\n"

            await asyncio.sleep(0.5)
            elapsed += 0.5

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


def _build_metadata(state) -> dict:
    """Build metadata dict from pipeline state."""
    return {
        "papers_count": len(state.papers) if state.papers else 0,
        "evidence_count": len(state.evidence) if state.evidence else 0,
        "contradictions_count": len(state.contradictions) if state.contradictions else 0,
        "novelty_score": (
            state.novelty_analysis.get("novelty_score")
            if state.novelty_analysis
            else None
        ),
        "current_agent": state.current_stage,
        "execution_time_ms": _calculate_execution_time(state),
        "stages": {
            name: {
                "status": stage.status.value,
                "label": STAGE_LABELS.get(name, name),
            }
            for name, stage in state.stages.items()
        },
    }


def _empty_metadata() -> dict:
    """Return empty metadata for waiting state."""
    return {
        "papers_count": 0,
        "evidence_count": 0,
        "contradictions_count": 0,
        "novelty_score": None,
        "current_agent": None,
        "execution_time_ms": 0,
        "stages": {},
    }


def _calculate_execution_time(state) -> int:
    """Calculate total execution time in milliseconds from stage timestamps."""
    total = 0
    for stage in state.stages.values():
        if stage.started_at and stage.completed_at:
            diff = stage.completed_at - stage.started_at
            total += int(diff.total_seconds() * 1000)
    return total