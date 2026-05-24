from fastapi import HTTPException
from app.schema.auth_schema import AdminAuthRequest, AdminAuthResponse
from app.config.constant import ADMIN_EMAIL, ADMIN_PASSWORD


## Admin Auth API Service
async def authenticate_admin_service(data: AdminAuthRequest):
    try:
        email = ADMIN_EMAIL
        password = ADMIN_PASSWORD

        if data.email != email:
            raise HTTPException(status_code=401, detail="Invalid admin email")

        if data.password != password:
            raise HTTPException(status_code=401, detail="Invalid admin password")

        return AdminAuthResponse(email=email, is_authenticated=True)

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


## Venue owner Auth API Service

## User/Customer Auth API Service
