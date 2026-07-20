"""Purpose: Centralize environment-driven settings for the DiscoveryOS backend."""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration loaded from environment variables and optional .env files."""

    app_name: str = Field(default="DiscoveryOS Backend", alias="DISCOVERYOS_APP_NAME")
    environment: str = Field(default="development", alias="DISCOVERYOS_ENVIRONMENT")
    log_level: str = Field(default="INFO", alias="DISCOVERYOS_LOG_LEVEL")
    api_prefix: str = Field(default="/api/v1", alias="DISCOVERYOS_API_PREFIX")
    database_url: str = Field(
        default="sqlite:///./storage/discoveryos.sqlite3",
        alias="DISCOVERYOS_DATABASE_URL",
    )
    cors_origins: str = Field(
        default="http://localhost:3000,http://127.0.0.1:3000",
        alias="DISCOVERYOS_CORS_ORIGINS",
    )
    redis_url: str | None = Field(default=None, alias="DISCOVERYOS_REDIS_URL")
    openai_api_key: str | None = Field(default=None, alias="DISCOVERYOS_OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-5.6", alias="DISCOVERYOS_OPENAI_MODEL")
    pipeline_max_papers: int = Field(default=5, alias="DISCOVERYOS_PIPELINE_MAX_PAPERS")

    # MCP (Model Context Protocol) settings
    mcp_enabled: bool = Field(default=True, alias="DISCOVERYOS_MCP_ENABLED")
    mcp_filesystem_root: str = Field(
        default="./storage/artifacts",
        alias="DISCOVERYOS_MCP_FILESYSTEM_ROOT",
    )
    github_token: str | None = Field(default=None, alias="DISCOVERYOS_GITHUB_TOKEN")
    github_repo: str | None = Field(default=None, alias="DISCOVERYOS_GITHUB_REPO")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origin_list(self) -> list[str]:
        """Return CORS origins as a list while keeping the env var simple for local setup."""

        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return cached settings so dependency injection and startup use the same object."""

    return Settings()
