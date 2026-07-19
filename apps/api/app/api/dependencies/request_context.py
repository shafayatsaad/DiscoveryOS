"""Purpose: Provide request-scoped dependency objects for modular route handlers."""

from dataclasses import dataclass

from fastapi import Request

from app.core.config import Settings


@dataclass(frozen=True)
class RequestContext:
    """Purpose: Carry request metadata without coupling routes to middleware internals."""

    request_id: str
    settings: Settings


async def get_request_context(request: Request) -> RequestContext:
    """Purpose: Build a typed dependency from FastAPI request state."""
    return RequestContext(
        request_id=getattr(request.state, "request_id", "unknown"),
        settings=request.app.state.settings,
    )
