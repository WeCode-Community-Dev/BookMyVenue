"""
Venues MCP server (Python).

Exposes a single `get_venues` tool backed by the Lovable app's public
`/api/public/venues` endpoint, and ships an HTML UI widget that ChatGPT
(via the OpenAI Apps SDK) renders alongside the tool result.

Run locally (streamable HTTP transport, the one ChatGPT expects):

    pip install -r requirements.txt
        python server.py

Then register `http://localhost:8000/mcp` as a connector in ChatGPT
(Settings -> Connectors -> Add custom MCP server).
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import httpx
from mcp.server.fastmcp import FastMCP
from mcp.server.transport_security import TransportSecuritySettings
from mcp.types import TextResourceContents

API_BASE = os.environ.get(
    "VENUES_API_BASE",
    "",
).rstrip("/")

WIDGET_URI = "ui://widget/venues-list.html"
WIDGET_HTML = (Path(__file__).parent / "widget.html").read_text(encoding="utf-8")

mcp = FastMCP(
    "venues-mcp",
    transport_security=TransportSecuritySettings(
        enable_dns_rebinding_protection=False,
    ),
)


# ---------- UI widget resource (OpenAI Apps SDK convention) ----------
@mcp.resource(
    WIDGET_URI,
    name="Venues list widget",
    mime_type="text/html+skybridge",
)
def venues_widget() -> str:
    """HTML widget rendered by ChatGPT next to the tool output."""
    return WIDGET_HTML


# ---------- Tool ----------
@mcp.tool(
    name="get_venues",
    description=(
        "List bookable venues. Optionally filter by free-text search, "
        "venue type (wedding | conference | party | celebration | other), "
        "or minimum capacity."
    ),
    meta={
        "ui": {
            "resourceUri": WIDGET_URI,
        },
        "ui/resourceUri": WIDGET_URI,
    },
)
async def get_venues(
    search: str | None = None,
    venue_type: str | None = None,
    min_capacity: int | None = None,
) -> dict[str, Any]:
    params: dict[str, str] = {}
    if search:
        params["search"] = search
    if venue_type:
        params["venue_type"] = venue_type
    if min_capacity is not None:
        params["min_capacity"] = str(min_capacity)

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(f"{API_BASE}/api/public/venues", params=params)
        resp.raise_for_status()
        payload = resp.json()

    venues = payload.get("venues", []) if isinstance(payload, dict) else []
    return {"venues": venues, "count": len(venues)}


if __name__ == "__main__":
    # Streamable HTTP transport, served at /mcp on port 8000.
    mcp.run(transport="streamable-http")
