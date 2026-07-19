"""Purpose: Create and configure the FastAPI application without business logic."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.errors.handlers import register_exception_handlers
from app.api.middleware.request_id import RequestIdMiddleware
from app.api.middleware.timing import ProcessTimeMiddleware
from app.api.router import api_router
from app.core.config import Settings, get_settings
from app.core.logging import configure_logging
from app.lifecycle import build_lifespan


def create_app(settings: Settings | None = None) -> FastAPI:
    """Purpose: Build an application instance for production, tests, and local development."""
    resolved_settings = settings or get_settings()
    configure_logging(resolved_settings.log_level)

    app = FastAPI(
        title=resolved_settings.app_name,
        version=resolved_settings.api_version,
        debug=resolved_settings.debug,
        docs_url=resolved_settings.docs_url,
        redoc_url=resolved_settings.redoc_url,
        openapi_url=resolved_settings.openapi_url,
        lifespan=build_lifespan(resolved_settings),
    )
    app.state.settings = resolved_settings

    app.add_middleware(ProcessTimeMiddleware)
    app.add_middleware(RequestIdMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=resolved_settings.cors_origins,
        allow_credentials=resolved_settings.cors_allow_credentials,
        allow_methods=resolved_settings.cors_allow_methods,
        allow_headers=resolved_settings.cors_allow_headers,
    )

    register_exception_handlers(app)
    app.include_router(api_router, prefix=resolved_settings.api_v1_prefix)

    return app


# Purpose: Expose the ASGI application object expected by Uvicorn and other ASGI servers.
app = create_app()
