"""Purpose: Compose all versioned FastAPI routers for the backend API."""

from fastapi import APIRouter

from discoveryos_api.api.routes.health import router as health_router
from discoveryos_api.api.routes.projects import router as projects_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["health"])
api_router.include_router(projects_router)
