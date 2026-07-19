"""Purpose: Define structured error response models for all API failures."""

from typing import Any

from pydantic import BaseModel, Field

from app.schemas.api.responses import ResponseMeta


class ErrorDetail(BaseModel):
    """Purpose: Describe a single API error in a stable client-facing shape."""

    code: str = Field(description="Stable machine-readable error code.")
    message: str = Field(description="Human-readable error message.")
    details: dict[str, Any] | list[Any] | None = Field(
        default=None,
        description="Optional validation or diagnostic details safe for clients.",
    )


class ErrorResponse(BaseModel):
    """Purpose: Wrap API errors in the same envelope shape as successful responses."""

    success: bool = Field(default=False, description="Always false for error responses.")
    error: ErrorDetail
    meta: ResponseMeta
