"""Purpose: Expose the first Discovery Pipeline HTTP endpoint."""

from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.api.dependencies import pipeline_service_dependency
from app.schemas.pipeline import PipelineStartRequest, PipelineStartResponse
from app.services.pipeline_service import DiscoveryPipelineService

router = APIRouter()


@router.post("/start", response_model=PipelineStartResponse, status_code=status.HTTP_200_OK)
async def start_pipeline(
    request: PipelineStartRequest,
    service: Annotated[DiscoveryPipelineService, Depends(pipeline_service_dependency)],
) -> PipelineStartResponse:
    """Start the synchronous MVP pipeline while preserving future streaming metadata."""

    return await service.start(request)
