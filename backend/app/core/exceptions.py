"""Domain-specific exceptions and FastAPI exception handlers."""


class AppException(Exception):
    status_code: int = 400
    detail: str = "Application error"

    def __init__(self, detail: str | None = None, status_code: int | None = None):
        if detail is not None:
            self.detail = detail
        if status_code is not None:
            self.status_code = status_code
        super().__init__(self.detail)


class NotFoundError(AppException):
    status_code = 404
    detail = "Resource not found"


class ConflictError(AppException):
    status_code = 409
    detail = "Conflict"


class ForbiddenError(AppException):
    status_code = 403
    detail = "Forbidden"


class UnauthorizedError(AppException):
    status_code = 401
    detail = "Unauthorized"


class ValidationError(AppException):
    status_code = 422
    detail = "Validation error"


def register_exception_handlers(app):  # noqa: ANN001
    from fastapi.responses import JSONResponse

    @app.exception_handler(AppException)
    async def _handle_app_exception(request, exc: AppException):  # noqa: ANN001, ARG001
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
