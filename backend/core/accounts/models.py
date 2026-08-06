from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import models
from django.db.models import Q

from accounts.security import hash_password, verify_password


class UserRole(models.TextChoices):
    USER = "user", "User"
    ADMIN = "admin", "Admin"
    VENUE = "venue", "Venue"


class AuthProvider(models.TextChoices):
    EMAIL = "EMAIL", "Email"
    PHONE = "PHONE", "Phone"
    GOOGLE = "GOOGLE", "Google"


class UserManager(BaseUserManager):
    def get_by_natural_key(self, username):
        try:
            return self.get(email=username)
        except self.model.DoesNotExist:
            return self.get(phone=username)

    def create_user(self, email=None, phone=None, password=None, **extra_fields):
        if not email and not phone:
            raise ValueError("User must have an email or phone number.")

        email = self.normalize_email(email) if email else None
        extra_fields.setdefault("is_active", True)

        user = self.model(email=email, phone=phone, **extra_fields)
        user.set_unusable_password()
        user.save(using=self._db)

        if password:
            user.set_password(password)

        return user

    def create_superuser(self, email=None, phone=None, password=None, **extra_fields):
        if not email and not phone:
            raise ValueError("Superuser must have an email or phone number.")
        if not password:
            raise ValueError("Superuser must have a password.")

        extra_fields.setdefault("role", UserRole.ADMIN)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_email_verified", True)

        return self.create_user(email, phone, password, **extra_fields)


class User(AbstractBaseUser):
    full_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True, unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar_url = models.TextField(blank=True, null=True)
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.USER,
    )
    is_active = models.BooleanField(default=True)
    is_blocked = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[str] = []

    class Meta:
        db_table = "users"
        constraints = [
            models.CheckConstraint(
                condition=Q(email__isnull=False) | Q(phone__isnull=False),
                name="must_have_contact",
            ),
        ]
        indexes = [
            models.Index(fields=["email"], name="idx_users_email"),
            models.Index(fields=["phone"], name="idx_users_phone"),
            models.Index(fields=["role"], name="idx_users_role"),
        ]

    @property
    def is_staff(self) -> bool:
        return self.role == UserRole.ADMIN

    @property
    def is_superuser(self) -> bool:
        return self.role == UserRole.ADMIN

    def get_user_permissions(self, obj=None) -> set[str]:
        return set()

    def get_group_permissions(self, obj=None) -> set[str]:
        return set()

    def get_all_permissions(self, obj=None) -> set[str]:
        if not self.is_active or self.is_blocked or self.role != UserRole.ADMIN:
            return set()

        if not hasattr(self, "_perm_cache"):
            from django.contrib.auth.models import Permission

            self._perm_cache = {
                f"{perm.content_type.app_label}.{perm.codename}"
                for perm in Permission.objects.select_related("content_type")
            }
        return self._perm_cache

    def has_perm(self, perm, obj=None) -> bool:
        return self.is_active and not self.is_blocked and self.role == UserRole.ADMIN

    def has_module_perms(self, app_label) -> bool:
        return self.has_perm(None)

    def get_auth_account(self, provider: AuthProvider) -> "AuthAccount | None":
        return self.auth_accounts.filter(provider=provider).first()

    def set_password(self, raw_password, provider: AuthProvider | None = None):
        self.set_unusable_password()

        if raw_password is None:
            return

        if provider is None:
            if self.email:
                provider = AuthProvider.EMAIL
            elif self.phone:
                provider = AuthProvider.PHONE
            else:
                raise ValueError("Cannot set password without email or phone.")

        provider_user_id = (
            self.email if provider == AuthProvider.EMAIL else self.phone
        )
        if not provider_user_id:
            raise ValueError(
                f"User has no identifier for auth provider {provider}."
            )

        if not self.pk:
            raise ValueError("Save the user before setting a password.")

        AuthAccount.objects.update_or_create(
            user=self,
            provider=provider,
            defaults={
                "provider_user_id": provider_user_id,
                "password_hash": hash_password(raw_password),
            },
        )

    def check_password(self, raw_password) -> bool:
        for provider in (AuthProvider.EMAIL, AuthProvider.PHONE):
            account = self.get_auth_account(provider)
            if (
                account
                and account.password_hash
                and verify_password(raw_password, account.password_hash)
            ):
                return True
        return False

    def __str__(self) -> str:
        return self.full_name or self.email or self.phone or str(self.pk)


class AuthAccount(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="auth_accounts",
    )
    provider = models.CharField(max_length=20, choices=AuthProvider.choices)
    provider_user_id = models.CharField(max_length=255, blank=True, null=True)
    password_hash = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "auth_accounts"
        constraints = [
            models.UniqueConstraint(
                fields=["provider", "provider_user_id"],
                name="uq_auth_accounts_provider_user",
            ),
        ]
        indexes = [
            models.Index(fields=["provider"], name="idx_auth_accounts_provider"),
            models.Index(
                fields=["provider_user_id"],
                name="idx_auth_acct_provider_uid",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.provider}:{self.provider_user_id or self.pk}"
