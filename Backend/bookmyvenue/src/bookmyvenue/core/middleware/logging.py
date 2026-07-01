import uuid
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import structlog

class LoggingContextMiddleware(BaseHTTPMiddleware):
    """
    Global middleware to attach unique request tracking IDs 
    to all log messages asynchronously.
    """
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        
        
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(
            request_id=request_id,
            path=request.url.path,
            method=request.method,
        )
        
        response = await call_next(request)
        return response