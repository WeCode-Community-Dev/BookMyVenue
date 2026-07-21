from uuid import uuid4

from tests.conftest import seed_auth_user, seed_user


def test_missing_auth_header_returns_422(client):
    # FastAPI rejects missing required headers before reaching auth logic
    resp = client.get("/api/bookings/")
    assert resp.status_code == 422


def test_malformed_auth_header_returns_401(client):
    # Header present but not in "Bearer <token>" format
    resp = client.get("/api/bookings/", headers={"Authorization": "notbearer"})
    assert resp.status_code == 401


def test_invalid_jwt_returns_401(client):
    resp = client.get("/api/bookings/", headers={"Authorization": "Bearer bad.jwt.value"})
    assert resp.status_code == 401


def test_customer_on_owner_route_returns_403(client, db):
    _, token = seed_user(db, "customer")
    resp = client.get("/api/bookings/owner", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 403


def test_customer_can_access_auth_required_route(client, db):
    _, token = seed_user(db, "customer")
    resp = client.get("/api/bookings/", headers={"Authorization": f"Bearer {token}"})
    # 200 with empty list — not 401/403
    assert resp.status_code == 200


def test_send_confirmation_emails_unconfirmed_account(client, db, monkeypatch):
    """Existing-but-unconfirmed account: fetch a fresh link and email it —
    same operation whether it's the post-signup send or a resend click."""
    user_id = uuid4()
    email = f"unconfirmed-{user_id.hex[:6]}@test.com"
    seed_auth_user(db, user_id, email, email_confirmed=False)
    db.commit()

    sent = {}

    def fake_create_signup_confirmation_link(self, target_email, *, redirect_to=None):
        assert target_email == email
        return "https://example.com/verify?token=fake"

    def fake_send_email(to, subject, html, reply_to=None):
        sent["to"] = to
        sent["subject"] = subject
        return True

    monkeypatch.setattr(
        "app.modules.auth.providers.supabase.SupabaseAuthProvider.create_signup_confirmation_link",
        fake_create_signup_confirmation_link,
    )
    monkeypatch.setattr("app.core.email.send_email", fake_send_email)

    resp = client.post(
        "/api/auth/send-confirmation",
        json={"email": email, "redirect_to": "http://localhost:5397/login"},
    )
    assert resp.status_code == 204
    assert sent["to"] == email


def test_send_confirmation_no_account_is_silent_noop(client, db, monkeypatch):
    """No account for the email (or already confirmed) — respond the same
    as success, and never send an email, so the endpoint can't be used to
    probe which emails are registered."""

    def fake_create_signup_confirmation_link(self, target_email, *, redirect_to=None):
        return None

    def fake_send_email(to, subject, html, reply_to=None):
        raise AssertionError("send_email should not be called")

    monkeypatch.setattr(
        "app.modules.auth.providers.supabase.SupabaseAuthProvider.create_signup_confirmation_link",
        fake_create_signup_confirmation_link,
    )
    monkeypatch.setattr("app.core.email.send_email", fake_send_email)

    resp = client.post(
        "/api/auth/send-confirmation",
        json={"email": "nobody@test.com", "redirect_to": "http://localhost:5397/login"},
    )
    assert resp.status_code == 204


def test_send_confirmation_rejects_unknown_redirect_origin(client, db, monkeypatch):
    """redirect_to pointing somewhere other than our own frontends must not
    trigger a Supabase lookup or an email — same guard as forgot-password."""

    def fake_create_signup_confirmation_link(self, target_email, *, redirect_to=None):
        raise AssertionError("should not reach the provider for an untrusted origin")

    monkeypatch.setattr(
        "app.modules.auth.providers.supabase.SupabaseAuthProvider.create_signup_confirmation_link",
        fake_create_signup_confirmation_link,
    )

    resp = client.post(
        "/api/auth/send-confirmation",
        json={"email": "someone@test.com", "redirect_to": "https://evil.example.com/login"},
    )
    assert resp.status_code == 204
