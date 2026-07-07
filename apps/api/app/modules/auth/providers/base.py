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
    def invite_user(
        self,
        email: str,
        *,
        full_name: str | None = None,
        phone: str | None = None,
        redirect_to: str | None = None,
    ) -> ProviderUser:
        """Create an account for `email` in invited state and send it a
        secure account-setup link. Raise ConflictError if the email is
        already registered. Business modules must call this instead of
        talking to the provider directly.
        """
        ...
