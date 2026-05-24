from fastapi import APIRouter, status

from app.schema.auth_schema import AdminAuthResponse, AdminAuthRequest
from app.schema.base_schema import SuccessResponse
from app.service.auth_service import authenticate_admin_service

router = APIRouter()


## Admin Auth Endpoint
@router.post(
    "/admin-login",
    response_model=SuccessResponse[AdminAuthResponse],
    status_code=status.HTTP_200_OK,
    summary="Authenticate Admin",
    description="Authenticate admin using static email and password",
)
async def authenticate_admin(data: AdminAuthRequest):
    result = await authenticate_admin_service(data=data)
    return SuccessResponse(message="Admin Logged in Successfully", data=result)


## Venue owner Auth Endpoint


## User/Customer Auth Endpoint
