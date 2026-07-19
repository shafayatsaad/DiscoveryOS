"""Purpose: Verify the FastAPI application factory wires infrastructure correctly."""

from app.core.config import Settings
from app.main import create_app
from fastapi import FastAPI


def test_create_app_returns_fastapi_instance() -> None:
    """Purpose: Ensure tests and ASGI servers can construct the backend app."""
    app = create_app(Settings(environment="test", log_level="WARNING"))

    assert isinstance(app, FastAPI)
    assert app.state.settings.environment == "test"


def test_api_version_prefix_is_registered() -> None:
    """Purpose: Confirm versioned routes are registered under the configured prefix."""
    app = create_app(Settings(environment="test", log_level="WARNING"))
    paths = {route.path for route in app.routes}

    assert "/api/v1/health" in paths
