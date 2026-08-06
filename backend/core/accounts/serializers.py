from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.conf import settings
from rest_framework import serializers

from accounts.google_auth import login_or_register_with_google, verify_google_id_token
from accounts.models import User, UserRole
from accounts.security import create_access_token, create_refresh_token
from accounts.validators import validate_full_name, validate_phone


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "full_name",
            "email",
            "phone",
            "avatar_url",
            "role",
            "is_active",
            "is_blocked",
            "is_email_verified",
            "is_phone_verified",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields


class UserUpdateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=True, allow_blank=False, max_length=255)
    phone = serializers.CharField(required=True, allow_blank=False, max_length=20)

    class Meta:
        model = User
        fields = ("full_name", "phone")

    def validate_phone(self, value):
        try:
            return validate_phone(value)
        except ValueError as exc:
            raise serializers.ValidationError(str(exc)) from exc

    def validate_full_name(self, value):
        try:
            return validate_full_name(value)
        except ValueError as exc:
            raise serializers.ValidationError(str(exc)) from exc


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    full_name = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=255,
    )

    def validate_email(self, value):
        email = User.objects.normalize_email(value)
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("Email already registered.")
        return email

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate_full_name(self, value):
        if value in (None, ""):
            return None
        try:
            return validate_full_name(value)
        except ValueError as exc:
            raise serializers.ValidationError(str(exc)) from exc


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        email = User.objects.normalize_email(attrs["email"])
        expected_role = self.context["role"]

        user = User.objects.filter(email__iexact=email).first()
        if user and user.role != expected_role:
            raise serializers.ValidationError(
                {
                    "email": (
                        f"This email is associated with a {user.role} account."
                    ),
                },
            )

        authenticated_user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=attrs["password"],
        )
        if authenticated_user is None:
            raise serializers.ValidationError(
                {"detail": "Invalid email or password."},
            )

        if not authenticated_user.is_active or authenticated_user.is_blocked:
            raise serializers.ValidationError(
                {"detail": "Account is disabled."},
            )

        attrs["user"] = authenticated_user
        return attrs


class GoogleLoginSerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True)

    def validate(self, attrs):
        info = verify_google_id_token(attrs["token"])
        role = self.context["role"]
        attrs["user"] = login_or_register_with_google(info, role)
        return attrs


class ResendSignupOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return User.objects.normalize_email(value)


class VerifySignupOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()

    def validate_otp(self, value):
        otp = value.strip()
        if not otp.isdigit():
            raise serializers.ValidationError("OTP must contain only digits.")
        if len(otp) != settings.OTP_LENGTH:
            raise serializers.ValidationError(
                f"OTP must be {settings.OTP_LENGTH} digits.",
            )
        return otp


class RefreshSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()


def build_token_response(user: User) -> dict:
    return {
        "access_token": create_access_token(user),
        "refresh_token": create_refresh_token(user.id),
        "token_type": "bearer",
        "user": UserSerializer(user).data,
    }
