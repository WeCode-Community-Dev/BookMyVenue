# purpose is to create a database session for each request and automatically close it when the request is finished
from app.db.session import SessionLocal

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from app.core.security import (
    security,
    verify_token
)
 
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

# this is for protecting the api 
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return payload