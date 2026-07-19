"""Purpose: Define Pydantic schemas for Research Job API input and output."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

ResearchJobStatus = Literal["pending", "running", "completed", "failed", "cancelled"]


class ResearchJobCreate(BaseModel):
    """Purpose: Validate optional initial state for a newly created research job."""

    status: ResearchJobStatus = "pending"
    started_at: datetime | None = None
    finished_at: datetime | None = None
    current_step: str | None = Field(default=None, max_length=120)
    progress: float = Field(default=0.0, ge=0.0, le=100.0)
    logs: list[str] = Field(default_factory=list)


class ResearchJobUpdate(BaseModel):
    """Purpose: Validate partial execution-state updates from future workers or clients."""

    status: ResearchJobStatus | None = None
    started_at: datetime | None = None
    finished_at: datetime | None = None
    current_step: str | None = Field(default=None, max_length=120)
    progress: float | None = Field(default=None, ge=0.0, le=100.0)
    logs: list[str] | None = None


class ResearchJobRead(BaseModel):
    """Purpose: Serialize a persisted research job for API clients."""

    id: str
    project_id: str
    status: ResearchJobStatus
    started_at: datetime
    finished_at: datetime | None
    current_step: str | None
    progress: float
    logs: list[str]


class ResearchJobResponse(BaseModel):
    """Purpose: Wrap a single research job in a stable API response envelope."""

    success: bool = True
    data: ResearchJobRead


class ResearchJobsResponse(BaseModel):
    """Purpose: Wrap a list of research jobs in a stable API response envelope."""

    success: bool = True
    data: list[ResearchJobRead]
