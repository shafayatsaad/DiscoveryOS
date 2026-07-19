"""Purpose: Define shared response metadata used across API response envelopes."""

from pydantic import BaseModel, Field


class ResponseMeta(BaseModel):
    """Purpose: Carry response metadata needed for tracing and API versioning."""

    request_id: str = Field(description="Correlation ID for this request.")
    api_version: str = Field(description="Version of the API that produced the response.")
