"""Purpose: Compose versioned API route modules into one FastAPI router."""

from fastapi import APIRouter

from app.api.routes import agents, health, mcp_status, pipeline, projects
from app.graph import router as graph_router
from app.workspace import router as workspace_router

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(pipeline.router, prefix="/pipeline", tags=["pipeline"])
api_router.include_router(projects.router, tags=["projects"])
api_router.include_router(mcp_status.router, tags=["mcp"])
api_router.include_router(workspace_router.router, tags=["workspace"])
api_router.include_router(graph_router.router, tags=["graph"])
