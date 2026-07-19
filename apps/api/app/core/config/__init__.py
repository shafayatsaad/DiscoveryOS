"""Purpose: Expose typed configuration settings to the backend application."""

from app.core.config.settings import Settings, get_settings

__all__ = ["Settings", "get_settings"]
