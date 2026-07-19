"""Purpose: Define Pydantic schemas for Project API input and output."""

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

ProjectStatus = Literal["active", "archived", "deleted"]


class ProjectCreate(BaseModel):
    """Purpose: Validate client input for creating a new research project."""

    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    status: ProjectStatus = "active"
    research_goal: str = Field(min_length=1)
    domain: str | None = Field(default=None, max_length=120)
    owner_name: str | None = Field(default=None, max_length=160)
    metadata: dict[str, Any] = Field(default_factory=dict)


class ProjectRead(BaseModel):
    """Purpose: Serialize a persisted project for API clients."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: str | None
    status: ProjectStatus
    research_goal: str
    domain: str | None
    created_at: datetime
    updated_at: datetime
    owner_name: str | None
    metadata: dict[str, Any]


class ProjectResponse(BaseModel):
    """Purpose: Wrap a single project in a stable API response envelope."""

    success: bool = True
    data: ProjectRead


class ProjectsResponse(BaseModel):
    """Purpose: Wrap a list of projects in a stable API response envelope."""

    success: bool = True
    data: list[ProjectRead]
