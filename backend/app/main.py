"""Purpose: Create and configure the FastAPI application for DiscoveryOS."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.config import get_settings
from app.lifecycle import lifespan


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

    return app


app = create_app()
