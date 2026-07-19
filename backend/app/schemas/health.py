"""Purpose: Define response schemas for backend health endpoints."""

from pydantic import BaseModel, ConfigDict


class HealthResponse(BaseModel):
    """Serializable health payload for uptime checks."""

    status: str
    service: str
    environment: str

    model_config = ConfigDict(extra="forbid")
