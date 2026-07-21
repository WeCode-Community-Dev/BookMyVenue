import json
import threading
import urllib.error
import urllib.request
from uuid import UUID

from jose import JWTError, jwt

from app.core.config import settings
from app.core.exceptions import BadRequestError, ConflictError, UnauthorizedError
from app.modules.auth.providers.base import AuthProvider, ProviderUser

_ADMIN_API_TIMEOUT_SECONDS = 10
_JWKS_TIMEOUT_SECONDS = 5


class _HangTimeout(Exception):
    """Raised when a blocking call doesn't finish within the deadline."""


def _run_with_hard_timeout(fn, timeout_seconds: float):
    """Run `fn` (a zero-arg blocking callable) on a daemon thread and wait
    up to `timeout_seconds` wall-clock. `urlopen`'s own `timeout` argument
    only bounds the socket connect/read — it does NOT cover DNS resolution,
    a separate blocking OS call with no timeout at all. A stalled
    resolver/connect on the host network (observed on Render — forgot-password
    hung indefinitely with the request thread stuck and no response ever sent
    to the client) can hang `fn` forever with nothing downstream able to stop
    it. This guarantees the caller always gets control back within
    `timeout_seconds`, no matter what's stuck underneath.

    Uses a plain daemon thread rather than ThreadPoolExecutor: the latter
    registers an atexit hook that joins ALL its worker threads — including
    ones already abandoned via shutdown(wait=False) — before the process can
    exit, so a single hang would leak a thread that later blocks graceful
    shutdown/redeploy. A daemon thread carries no such obligation.
    """
    result: dict = {}
    error: list[BaseException] = []
    done = threading.Event()

    def _target():
        try:
            result["value"] = fn()
        except BaseException as exc:  # noqa: BLE001 -- re-raised on the caller's thread below
            error.append(exc)
        finally:
            done.set()

    threading.Thread(target=_target, daemon=True).start()
    if not done.wait(timeout=timeout_seconds):
        raise _HangTimeout()
    if error:
        raise error[0]
    return result["value"]


class SupabaseAuthProvider(AuthProvider):
    def __init__(self) -> None:
        self._jwks_cache: list | None = None

    def _get_jwks(self) -> list:
        if self._jwks_cache is None:
            url = f"{settings.supabase_url}/auth/v1/.well-known/jwks.json"

            def _do_request() -> list:
                with urllib.request.urlopen(url, timeout=_JWKS_TIMEOUT_SECONDS) as resp:  # noqa: S310
                    return json.loads(resp.read()).get("keys", [])

            self._jwks_cache = _run_with_hard_timeout(_do_request, _JWKS_TIMEOUT_SECONDS)
        return self._jwks_cache

    def verify_token(self, token: str) -> ProviderUser:
        try:
            header = jwt.get_unverified_header(token)
            alg = header.get("alg", "HS256")

            if alg == "HS256":
                payload = jwt.decode(
                    token,
                    settings.supabase_jwt_secret,
                    algorithms=["HS256"],
                    audience="authenticated",
                )
            else:
                # RS256 or other asymmetric alg — verify via Supabase JWKS
                kid = header.get("kid")
                keys = self._get_jwks()
                key = next((k for k in keys if k.get("kid") == kid), None) or (
                    keys[0] if keys else None
                )
                if key is None:
                    raise UnauthorizedError("No matching JWKS key found")
                payload = jwt.decode(
                    token,
                    key,
                    algorithms=[alg],
                    audience="authenticated",
                )
        except JWTError as exc:
            raise UnauthorizedError(f"JWT error: {exc}")
        except (urllib.error.URLError, TimeoutError, _HangTimeout) as exc:
            # JWKS fetch failed (network blip, Supabase briefly unreachable, etc.) —
            # this must surface as a normal 401, not an uncaught 500 that takes
            # every authenticated request down with it. Cache stays empty, so the
            # next request retries the fetch on its own.
            raise UnauthorizedError(f"Could not verify token — key lookup failed: {exc}")

        sub = payload.get("sub")
        if not sub:
            raise UnauthorizedError("Token missing subject claim")

        return ProviderUser(id=UUID(sub), email=payload.get("email"))

    def _generate_link(self, body: dict) -> dict:
        """POST /admin/generate_link — creates the account/token but sends no
        email itself, unlike /invite or the client SDK's resetPasswordForEmail.
        See _run_with_hard_timeout for why this is wrapped in a hard deadline.
        """
        url = f"{settings.supabase_url}/auth/v1/admin/generate_link"
        req = urllib.request.Request(
            url,
            data=json.dumps(body).encode(),
            method="POST",
            headers={
                "apikey": settings.supabase_service_role_key,
                "Authorization": f"Bearer {settings.supabase_service_role_key}",
                "Content-Type": "application/json",
            },
        )

        def _do_request() -> dict:
            with urllib.request.urlopen(req, timeout=_ADMIN_API_TIMEOUT_SECONDS) as resp:  # noqa: S310
                return json.loads(resp.read())

        try:
            return _run_with_hard_timeout(_do_request, _ADMIN_API_TIMEOUT_SECONDS)
        except _HangTimeout:
            raise BadRequestError("Could not reach Supabase — request timed out.")

    def create_invite_link(
        self,
        email: str,
        *,
        full_name: str | None = None,
        phone: str | None = None,
        redirect_to: str | None = None,
    ) -> tuple[ProviderUser, str]:
        body = {"type": "invite", "email": email, "data": {"full_name": full_name, "phone": phone}}
        if redirect_to:
            body["redirect_to"] = redirect_to

        try:
            payload = self._generate_link(body)
        except urllib.error.HTTPError as exc:
            error_body = exc.read().decode()
            if exc.code == 422 or "already been registered" in error_body:
                raise ConflictError("This email is already registered")
            raise BadRequestError(
                f"Supabase could not create the invite "
                f"(HTTP {exc.code}): {error_body or exc.reason}"
            )
        except urllib.error.URLError as exc:
            raise BadRequestError(f"Could not reach Supabase to create the invite: {exc.reason}")

        user = payload.get("user", payload)
        return ProviderUser(id=UUID(user["id"]), email=user.get("email")), payload["action_link"]

    def create_recovery_link(self, email: str, *, redirect_to: str | None = None) -> str | None:
        body = {"type": "recovery", "email": email}
        if redirect_to:
            body["redirect_to"] = redirect_to

        try:
            payload = self._generate_link(body)
        except urllib.error.HTTPError as exc:
            if exc.code in (400, 404, 422):
                return None
            error_body = exc.read().decode()
            raise BadRequestError(
                f"Supabase could not create the reset link "
                f"(HTTP {exc.code}): {error_body or exc.reason}"
            )
        except urllib.error.URLError as exc:
            raise BadRequestError(
                f"Could not reach Supabase to create the reset link: {exc.reason}"
            )

        return payload["action_link"]

    def create_signup_confirmation_link(
        self, email: str, *, redirect_to: str | None = None
    ) -> str | None:
        body = {"type": "signup", "email": email}
        if redirect_to:
            body["redirect_to"] = redirect_to

        try:
            payload = self._generate_link(body)
        except urllib.error.HTTPError as exc:
            if exc.code in (400, 404, 422):
                return None
            error_body = exc.read().decode()
            raise BadRequestError(
                f"Supabase could not create the confirmation link "
                f"(HTTP {exc.code}): {error_body or exc.reason}"
            )
        except urllib.error.URLError as exc:
            raise BadRequestError(
                f"Could not reach Supabase to create the confirmation link: {exc.reason}"
            )

        return payload["action_link"]
