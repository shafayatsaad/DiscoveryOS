"""Purpose: Manage environment-driven configuration for the FastAPI backend."""

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Purpose: Centralize backend settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="DISCOVERYOS_",
        env_nested_delimiter="__",
        extra="ignore",
    )

    app_name: str = "DiscoveryOS API"
    environment: Literal["development", "test", "staging", "production"] = "development"
    debug: bool = False

    api_version: str = "v1"
    api_v1_prefix: str = "/api/v1"

    log_level: str = "INFO"

    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])
    cors_allow_credentials: bool = True
    cors_allow_methods: list[str] = Field(default_factory=lambda: ["*"])
    cors_allow_headers: list[str] = Field(default_factory=lambda: ["*"])

    docs_url: str | None = "/docs"
    redoc_url: str | None = "/redoc"
    openapi_url: str | None = "/openapi.json"


@lru_cache
def get_settings() -> Settings:
    """Purpose: Cache settings so dependencies and app startup share one configuration."""
    return Settings()
