"""Purpose: Expose application exceptions and handler registration helpers."""

from app.api.errors.exceptions import ApplicationError
from app.api.errors.handlers import register_exception_handlers

__all__ = ["ApplicationError", "register_exception_handlers"]
