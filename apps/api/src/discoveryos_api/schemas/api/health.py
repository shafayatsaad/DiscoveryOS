"""Purpose: Define structured response models for health endpoints."""

from typing import Literal

from pydantic import BaseModel, Field

from discoveryos_api.schemas.api.responses import ResponseMeta


class HealthData(BaseModel):
    """Purpose: Describe service health without exposing internal implementation details."""

    status: Literal["ok"] = Field(description="Operational status for the API process.")
    service: str = Field(description="Human-readable service name.")
    environment: str = Field(description="Current runtime environment.")
    version: str = Field(description="Public API version.")


class HealthResponse(BaseModel):
    """Purpose: Provide the standard success envelope for health responses."""

    success: bool = Field(default=True, description="Always true for successful responses.")
    data: HealthData
    meta: ResponseMeta


class ReadinessCheck(BaseModel):
    """Purpose: Describe one dependency check used by readiness probes."""

    status: str
    detail: str | None = None


class ReadinessData(BaseModel):
    """Purpose: Describe whether the API and its runtime dependencies are ready."""

    status: str
    service: str
    environment: str
    version: str
    checks: dict[str, ReadinessCheck]


class ReadinessResponse(BaseModel):
    """Purpose: Provide the standard envelope for readiness responses."""

    success: bool
    data: ReadinessData
    meta: ResponseMeta
