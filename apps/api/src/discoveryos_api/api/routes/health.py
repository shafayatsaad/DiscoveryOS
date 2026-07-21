"""Purpose: Provide infrastructure health endpoints for service monitoring."""

from typing import Annotated

from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from sqlalchemy import text

from discoveryos_api.api.dependencies import get_db_session
from discoveryos_api.api.dependencies import RequestContext, get_request_context
from discoveryos_api.schemas.api.health import (
    HealthData,
    HealthResponse,
    ReadinessCheck,
    ReadinessData,
    ReadinessResponse,
)
from discoveryos_api.schemas.api.responses import ResponseMeta
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

# Purpose: Keep route dependency injection explicit while avoiding call expressions in defaults.
RequestContextDependency = Annotated[RequestContext, Depends(get_request_context)]
DbSessionDependency = Annotated[AsyncSession, Depends(get_db_session)]


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


@router.get("/ready", response_model=ReadinessResponse, summary="Check API readiness")
async def readiness_check(
    context: RequestContextDependency,
    session: DbSessionDependency,
) -> ReadinessResponse:
    """Purpose: Confirm the API can reach dependencies required by the Docker demo."""
    settings = context.settings
    checks: dict[str, ReadinessCheck] = {}

    try:
        await session.execute(text("SELECT 1"))
        checks["database"] = ReadinessCheck(status="ok")
    except Exception as error:
        checks["database"] = ReadinessCheck(status="error", detail=str(error))

    if settings.redis_url:
        redis = Redis.from_url(settings.redis_url, socket_connect_timeout=1.0)
        try:
            await redis.ping()
            checks["redis"] = ReadinessCheck(status="ok")
        except Exception as error:
            checks["redis"] = ReadinessCheck(status="error", detail=str(error))
        finally:
            await redis.aclose()
    else:
        checks["redis"] = ReadinessCheck(status="skipped", detail="DISCOVERYOS_REDIS_URL not set")

    ready = all(check.status in {"ok", "skipped"} for check in checks.values())
    return ReadinessResponse(
        success=ready,
        data=ReadinessData(
            status="ready" if ready else "not_ready",
            service=settings.app_name,
            environment=settings.environment,
            version=settings.api_version,
            checks=checks,
        ),
        meta=ResponseMeta(
            request_id=context.request_id,
            api_version=settings.api_version,
        ),
    )
