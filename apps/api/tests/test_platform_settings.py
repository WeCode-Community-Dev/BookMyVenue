"""
Admin-editable platform settings (CLAUDE.md Database Rules: platform_settings).

Tests verify the read/write/audit loop end-to-end:
  1. get_setting() falls back to the hardcoded default with no DB override
  2. seed_platform_settings() inserts defaults once and never overwrites
  3. update_platform_settings() persists an override, get_setting() reflects it,
     and a settings_updated AdminAction row is written in the same transaction
  4. Out-of-range values are rejected (400) and never written
  5. Non-admins cannot call PATCH /api/admin/settings
"""

import pytest
from fastapi import HTTPException

from app.modules.admin import settings_store
from app.modules.admin.models import AdminAction, PlatformSetting
from app.modules.admin.schemas import PlatformSettingsUpdateRequest
from app.modules.admin.service import update_platform_settings
from tests.conftest import seed_user


def test_get_setting_falls_back_to_default_with_no_override(db):
    value = settings_store.get_setting(db, "token_payment_hold_hours")
    assert value == settings_store.SETTINGS["token_payment_hold_hours"].default


def test_seed_platform_settings_inserts_defaults_once(db):
    settings_store.seed_platform_settings(db)

    for key, spec in settings_store.SETTINGS.items():
        row = db.get(PlatformSetting, key)
        assert row is not None
        assert row.value == spec.default

    # Admin overrides a value, then seed runs again — must not clobber it
    row = db.get(PlatformSetting, "token_payment_hold_hours")
    row.value = 99
    db.commit()

    settings_store.seed_platform_settings(db)

    db.refresh(row)
    assert row.value == 99


def test_update_platform_settings_persists_override_and_audits(db):
    admin_id, _ = seed_user(db, "super_admin")

    result = update_platform_settings(
        db,
        admin_id=admin_id,
        body=PlatformSettingsUpdateRequest(token_payment_hold_hours=36),
    )

    assert result["token_payment_hold_hours"] == 36
    assert settings_store.get_setting(db, "token_payment_hold_hours") == 36

    action = (
        db.query(AdminAction)
        .filter(AdminAction.action_type == "settings_updated", AdminAction.admin_id == admin_id)
        .order_by(AdminAction.created_at.desc())
        .first()
    )
    assert action is not None
    assert action.target_type == "settings"
    assert action.action_metadata == {"changed": {"token_payment_hold_hours": 36}}


def test_update_platform_settings_rejects_out_of_range_value(db):
    admin_id, _ = seed_user(db, "super_admin")

    with pytest.raises(HTTPException) as exc_info:
        update_platform_settings(
            db,
            admin_id=admin_id,
            body=PlatformSettingsUpdateRequest(max_deadline_extensions=999),
        )
    assert exc_info.value.status_code == 400

    # Unchanged — the invalid update must never be written
    assert settings_store.get_setting(db, "max_deadline_extensions") == (
        settings_store.SETTINGS["max_deadline_extensions"].default
    )


def test_patch_settings_requires_admin(client, db):
    _, customer_token = seed_user(db, "customer")

    resp = client.patch(
        "/api/admin/settings",
        json={"token_payment_hold_hours": 36},
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert resp.status_code == 403


def test_patch_settings_happy_path_via_http(client, db):
    _, admin_token = seed_user(db, "super_admin")

    resp = client.patch(
        "/api/admin/settings",
        json={"balance_overdue_action_window_hours": 60},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 200
    assert resp.json()["balance_overdue_action_window_hours"] == 60


def test_settings_metadata_covers_every_registered_key(client, db):
    _, admin_token = seed_user(db, "super_admin")

    resp = client.get(
        "/api/admin/settings/metadata",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 200

    body = resp.json()
    keys_in_metadata = {
        field["key"] for category in body["categories"] for field in category["fields"]
    }
    assert keys_in_metadata == set(settings_store.SETTINGS.keys())
