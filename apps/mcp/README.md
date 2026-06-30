# Venues MCP Server

A small Python [MCP](https://modelcontextprotocol.io) server that exposes the
app's venues as a `get_venues` tool, plus an HTML widget that ChatGPT renders
next to the tool result (OpenAI Apps SDK convention).

## What's inside

- `server.py` — FastMCP server with one tool (`get_venues`) and one UI resource.
- `widget.html` — the card-grid widget rendered inside ChatGPT.
- `requirements.txt` — Python deps.

The tool calls the app's public REST endpoint `GET /api/public/venues` (see
`src/routes/api/public/venues.ts`), so no Supabase credentials are needed in
the Python process.

## Run it

```bash
cd apps/mcp
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Point at your deployed Lovable app (or http://localhost:3000 for local dev)
export VENUES_API_BASE="https://project--bf1a39b6-3c54-479a-8f7d-173e73cb3c8f.lovable.app"

python server.py
# -> Streamable HTTP MCP endpoint at http://localhost:8000/mcp
```

## Connect to ChatGPT

1. In ChatGPT: **Settings → Connectors → Add custom connector** (Developer Mode
   must be enabled).
2. URL: `http://localhost:8000/mcp` (or your tunnelled https URL, e.g. ngrok).
3. Start a new chat, enable the connector, and ask "show me available venues".
   ChatGPT will call `get_venues` and render the widget above the JSON.

## Tool

| Name         | Args                                                                                             | Returns                            |
| ------------ | ------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `get_venues` | `search?`, `venue_type?` (`wedding`/`conference`/`party`/`celebration`/`other`), `min_capacity?` | `{ venues: [...], count: number }` |

The widget reads `window.openai.toolOutput.venues` and renders a responsive
card grid (cover image, name, type, location, capacity, price).
