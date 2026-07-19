"""Purpose: Define structured response models for health endpoints."""

from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.api.responses import ResponseMeta


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
