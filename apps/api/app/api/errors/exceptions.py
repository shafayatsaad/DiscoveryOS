"""Purpose: Define infrastructure exceptions that can be translated to API responses."""

from http import HTTPStatus
from typing import Any


class ApplicationError(Exception):
    """Purpose: Represent an expected application-level failure with a stable error code."""

    def __init__(
        self,
        message: str,
        *,
        code: str = "APPLICATION_ERROR",
        status_code: int = HTTPStatus.BAD_REQUEST,
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}
