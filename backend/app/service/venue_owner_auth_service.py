import secrets

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.schema.venue_owner_auth_schema import (
    CreateOwnerProfileRequest,
    OwnerProfileResponse,
    UpdateOwnerStatusResponse,
    VenueOwnerOTPRequest,
    VenueOwnerOTPResponse,
    VenueOwnerResponse,
)
from app.config.security import create_access_token, create_refresh_token
from app.config.redis import redis_client
from app.core.config import settings
from app.service.user_service import user_service
from app.service.sms_service import sms_service
from app.model.user import User, UserRole
from app.schema.user_auth_schema import OTPVerifyRequest, TokenResponse
from app.model.owner_profile import ApprovalStatus, OwnerProfile


class VenueOwnerAuthService:
    """
    Service containing the venue owner authentication business logic.
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

    def create_business_profile(
        self,
        db: Session,
        data: CreateOwnerProfileRequest,
        user_id: str,
    ) -> OwnerProfileResponse:
        try:
            owner_profile = OwnerProfile(
                user_id=user_id,
                business_name=data.business_name,
            )

            db.add(owner_profile)
            db.commit()
            db.refresh(owner_profile)

            return OwnerProfileResponse(
                id=owner_profile.id,
                user_id=owner_profile.id,
                business_name=owner_profile.business_name,
                approval_status=owner_profile.approval_status,
                created_at=owner_profile.created_at,
                updated_at=owner_profile.updated_at,
            )
        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def request_otp(
        self, db: Session, data: VenueOwnerOTPRequest
    ) -> VenueOwnerOTPResponse:
        """
        Generates an OTP, stores it in cache with TTL, and dispatches it via SMS.
        Returns the OTP for testing purposes.
        """
        try:
            otp = self._generate_otp_code()
            cache_key = f"otp:{data.mobile_number}"

            # Cache standard key-value with TTL
            redis_client.setex(cache_key, settings.OTP_EXPIRE_SECONDS, otp)

            # Dispatch message
            sms_service.send_otp(data.mobile_number, otp)

            user = user_service.create_user(
                db,
                mobile_number=data.mobile_number,
                full_name=data.full_name,
                email=data.email,
                role=UserRole.VENUE_OWNER,
            )

            self.create_business_profile(
                db=db,
                data=CreateOwnerProfileRequest(
                    business_name=data.business_name,
                ),
                user_id=user.id,
            )

            return VenueOwnerOTPResponse(
                full_name=data.full_name,
                email=data.email,
                mobile_number=data.mobile_number,
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
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid Mobile number",
                )

            user.mobile_verified = True
            db.commit()

            # 5. Generate secure JWT pair
            access_token = create_access_token(subject=user.id)
            refresh_token = create_refresh_token(subject=user.id)

            # Return full serialized profile + token payload
            return TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                user=VenueOwnerResponse.model_validate(user),
            )
        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def update_status(
        self,
        db: Session,
        owner_id: str,
        status: int,
    ):
        try:

            user = user_service.get_user_by_id(
                db=db,
                user_id=owner_id,
            )

            if not user.owner_profile:
                raise HTTPException(
                    status_code=404,
                    detail="Owner profile not found",
                )

            status_mapping = {
                0: ApprovalStatus.APPROVED,
                1: ApprovalStatus.REJECTED,
                2: ApprovalStatus.SUSPENDED,
            }

            user.owner_profile.approval_status = status_mapping.get(
                status,
                ApprovalStatus.PENDING,
            )

            db.commit()
            db.refresh(user)

            return UpdateOwnerStatusResponse(
                owner_id=owner_id,
                approval_status=user.owner_profile.approval_status,
            )

        except HTTPException:
            raise

        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=str(e),
            )

    def get_owner_profile(
        self,
        db: Session,
        owner_id: str,
    ) -> VenueOwnerResponse:
        try:
            user = user_service.get_user_by_id(
                db=db,
                user_id=owner_id,
            )
            return VenueOwnerResponse.model_validate(user)
        except HTTPException:
            raise

        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=str(e),
            )

    def get_all_venue_owners(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 20,
    ) -> User:
        try:
            venue_owners = (
                db.query(User)
                .options(joinedload(User.owner_profile))
                .filter(User.role == UserRole.VENUE_OWNER)
                .order_by(User.created_at.desc())
                .offset(skip)
                .limit(limit)
                .all()
            )

            return venue_owners
        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


# Singleton instance
venue_owner_auth_service = VenueOwnerAuthService()
