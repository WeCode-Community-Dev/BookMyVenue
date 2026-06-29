import secrets
from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.schema.user_auth_schema import (
    AdminAuthRequest,
    AdminAuthResponse,
    OTPResponse,
    OTPVerifyRequest,
    TokenResponse,
    UserResponse,
)
from app.config.security import create_access_token, create_refresh_token, verify_token
from app.config.constant import ADMIN_EMAIL, ADMIN_PASSWORD
from app.config.redis import redis_client
from app.core.config import settings
from app.service.user_service import user_service
from app.service.sms_service import sms_service
from app.model.user import User, UserRole


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
class UserAuthService:
    """
    Service containing the user authentication business logic.
    """

    def _generate_otp_code(self) -> str:
        """
        Generates a secure random numeric OTP code of specified length.
        """
        # Cryptographically secure random digit generator
        try:
            return "".join(
                secrets.choice("0123456789") for _ in range(settings.OTP_LENGTH)
            )
        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def request_otp(self, mobile_number: str) -> OTPResponse:
        """
        Generates an OTP, stores it in cache with TTL, and dispatches it via SMS.
        Returns the OTP for testing purposes.
        """
        try:

            otp = self._generate_otp_code()
            cache_key = f"otp:{mobile_number}"

            # Cache standard key-value with TTL
            redis_client.setex(cache_key, settings.OTP_EXPIRE_SECONDS, otp)

            # Dispatch message
            sms_service.send_otp(mobile_number, otp)

            return OTPResponse(
                mobile_number=mobile_number,
                otp=otp,
                expires_in_seconds=settings.OTP_EXPIRE_SECONDS,
                message="OTP Generates Successfully",
            )
        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def verify_otp(self, db: Session, data: OTPVerifyRequest) -> TokenResponse:
        try:
            """
            Validates OTP, deletes it if correct to prevent reuse, registers or retrieves
            the User, and generates standard Bearer tokens.
            """
            cache_key = f"otp:{data.mobile_number}"
            cached_otp = redis_client.get(cache_key)

            # 1. Validate expiration or non-existence
            if not cached_otp:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="OTP has expired or was never requested.",
                )

            # 2. Match verification code
            if cached_otp != data.otp:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP code."
                )

            # 3. Clean up cache key immediately to block replay attacks (OTP = One Time Password)
            redis_client.delete(cache_key)

            # 4. Check/Register User
            user = user_service.get_user_by_mobile_number(db, data.mobile_number)
            if not user:
                user = user_service.create_user(db, data.mobile_number)

            user.mobile_verified = True
            db.commit()

            # 5. Generate secure JWT pair
            access_token = create_access_token(subject=user.id)
            refresh_token = create_refresh_token(subject=user.id)

            # Return full serialized profile + token payload
            return TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                user=UserResponse.model_validate(user),
            )
        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def refresh_token(self, db: Session, refresh_token: str) -> TokenResponse:
        """
        Verifies a refresh token and generates a new access/refresh pair.
        """
        # Decode and assert token type is 'refresh'
        user_id_str = verify_token(refresh_token, expected_type="refresh")
        if not user_id_str:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token.",
            )

        try:
            user_id = int(user_id_str)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Malformed token identity payload.",
            )

        # Resolve user
        user = user_service.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User associated with token no longer exists.",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated.",
            )

        # Generate new JWT pair for continuous authentication
        access_token = create_access_token(subject=user.id)
        new_refresh_token = create_refresh_token(subject=user.id)

        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            user=UserResponse.model_validate(user),
        )

    def get_all_users(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 20,
    ) -> List[User]:
        try:
            users = (
                db.query(User)
                .options(joinedload(User.owner_profile))
                .filter(User.role == UserRole.CUSTOMER)
                .order_by(User.created_at.desc())
                .offset(skip)
                .limit(limit)
                .all()
            )

            return users
        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_user_profile(
        self,
        db: Session,
        user_id: str,
    ) -> UserResponse:
        try:
            user = user_service.get_user_by_id(
                db=db,
                user_id=user_id,
            )
            return UserResponse.model_validate(user)
        except HTTPException:
            raise

        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=str(e),
            )


# Singleton instance
user_auth_service = UserAuthService()
