#!/usr/bin/env python3
"""
API workflow smoke test for BookMyVenue.

Run against a live server:
    cd backend && python scripts/smoke_test_api.py

Environment:
    BMV_API_URL  Base URL (default: http://localhost:8000)
"""

from __future__ import annotations

import json
import os
import sys
import time
import uuid
from datetime import date, timedelta
from typing import Any

import requests

BASE_URL = os.environ.get("BMV_API_URL", "http://localhost:8000").rstrip("/")

OWNER_EMAIL = "owner@test.com"
OWNER_PASSWORD = "password123"
ADMIN_EMAIL = "admin@bookmyvenue.com"
ADMIN_PASSWORD = "admin123456"

RUN_ID = int(time.time())
CUSTOMER_EMAIL = f"smoke+{RUN_ID}@example.com"
CUSTOMER_PASSWORD = "password12345"

passed = 0
failed = 0
errors: list[str] = []


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def check(name: str, ok: bool, detail: str = "") -> bool:
    global passed, failed
    if ok:
        passed += 1
        print(f"  PASS  {name}")
        return True
    failed += 1
    msg = f"  FAIL  {name}"
    if detail:
        msg += f"\n        {detail}"
    print(msg)
    errors.append(f"{name}: {detail}")
    return False


def login(email: str, password: str) -> str | None:
    r = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": email, "password": password},
        timeout=30,
    )
    if r.status_code != 200:
        return None
    return r.json().get("access_token")


def snippet(response: requests.Response, limit: int = 200) -> str:
    try:
        text = json.dumps(response.json())
    except Exception:
        text = response.text
    return text[:limit]


def main() -> int:
    print(f"\nBookMyVenue API Smoke Test")
    print(f"Target: {BASE_URL}\n")

    state: dict[str, Any] = {}
    booking_date = (date.today() + timedelta(days=30)).isoformat()
    time_hour = 10 + (RUN_ID % 8)
    time_slot = f"{time_hour:02d}:30:00"

    # --- A. Health ---
    print("A. Health")
    r = requests.get(f"{BASE_URL}/health", timeout=10)
    check("GET /health", r.status_code == 200, f"status={r.status_code}")

    r = requests.get(f"{BASE_URL}/", timeout=10)
    check("GET /", r.status_code == 200, f"status={r.status_code}")

    # --- B. Reference data ---
    print("\nB. Reference data")
    r = requests.get(f"{BASE_URL}/amenities/", timeout=10)
    amenities_ok = r.status_code == 200 and isinstance(r.json(), list)
    check("GET /amenities/", amenities_ok, snippet(r))

    r = requests.get(f"{BASE_URL}/venue-types/", timeout=10)
    venue_types_ok = r.status_code == 200 and isinstance(r.json(), list) and len(r.json()) > 0
    check("GET /venue-types/", venue_types_ok, snippet(r))
    if venue_types_ok:
        state["venue_type_id"] = r.json()[0]["id"]

    r = requests.get(f"{BASE_URL}/venues/", timeout=10)
    venues_ok = r.status_code == 200 and isinstance(r.json(), list) and len(r.json()) > 0
    check("GET /venues/", venues_ok, snippet(r))

    if venues_ok:
        state["public_venue_id"] = r.json()[0]["id"]
        vid = state["public_venue_id"]
        r = requests.get(f"{BASE_URL}/venues/{vid}", timeout=10)
        check(f"GET /venues/{vid}", r.status_code == 200, snippet(r))

        r = requests.get(
            f"{BASE_URL}/venues/{vid}/availability",
            params={"booking_date": booking_date, "time_slot": time_slot},
            timeout=10,
        )
        avail_ok = r.status_code == 200 and r.json().get("available") is True
        check(f"GET /venues/{vid}/availability", avail_ok, snippet(r))

    # --- Owner prep (profile + approved venue for booking) ---
    print("\nD-pre. Venue owner setup")
    owner_token = login(OWNER_EMAIL, OWNER_PASSWORD)
    check("POST /auth/login (owner)", owner_token is not None, "Could not login owner@test.com")

    if owner_token:
        r = requests.get(
            f"{BASE_URL}/venues/my-venues",
            headers=auth_headers(owner_token),
            timeout=10,
        )
        if r.status_code == 403:
            r = requests.post(
                f"{BASE_URL}/venue-owners/profile",
                headers=auth_headers(owner_token),
                json={
                    "business_name": "Smoke Test Venues",
                    "business_address": "123 Test Street, Mumbai",
                },
                timeout=10,
            )
            check("POST /venue-owners/profile", r.status_code == 200, snippet(r))

        r = requests.get(
            f"{BASE_URL}/venues/my-venues",
            headers=auth_headers(owner_token),
            timeout=10,
        )
        my_venues_ok = r.status_code == 200 and isinstance(r.json(), list)
        check("GET /venues/my-venues", my_venues_ok, snippet(r))

        if my_venues_ok:
            approved = [v for v in r.json() if v.get("approval_status") == "approved"]
            if approved:
                state["booking_venue_id"] = approved[0]["id"]
            elif state.get("public_venue_id"):
                state["booking_venue_id"] = state["public_venue_id"]

        state["owner_token"] = owner_token

    # --- C. Customer workflow ---
    print("\nC. Customer workflow")
    r = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "name": "Smoke Test User",
            "email": CUSTOMER_EMAIL,
            "phone_number": "9876501234",
            "password": CUSTOMER_PASSWORD,
        },
        timeout=10,
    )
    reg_ok = r.status_code in (200, 201) and r.json().get("role") == "user"
    check("POST /auth/register", reg_ok, snippet(r))

    customer_token = login(CUSTOMER_EMAIL, CUSTOMER_PASSWORD)
    check("POST /auth/login (customer)", customer_token is not None, snippet(r))

    if customer_token:
        r = requests.get(
            f"{BASE_URL}/auth/me",
            headers=auth_headers(customer_token),
            timeout=10,
        )
        check("GET /auth/me", r.status_code == 200, snippet(r))
        state["customer_token"] = customer_token

    venue_id = state.get("booking_venue_id")
    if customer_token and venue_id:
        booking_idempotency_key = f"smoke-{RUN_ID}-{uuid.uuid4()}"
        booking_headers = {
            **auth_headers(customer_token),
            "Idempotency-Key": booking_idempotency_key,
        }
        booking_body = {
            "venue_id": venue_id,
            "booking_date": booking_date,
            "time_slot": time_slot,
            "notes": "Smoke test booking",
        }
        r = requests.post(
            f"{BASE_URL}/bookings",
            headers=booking_headers,
            json=booking_body,
            timeout=10,
        )
        booking_ok = r.status_code == 201
        check("POST /bookings", booking_ok, snippet(r))
        if booking_ok:
            state["booking_id"] = r.json()["id"]

        r = requests.post(
            f"{BASE_URL}/bookings",
            headers=booking_headers,
            json=booking_body,
            timeout=10,
        )
        replay_ok = r.status_code == 200 and r.json().get("id") == state.get("booking_id")
        check("POST /bookings (idempotent replay)", replay_ok, snippet(r))

    if customer_token and state.get("booking_id"):
        r = requests.get(
            f"{BASE_URL}/bookings/my-bookings",
            headers=auth_headers(customer_token),
            timeout=10,
        )
        my_ok = (
            r.status_code == 200
            and isinstance(r.json().get("items"), list)
            and len(r.json()["items"]) > 0
        )
        check("GET /bookings/my-bookings", my_ok, snippet(r))

        bid = state["booking_id"]
        r = requests.get(
            f"{BASE_URL}/bookings/{bid}",
            headers=auth_headers(customer_token),
            timeout=10,
        )
        check(f"GET /bookings/{bid}", r.status_code == 200, snippet(r))

        r = requests.post(
            f"{BASE_URL}/payments/initiate",
            headers=auth_headers(customer_token),
            json={"booking_id": bid},
            timeout=10,
        )
        pay_ok = r.status_code == 200 and "payment_id" in r.json()
        check("POST /payments/initiate", pay_ok, snippet(r))
        if pay_ok:
            state["payment_id"] = r.json()["payment_id"]

    if customer_token and state.get("payment_id"):
        pid = state["payment_id"]
        r = requests.post(
            f"{BASE_URL}/payments/confirm",
            headers=auth_headers(customer_token),
            json={"payment_id": pid, "success": True},
            timeout=10,
        )
        confirm_ok = r.status_code == 200 and r.json().get("status") == "paid"
        check("POST /payments/confirm", confirm_ok, snippet(r))

        r = requests.get(
            f"{BASE_URL}/payments/{pid}/status",
            headers=auth_headers(customer_token),
            timeout=10,
        )
        check(f"GET /payments/{pid}/status", r.status_code == 200, snippet(r))

    # --- D. Venue owner workflow ---
    print("\nD. Venue owner workflow")
    owner_token = state.get("owner_token")
    if owner_token:
        r = requests.get(
            f"{BASE_URL}/venue-owners/dashboard/summary",
            headers=auth_headers(owner_token),
            timeout=10,
        )
        check("GET /venue-owners/dashboard/summary", r.status_code == 200, snippet(r))

        r = requests.get(
            f"{BASE_URL}/venue-owners/dashboard/bookings/requests",
            headers=auth_headers(owner_token),
            timeout=10,
        )
        check("GET /venue-owners/dashboard/bookings/requests", r.status_code == 200, snippet(r))

        if state.get("booking_id"):
            bid = state["booking_id"]
            r = requests.patch(
                f"{BASE_URL}/venue-owners/dashboard/bookings/{bid}/accept",
                headers=auth_headers(owner_token),
                timeout=10,
            )
            check(f"PATCH /venue-owners/dashboard/bookings/{bid}/accept", r.status_code == 200, snippet(r))

        r = requests.get(
            f"{BASE_URL}/venue-owners/dashboard/bookings/all",
            headers=auth_headers(owner_token),
            timeout=10,
        )
        check("GET /venue-owners/dashboard/bookings/all", r.status_code == 200, snippet(r))

        if state.get("venue_type_id"):
            r = requests.post(
                f"{BASE_URL}/venues/",
                headers=auth_headers(owner_token),
                json={
                    "name": f"Smoke Pending Venue {RUN_ID}",
                    "location": "Chennai, India",
                    "price_per_day": 12000,
                    "venue_type_id": state["venue_type_id"],
                    "description": "Created by smoke test",
                    "capacity": 50,
                },
                timeout=10,
            )
            create_ok = r.status_code == 201 and r.json().get("approval_status") == "pending"
            check("POST /venues/", create_ok, snippet(r))
            if create_ok:
                state["pending_venue_id"] = r.json()["id"]

    # --- E. Superadmin workflow ---
    print("\nE. Superadmin workflow")
    admin_token = login(ADMIN_EMAIL, ADMIN_PASSWORD)
    check("POST /auth/login (admin)", admin_token is not None, "Run scripts/seed_admin.py first")

    if admin_token:
        r = requests.get(
            f"{BASE_URL}/admin/dashboard",
            headers=auth_headers(admin_token),
            timeout=10,
        )
        check("GET /admin/dashboard", r.status_code == 200, snippet(r))

        r = requests.get(
            f"{BASE_URL}/admin/pending-venues",
            headers=auth_headers(admin_token),
            timeout=10,
        )
        check("GET /admin/pending-venues", r.status_code == 200, snippet(r))

        if state.get("pending_venue_id"):
            pvid = state["pending_venue_id"]
            r = requests.patch(
                f"{BASE_URL}/admin/venues/{pvid}/approve",
                headers=auth_headers(admin_token),
                timeout=10,
            )
            check(f"PATCH /admin/venues/{pvid}/approve", r.status_code == 200, snippet(r))

        r = requests.get(
            f"{BASE_URL}/admin/users",
            headers=auth_headers(admin_token),
            timeout=10,
        )
        check("GET /admin/users", r.status_code == 200, snippet(r))

        r = requests.get(
            f"{BASE_URL}/admin/bookings",
            headers=auth_headers(admin_token),
            timeout=10,
        )
        check("GET /admin/bookings", r.status_code == 200, snippet(r))

        r = requests.get(
            f"{BASE_URL}/admin/venues",
            headers=auth_headers(admin_token),
            timeout=10,
        )
        check("GET /admin/venues", r.status_code == 200, snippet(r))

    # --- F. Negative checks ---
    print("\nF. Negative checks")
    r = requests.get(f"{BASE_URL}/admin/dashboard", timeout=10)
    check(
        "GET /admin/dashboard (no token)",
        r.status_code in (401, 403),
        f"status={r.status_code}",
    )

    if owner_token and venue_id:
        r = requests.post(
            f"{BASE_URL}/bookings",
            headers={
                **auth_headers(owner_token),
                "Idempotency-Key": f"smoke-owner-{RUN_ID}",
            },
            json={
                "venue_id": venue_id,
                "booking_date": booking_date,
                "time_slot": f"{(time_hour + 1) % 24:02d}:30:00",
                "notes": "Owner should not book",
            },
            timeout=10,
        )
        check("POST /bookings (owner token)", r.status_code == 403, snippet(r))

    if customer_token and state.get("booking_id"):
        bid = state["booking_id"]
        r = requests.patch(
            f"{BASE_URL}/bookings/{bid}/cancel",
            headers=auth_headers(customer_token),
            json={"cancellation_reason": "Smoke test cleanup"},
            timeout=10,
        )
        check(f"PATCH /bookings/{bid}/cancel", r.status_code == 200, snippet(r))

    # --- Summary ---
    total = passed + failed
    print(f"\n{'=' * 50}")
    print(f"Results: {passed}/{total} passed")
    if errors:
        print("\nFailures:")
        for err in errors:
            print(f"  - {err}")
    print(f"{'=' * 50}\n")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    try:
        sys.exit(main())
    except requests.ConnectionError:
        print(f"\nERROR: Cannot connect to {BASE_URL}")
        print("Start the server: uvicorn app.main:app --reload --port 8000")
        sys.exit(1)
