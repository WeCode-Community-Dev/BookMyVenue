import json

import redis
from django.conf import settings
from django.db import transaction

from accounts.models import AuthAccount, AuthProvider, User, UserRole
from accounts.security import generate_otp, hash_otp, hash_password, verify_otp
from notifications.services.email_service import EmailService
from notifications.services.redis_client import RedisUnavailableError, get_redis_client
from notifications.tasks import send_otp_verification_email


class SignupSessionError(Exception):
    pass


class SignupSessionNotFoundError(SignupSessionError):
    pass


class SignupResendCooldownError(SignupSessionError):
    pass


class SignupMaxAttemptsExceededError(SignupSessionError):
    pass


class SignupRoleMismatchError(SignupSessionError):
    pass


class SignupSessionService:
    KEY_PREFIX = "bookmyvenue:signup"

    @classmethod
    def _session_key(cls, email: str) -> str:
        return f"{cls.KEY_PREFIX}:{email.strip().lower()}"

    @classmethod
    def _cooldown_key(cls, email: str) -> str:
        return f"{cls._session_key(email)}:cooldown"

    @classmethod
    def _client(cls) -> redis.Redis:
        try:
            return get_redis_client()
        except redis.RedisError as exc:
            raise RedisUnavailableError(
                "Verification service temporarily unavailable.",
            ) from exc

    @classmethod
    def _handle_redis_error(cls, exc: redis.RedisError) -> None:
        raise RedisUnavailableError(
            "Verification service temporarily unavailable.",
        ) from exc

    @classmethod
    def _ttl_seconds(cls) -> int:
        return settings.OTP_EXPIRE_MINUTES * 60

    @classmethod
    def _send_otp_email(
        cls,
        *,
        email: str,
        otp: str,
        async_send: bool,
    ) -> None:
        if async_send:
            send_otp_verification_email.delay(
                to=email,
                otp=otp,
                purpose_label="account registration",
            )
            return

        EmailService.send(
            template_key="otp_verification",
            to=email,
            context={
                "otp_code": otp,
                "purpose_label": "account registration",
                "expires_minutes": settings.OTP_EXPIRE_MINUTES,
            },
        )

    @classmethod
    def _store_session(
        cls,
        *,
        email: str,
        full_name: str | None,
        password_hash: str,
        role: UserRole,
        otp: str,
        attempts: int = 0,
    ) -> None:
        client = cls._client()
        payload = {
            "full_name": full_name,
            "email": email,
            "password_hash": password_hash,
            "role": role,
            "otp_hash": hash_otp(otp),
            "attempts": attempts,
        }

        try:
            client.setex(
                cls._session_key(email),
                cls._ttl_seconds(),
                json.dumps(payload),
            )
            client.setex(
                cls._cooldown_key(email),
                settings.OTP_RESEND_COOLDOWN_SECONDS,
                "1",
            )
        except redis.RedisError as exc:
            cls._handle_redis_error(exc)

    @classmethod
    def _get_session(cls, email: str) -> dict:
        client = cls._client()
        normalized_email = email.strip().lower()

        try:
            raw_payload = client.get(cls._session_key(normalized_email))
        except redis.RedisError as exc:
            cls._handle_redis_error(exc)

        if not raw_payload:
            raise SignupSessionNotFoundError(
                "Signup session expired or not found. Please register again.",
            )

        payload = json.loads(raw_payload)
        payload["email"] = normalized_email
        return payload

    @classmethod
    def _delete_session(cls, email: str) -> None:
        client = cls._client()
        normalized_email = email.strip().lower()

        try:
            client.delete(cls._session_key(normalized_email))
            client.delete(cls._cooldown_key(normalized_email))
        except redis.RedisError as exc:
            cls._handle_redis_error(exc)

    @classmethod
    def _response_metadata(cls, email: str) -> dict:
        return {
            "email": email.strip().lower(),
            "expires_in_seconds": cls._ttl_seconds(),
            "resend_cooldown_seconds": settings.OTP_RESEND_COOLDOWN_SECONDS,
        }

    @classmethod
    def start_signup(
        cls,
        *,
        email: str,
        password: str,
        role: UserRole,
        full_name: str | None = None,
        async_send: bool = True,
    ) -> dict:
        normalized_email = email.strip().lower()
        client = cls._client()

        try:
            if client.exists(cls._cooldown_key(normalized_email)):
                raise SignupResendCooldownError(
                    "Please wait before requesting another verification code.",
                )
        except redis.RedisError as exc:
            cls._handle_redis_error(exc)

        otp = generate_otp(settings.OTP_LENGTH)
        cls._store_session(
            email=normalized_email,
            full_name=full_name,
            password_hash=hash_password(password),
            role=role,
            otp=otp,
        )
        cls._send_otp_email(email=normalized_email, otp=otp, async_send=async_send)

        return cls._response_metadata(normalized_email)

    @classmethod
    def resend_otp(
        cls,
        *,
        email: str,
        role: UserRole,
        async_send: bool = True,
    ) -> dict:
        normalized_email = email.strip().lower()
        session = cls._get_session(normalized_email)

        if session["role"] != role:
            raise SignupRoleMismatchError(
                "This signup session does not match the requested account type.",
            )

        client = cls._client()
        try:
            if client.exists(cls._cooldown_key(normalized_email)):
                raise SignupResendCooldownError(
                    "Please wait before requesting another verification code.",
                )
        except redis.RedisError as exc:
            cls._handle_redis_error(exc)

        otp = generate_otp(settings.OTP_LENGTH)
        cls._store_session(
            email=normalized_email,
            full_name=session.get("full_name"),
            password_hash=session["password_hash"],
            role=role,
            otp=otp,
            attempts=0,
        )
        cls._send_otp_email(email=normalized_email, otp=otp, async_send=async_send)

        return cls._response_metadata(normalized_email)

    @classmethod
    def verify_and_create_user(cls, *, email: str, otp: str, role: UserRole) -> User:
        normalized_email = email.strip().lower()
        session = cls._get_session(normalized_email)

        if session["role"] != role:
            raise SignupRoleMismatchError(
                "This signup session does not match the requested account type.",
            )

        attempts = session.get("attempts", 0)
        if attempts >= settings.OTP_MAX_ATTEMPTS:
            cls._delete_session(normalized_email)
            raise SignupMaxAttemptsExceededError(
                "Too many invalid attempts. Please register again.",
            )

        if not verify_otp(otp, session["otp_hash"]):
            session["attempts"] = attempts + 1
            client = cls._client()
            try:
                remaining_ttl = client.ttl(cls._session_key(normalized_email))
                if remaining_ttl > 0:
                    client.setex(
                        cls._session_key(normalized_email),
                        remaining_ttl,
                        json.dumps(session),
                    )
            except redis.RedisError as exc:
                cls._handle_redis_error(exc)
            raise SignupSessionError("Invalid verification code.")

        cls._delete_session(normalized_email)

        with transaction.atomic():
            user = User(
                email=normalized_email,
                full_name=session.get("full_name") or None,
                role=role,
                is_email_verified=True,
                is_active=True,
            )
            user.set_unusable_password()
            user.save()

            AuthAccount.objects.create(
                user=user,
                provider=AuthProvider.EMAIL,
                provider_user_id=normalized_email,
                password_hash=session["password_hash"],
            )

        return user
