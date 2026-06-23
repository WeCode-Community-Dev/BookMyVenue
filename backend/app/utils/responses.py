from typing import Any, Optional

from fastapi.responses import JSONResponse


def success_response(
    message: str,
    data: Any = None,
    status_code: int = 200,
) -> JSONResponse:
    body = {"message": message, "data": data}
    return JSONResponse(status_code=status_code, content=body)


def error_response(
    code: str,
    message: str,
    status_code: int,
    details: Optional[list] = None,
) -> JSONResponse:
    error_body: dict = {
        "code": code,
        "message": message,
    }
    if details is not None:
        error_body["details"] = details

    return JSONResponse(
        status_code=status_code,
        content={"error": error_body},
    )
