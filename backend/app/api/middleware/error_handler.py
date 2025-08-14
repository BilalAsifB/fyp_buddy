"""
Error Handler Middleware
File: backend/app/api/middleware/error_handler.py
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from pymongo.errors import PyMongoError
from groq import GroqError
import traceback
from loguru import logger
from app.models.errors import ErrorResponse, ErrorType, ValidationErrorDetail
from app.core.config import settings
import uuid


def setup_error_handlers(app: FastAPI) -> None:
    """Setup global error handlers"""

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        """Handle Pydantic validation errors"""
        request_id = str(uuid.uuid4())[:8]

        logger.error(f"Validation error [{request_id}]: {exc}")

        # Convert Pydantic errors to our format
        validation_errors = []
        for error in exc.errors():
            field = " -> ".join([str(loc) for loc in error["loc"]])
            validation_errors.append(ValidationErrorDetail(
                field=field,
                message=error["msg"],
                value=error.get("input", "N/A")
            ))

        error_response = ErrorResponse(
            error_type=ErrorType.VALIDATION_ERROR,
            message="Invalid input data. Please check your request.",
            details=validation_errors,
            request_id=request_id
        )

        return JSONResponse(
            status_code=422,
            content=error_response.model_dump()
        )

    @app.exception_handler(PyMongoError)
    async def mongodb_exception_handler(request: Request, exc: PyMongoError):
        """Handle MongoDB errors"""
        request_id = str(uuid.uuid4())[:8]

        logger.error(f"MongoDB error [{request_id}]: {exc}")

        error_response = ErrorResponse(
            error_type=ErrorType.DATABASE_ERROR,
            message="Database connection issue. Please try again later.",
            request_id=request_id
        )

        return JSONResponse(
            status_code=503,
            content=error_response.model_dump()
        )

    @app.exception_handler(GroqError)
    async def groq_exception_handler(request: Request, exc: GroqError):
        """Handle Groq API errors"""
        request_id = str(uuid.uuid4())[:8]

        logger.error(f"Groq API error [{request_id}]: {exc}")

        error_response = ErrorResponse(
            error_type=ErrorType.EXTERNAL_API_ERROR,
            message="AI service temporarily unavailable. Please try again later.",
            request_id=request_id
        )

        return JSONResponse(
            status_code=503,
            content=error_response.model_dump()
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        """Handle HTTP exceptions"""
        request_id = str(uuid.uuid4())[:8]

        logger.error(f"HTTP error [{request_id}]: {exc}")

        error_response = ErrorResponse(
            error_type=ErrorType.INTERNAL_ERROR,
            message=exc.detail,
            request_id=request_id
        )

        return JSONResponse(
            status_code=exc.status_code,
            content=error_response.model_dump()
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """Handle all other exceptions"""
        request_id = str(uuid.uuid4())[:8]

        logger.error(f"Unexpected error [{request_id}]: {exc}")
        logger.error(f"Traceback: {traceback.format_exc()}")

        # Don't expose internal errors in production
        if settings.is_production:
            message = "An internal error occurred. Please try again later."
        else:
            message = f"Internal error: {str(exc)}"

        error_response = ErrorResponse(
            error_type=ErrorType.INTERNAL_ERROR,
            message=message,
            request_id=request_id
        )

        return JSONResponse(
            status_code=500,
            content=error_response.model_dump()
        )
