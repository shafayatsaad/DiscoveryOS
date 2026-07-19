"""Purpose: Manage environment-driven configuration for the FastAPI backend."""

from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Purpose: Centralize backend settings loaded from environment variables and .env."""

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

    database_url: str = "sqlite+aiosqlite:///../../storage/sqlite/runtime/discoveryos.db"
    sqlalchemy_echo: bool = False

    @property
    def sqlite_database_path(self) -> Path | None:
        """Purpose: Return the local SQLite file path when the configured URL is file-based."""
        prefix = "sqlite+aiosqlite:///"
        if (
            not self.database_url.startswith(prefix)
            or self.database_url == "sqlite+aiosqlite:///:memory:"
        ):
            return None
        raw_path = self.database_url.removeprefix(prefix)
        return Path(raw_path)


@lru_cache
def get_settings() -> Settings:
    """Purpose: Cache settings so app startup and dependencies share one configuration."""
    return Settings()
