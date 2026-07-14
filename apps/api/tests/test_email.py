import smtplib

from app.core import email as email_mod
from app.core.config import settings


def test_no_transport_configured_is_noop(monkeypatch):
    monkeypatch.setattr(settings, "resend_api_key", "")
    monkeypatch.setattr(settings, "smtp_host", "")
    assert email_mod.send_email("a@b.com", "Subject", "<p>x</p>") is False


def test_smtp_fallback_is_used(monkeypatch):
    monkeypatch.setattr(settings, "resend_api_key", "")
    monkeypatch.setattr(settings, "smtp_host", "smtp.example.com")
    monkeypatch.setattr(settings, "smtp_user", "")

    captured = {}

    class FakeSMTP:
        def __init__(self, host, port):
            captured["host"] = host
            captured["port"] = port

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

        def starttls(self):
            captured["starttls"] = True

        def login(self, user, password):
            captured["login"] = (user, password)

        def send_message(self, msg):
            captured["to"] = msg["To"]

    monkeypatch.setattr(smtplib, "SMTP", FakeSMTP)

    assert email_mod.send_email("guest@example.com", "Hi", "<p>hi</p>") is True
    assert captured["host"] == "smtp.example.com"
    assert captured["to"] == "guest@example.com"
    assert captured.get("starttls") is True


def test_resend_is_preferred_when_key_set(monkeypatch):
    monkeypatch.setattr(settings, "resend_api_key", "re_test")
    calls = {}

    def fake_resend(to, s, h, reply_to=None):
        calls["resend"] = (to, s)
        return True

    def fake_smtp(*a):
        calls["smtp"] = True
        return True

    monkeypatch.setattr(email_mod, "_send_via_resend", fake_resend)
    monkeypatch.setattr(email_mod, "_send_via_smtp", fake_smtp)
    assert email_mod.send_email("x@y.com", "S", "<p>b</p>") is True
    assert "resend" in calls and "smtp" not in calls
