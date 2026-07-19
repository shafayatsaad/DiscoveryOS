"""Purpose: Log one structured request line for each completed API request."""

import logging
from collections.abc import Awaitable, Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("discoveryos_api.request")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Purpose: Provide lightweight operational logs without business-level logging."""

    async def dispatch(
        self,
        request: Request,
        call_next: Callable[[Request], Awaitable[Response]],
    ) -> Response:
        """Purpose: Log method, path, status, and request ID after downstream handling."""
        response = await call_next(request)
        logger.info(
            "request method=%s path=%s status=%s request_id=%s",
            request.method,
            request.url.path,
            response.status_code,
            getattr(request.state, "request_id", "unknown"),
        )
        return response
