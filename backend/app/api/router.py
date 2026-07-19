"""Purpose: Compose versioned API route modules into one FastAPI router."""

from fastapi import APIRouter

from app.api.routes import agents, health, pipeline

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(pipeline.router, prefix="/pipeline", tags=["pipeline"])
