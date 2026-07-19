"""Purpose: Register exception handlers that return consistent structured errors."""

import logging
from http import HTTPStatus

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.errors.exceptions import ApplicationError
from app.schemas.api.errors import ErrorDetail, ErrorResponse
from app.schemas.api.responses import ResponseMeta

logger = logging.getLogger(__name__)


def _request_id(request: Request) -> str:
    """Purpose: Read the correlation ID attached by request middleware."""
    return getattr(request.state, "request_id", "unknown")


def _error_response(
    *,
    request: Request,
    status_code: int,
    code: str,
    message: str,
    details: dict | list | None = None,
) -> JSONResponse:
    """Purpose: Serialize an API error into the shared response envelope."""
    payload = ErrorResponse(
        success=False,
        error=ErrorDetail(code=code, message=message, details=details),
        meta=ResponseMeta(
            request_id=_request_id(request),
            api_version=request.app.state.settings.api_version,
        ),
    )
    return JSONResponse(status_code=status_code, content=payload.model_dump(mode="json"))


async def application_error_handler(request: Request, exc: ApplicationError) -> JSONResponse:
    """Purpose: Convert expected application exceptions into stable API errors."""
    return _error_response(
        request=request,
        status_code=exc.status_code,
        code=exc.code,
        message=exc.message,
        details=exc.details,
    )


async def http_error_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """Purpose: Normalize FastAPI and Starlette HTTP exceptions."""
    return _error_response(
        request=request,
        status_code=exc.status_code,
        code="HTTP_ERROR",
        message=str(exc.detail),
    )


async def validation_error_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Purpose: Return validation errors in the shared API error envelope."""
    return _error_response(
        request=request,
        status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
        code="VALIDATION_ERROR",
        message="Request validation failed.",
        details=exc.errors(),
    )


async def unhandled_error_handler(request: Request, exc: Exception) -> JSONResponse:
    """Purpose: Hide unexpected internals while preserving observability through logs."""
    logger.exception("Unhandled request error.", exc_info=exc)
    return _error_response(
        request=request,
        status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        code="INTERNAL_SERVER_ERROR",
        message="An unexpected server error occurred.",
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Purpose: Attach all structured exception handlers to a FastAPI app instance."""
    app.add_exception_handler(ApplicationError, application_error_handler)
    app.add_exception_handler(StarletteHTTPException, http_error_handler)
    app.add_exception_handler(RequestValidationError, validation_error_handler)
    app.add_exception_handler(Exception, unhandled_error_handler)
