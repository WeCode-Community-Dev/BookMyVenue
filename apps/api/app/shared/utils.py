import uuid
from datetime import datetime

from fastapi import HTTPException


def generate_id() -> str:
    return str(uuid.uuid4())


# Helper to parse datetime query parameters that might have '+' decoded as space
def parse_timezone_datetime(val: str, field_name: str) -> datetime:
    processed_val = val
    if " " in val:
        parts = val.split(" ")
        if len(parts) == 2 and (":" in parts[1] or parts[1].isdigit()):
            processed_val = "+".join(parts)
    try:
        return datetime.fromisoformat(processed_val)
    except ValueError as e:
        raise HTTPException(
            status_code=422,
            detail=[
                {
                    "type": "datetime_from_date_parsing",
                    "loc": ["query", field_name],
                    "msg": (
                        "Input should be a valid datetime or date, unexpected "
                        f"extra characters at the end of the input: {str(e)}"
                    ),
                    "input": val,
                }
            ],
        )
