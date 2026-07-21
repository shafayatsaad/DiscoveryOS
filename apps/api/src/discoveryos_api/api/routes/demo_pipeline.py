"""Purpose: Provide demo-safe pipeline endpoints used by the frontend Docker stack."""

from __future__ import annotations

import asyncio
import json
from datetime import UTC, datetime
from typing import Annotated, Any

from fastapi import APIRouter, Body, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from discoveryos_api.api.dependencies import get_db_session
from discoveryos_api.repositories.projects import ProjectRepository
from discoveryos_api.repositories.research_jobs import ResearchJobRepository
from discoveryos_api.schemas.research_jobs import ResearchJobCreate
from discoveryos_api.services.projects import ProjectService

router = APIRouter(tags=["pipeline"])

DbSessionDependency = Annotated[AsyncSession, Depends(get_db_session)]
PipelineStartBody = Annotated[dict[str, Any], Body(default_factory=dict)]


DEMO_STAGES = [
    ("pipeline.started", None, 5.0, "Discovery pipeline started.", None),
    ("stage.completed", "planner", 18.0, "Created a grounded research plan.", "planner"),
    ("stage.completed", "retriever", 42.0, "Loaded demo papers from local seed data.", "retriever"),
    ("stage.completed", "graph", 68.0, "Built the demo evidence graph.", "orchestrator"),
    ("stage.completed", "report", 90.0, "Prepared the demo report artifact.", "orchestrator"),
    ("pipeline.completed", "report", 100.0, "Pipeline completed from offline demo data.", None),
]


@router.post("/projects/{project_id}/run", status_code=status.HTTP_202_ACCEPTED)
async def start_project_pipeline(
    project_id: str,
    body: PipelineStartBody,
    session: DbSessionDependency,
) -> dict[str, Any]:
    """Purpose: Start a deterministic demo run without invoking live research APIs."""
    query = str(body.get("query", "")).strip()
    if not query:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="query is required")

    project = await ProjectService(ProjectRepository(session)).get_project(project_id)
    job = await ResearchJobRepository(session).create(
        project_id=project.id,
        job_in=ResearchJobCreate(
            status="running",
            current_step="planner",
            progress=5.0,
            logs=[
                "Demo run started.",
                "Using local seed data; live literature APIs are disabled for demo stability.",
            ],
        ),
    )

    return {
        "run_id": job.id,
        "project_id": project.id,
        "status": job.status,
        "progress": job.progress,
        "current_stage": job.current_step,
    }


@router.get("/projects/{project_id}/stream")
async def stream_project_pipeline(project_id: str, request: Request) -> StreamingResponse:
    """Purpose: Stream deterministic server-sent events for the hackathon demo UI."""

    async def event_generator():
        for event_type, stage, progress, message, current_agent in DEMO_STAGES:
            if await request.is_disconnected():
                break

            payload = {
                "event_type": event_type,
                "stage": stage,
                "progress": progress,
                "message": message,
                "timestamp": datetime.now(UTC).isoformat(),
                "metadata": {
                    "papers_count": 4,
                    "evidence_count": 6,
                    "contradictions_count": 1,
                    "novelty_score": 0.82 if progress >= 90 else None,
                    "current_agent": current_agent,
                    "execution_time_ms": int(progress * 120),
                    "stages": _stage_statuses(stage),
                },
            }
            yield f"data: {json.dumps(payload)}\n\n"
            await asyncio.sleep(0.7)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


def _stage_statuses(current_stage: str | None) -> dict[str, dict[str, str]]:
    """Purpose: Provide frontend-friendly stage metadata without coupling to agent internals."""
    stage_order = ["planner", "retriever", "graph", "report"]
    labels = {
        "planner": "Research Planning",
        "retriever": "Demo Papers",
        "graph": "Demo Graph",
        "report": "Demo Report",
    }
    current_index = stage_order.index(current_stage) if current_stage in stage_order else -1
    return {
        stage: {
            "status": "completed" if index <= current_index else "pending",
            "label": labels[stage],
        }
        for index, stage in enumerate(stage_order)
    }
