"""Purpose: Expose lightweight health checks for local development and deployment probes."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import settings_dependency
from app.config import Settings
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health(
    settings: Annotated[Settings, Depends(settings_dependency)],
) -> HealthResponse:
    """Return process health without touching external AI or research systems."""

    return HealthResponse(
        status="ok",
        service=settings.app_name,
        environment=settings.environment,
    )
