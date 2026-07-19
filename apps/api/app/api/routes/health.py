"""Purpose: Provide infrastructure health endpoints for service monitoring."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import RequestContext, get_request_context
from app.schemas.api.health import HealthData, HealthResponse
from app.schemas.api.responses import ResponseMeta

router = APIRouter()

# Purpose: Keep route dependency injection explicit while avoiding call expressions in defaults.
RequestContextDependency = Annotated[RequestContext, Depends(get_request_context)]


@router.get("/health", response_model=HealthResponse, summary="Check API health")
async def health_check(context: RequestContextDependency) -> HealthResponse:
    """Purpose: Confirm the API process is running without invoking business logic."""
    settings = context.settings
    return HealthResponse(
        success=True,
        data=HealthData(
            status="ok",
            service=settings.app_name,
            environment=settings.environment,
            version=settings.api_version,
        ),
        meta=ResponseMeta(
            request_id=context.request_id,
            api_version=settings.api_version,
        ),
    )
