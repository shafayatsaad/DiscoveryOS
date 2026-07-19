"""Purpose: Expose application exceptions and handler registration helpers."""

from discoveryos_api.api.errors.exceptions import ApplicationError
from discoveryos_api.api.errors.handlers import register_exception_handlers

__all__ = ["ApplicationError", "register_exception_handlers"]
