"""Purpose: Measure request duration and expose it through a response header."""

from collections.abc import Awaitable, Callable
from time import perf_counter

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class ProcessTimeMiddleware(BaseHTTPMiddleware):
    """Purpose: Add lightweight request timing for local diagnostics and observability."""

    async def dispatch(
        self,
        request: Request,
        call_next: Callable[[Request], Awaitable[Response]],
    ) -> Response:
        """Purpose: Measure the full downstream request handling time."""
        started_at = perf_counter()
        response = await call_next(request)
        elapsed_ms = (perf_counter() - started_at) * 1000
        response.headers["x-process-time-ms"] = f"{elapsed_ms:.3f}"
        return response
