"""Purpose: Create and configure the FastAPI application for DiscoveryOS."""

import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.config import get_settings
from app.lifecycle import lifespan

logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    """Build the FastAPI app using dependency-friendly factories."""

    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        description="Backend architecture scaffold for DiscoveryOS.",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix=settings.api_prefix)
    app.include_router(api_router)

    # ------------------------------------------------------------------
    # Global exception handler — prevents opaque 500s from reaching the client.
    # Logs the full error server-side, returns a friendly JSON response.
    # ------------------------------------------------------------------
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """Catch any unhandled exception and return a structured error response."""
        logger.error(
            "Unhandled exception on %s %s: %s",
            request.method,
            request.url.path,
            exc,
            exc_info=True,
        )
        return JSONResponse(
            status_code=500,
            content={
                "error": True,
                "detail": "An internal error occurred. Please try again later.",
                "path": request.url.path,
            },
        )

    return app


app = create_app()