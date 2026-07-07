from abc import ABC, abstractmethod
from dataclasses import dataclass
from uuid import UUID


@dataclass
class ProviderUser:
    id: UUID
    email: str | None


class AuthProvider(ABC):
    @abstractmethod
    def verify_token(self, token: str) -> ProviderUser:
        """Verify the token and return a normalized ProviderUser.
        Raise UnauthorizedError if the token is invalid or expired.
        """
        ...

    @abstractmethod
    def create_invite_link(
        self,
        email: str,
        *,
        full_name: str | None = None,
        phone: str | None = None,
        redirect_to: str | None = None,
    ) -> tuple[ProviderUser, str]:
        """Create an account for `email` in invited state and return
        (user, action_link) — a one-time secure account-setup URL. Does NOT
        send any email; the caller is responsible for delivering the link
        (this project emails it via its own Resend pipeline rather than the
        provider's, since the provider's default email sending requires a
        verified sending domain this project doesn't have). Raise
        ConflictError if the email is already registered.
        """
        ...

    @abstractmethod
    def create_recovery_link(self, email: str, *, redirect_to: str | None = None) -> str | None:
        """Generate a one-time password-recovery URL for an existing
        account. Does NOT send any email. Returns None if no account exists
        for `email` — callers must still respond as if it succeeded, to
        avoid leaking which emails are registered.
        """
        ...
