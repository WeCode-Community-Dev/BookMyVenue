from dataclasses import dataclass
from uuid import UUID

from fastapi import Depends, Header
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.exceptions import ForbiddenError, UnauthorizedError
from app.modules.auth.providers.supabase import SupabaseAuthProvider
from app.modules.profile.models import Profile, ProfileStatus, UserRole, UserRoleAssignment

_auth_provider = SupabaseAuthProvider()


def get_auth_provider():
    """Provider-agnostic accessor — business modules must go through this
    instead of importing SupabaseAuthProvider directly."""
    return _auth_provider


@dataclass
class AuthContext:
    user_id: UUID
    email: str | None
    full_name: str | None
    phone: str | None
    avatar_url: str | None
    status: str
    roles: list[str]

    def has_role(self, role: str) -> bool:
        return role in self.roles

    def is_admin(self) -> bool:
        return "super_admin" in self.roles

    def is_owner(self) -> bool:
        return "venue_owner" in self.roles or self.is_admin()


def _extract_bearer_token(authorization: str) -> str:
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise UnauthorizedError("Invalid authorization header")
    return parts[1]


def get_current_user(
    authorization: str = Header(...),
    db: Session = Depends(get_db),
) -> AuthContext:
    token = _extract_bearer_token(authorization)
    provider_user = _auth_provider.verify_token(token)

    profile = (
        db.query(Profile)
        .filter(
            Profile.id == provider_user.id,
            Profile.deleted_at.is_(None),
        )
        .first()
    )

    if not profile:
        raise ForbiddenError("Account not found")

    if profile.status == ProfileStatus.suspended:
        raise ForbiddenError("Account suspended")

    # Defense in depth: Supabase itself refuses to issue a session for an
    # unconfirmed email (see CLAUDE.md — Supabase owns email verification).
    # This only catches a session minted while that project setting was
    # briefly misconfigured/off; it never fires for accounts that existed
    # before this check shipped (backfilled in migration 7f3a1c9d2b4e).
    if profile.email_confirmed_at is None:
        raise ForbiddenError("email_not_confirmed")

    # Keep email in profiles in sync with the authoritative JWT value
    if provider_user.email and profile.email != provider_user.email:
        profile.email = provider_user.email

    role_rows = (
        db.query(UserRoleAssignment).filter(UserRoleAssignment.user_id == provider_user.id).all()
    )

    roles = [r.role.value for r in role_rows]

    # Every account carries 'customer' as a baseline role (see CLAUDE.md role
    # model). Accounts created before the signup trigger existed, or via
    # out-of-band inserts (admin scripts, direct SQL), may be missing it —
    # self-heal here so login works without a manual backfill.
    if UserRole.customer.value not in roles:
        db.add(UserRoleAssignment(user_id=profile.id, role=UserRole.customer))
        db.commit()
        roles.append(UserRole.customer.value)

    return AuthContext(
        user_id=profile.id,
        email=provider_user.email,
        full_name=profile.full_name,
        phone=profile.phone,
        avatar_url=profile.avatar_url,
        status=profile.status.value,
        roles=roles,
    )


def get_current_user_optional(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> AuthContext | None:
    if not authorization:
        return None
    try:
        return get_current_user(authorization, db)
    except Exception:
        return None


def require_auth(
    current_user: AuthContext = Depends(get_current_user),
) -> AuthContext:
    return current_user


def require_role(*roles: str):
    def dependency(
        current_user: AuthContext = Depends(get_current_user),
    ) -> AuthContext:
        if not any(r in current_user.roles for r in roles):
            raise ForbiddenError("Insufficient permissions")
        return current_user

    return dependency


def require_any_role(roles: list[str]):
    def dependency(
        current_user: AuthContext = Depends(get_current_user),
    ) -> AuthContext:
        if not any(r in current_user.roles for r in roles):
            raise ForbiddenError("Insufficient permissions")
        return current_user

    return dependency


def require_admin(
    current_user: AuthContext = Depends(get_current_user),
) -> AuthContext:
    if not current_user.is_admin():
        raise ForbiddenError("Admin access required")
    return current_user


def require_owner(
    current_user: AuthContext = Depends(get_current_user),
) -> AuthContext:
    if not current_user.is_owner():
        raise ForbiddenError("Venue owner access required")
    if not current_user.is_admin():
        if current_user.status == "pending":
            raise ForbiddenError("account_pending")
        if current_user.status == "rejected":
            raise ForbiddenError("account_rejected")
    return current_user
