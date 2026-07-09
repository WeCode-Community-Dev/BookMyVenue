// Telegram bot webhook — venue search.
// Users send a text message (e.g. "wedding kochi") and the bot replies with
// matching venues from the public catalogue. Also handles /start and /help.

import { createFileRoute } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "crypto";
import { buildServices } from "@/infrastructure/services";
import type { VenueType } from "@repo/domain/venues";
import { pricingUnitLabel, type PricingMode } from "@repo/domain/venues";

const VENUE_TYPES: ReadonlySet<VenueType> = new Set([
  "wedding",
  "conference",
  "party",
  "celebration",
  "other",
]);

function deriveWebhookSecret(apiKey: string): string {
  return createHash("sha256").update(`telegram-webhook:${apiKey}`).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

async function sendMessage(chatId: number, text: string) {
  const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;
  if (!TELEGRAM_API_KEY) {
    throw new Error("TELEGRAM_API_KEY is not configured");
  }
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_API_KEY}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    console.error("Telegram sendMessage failed", res.status, await res.text());
  }
}

function formatMoney(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(0)} ${currency}`;
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Parse "wedding in kochi for 200" → { type, city, capacity, search }
function parseQuery(text: string): {
  search?: string;
  venue_type?: VenueType;
  city?: string;
  min_capacity?: number;
} {
  const lower = text.toLowerCase();
  const tokens = lower.split(/\s+/);

  let venue_type: VenueType | undefined;
  for (const t of tokens) {
    if (VENUE_TYPES.has(t as VenueType)) {
      venue_type = t as VenueType;
      break;
    }
  }

  // "in <city>" or "at <city>"
  let city: string | undefined;
  const cityMatch = lower.match(
    /\b(?:in|at|near)\s+([a-zA-Z][a-zA-Z\s]{1,40}?)(?:\s+(?:for|with|under|over)\b|$)/,
  );
  if (cityMatch) city = cityMatch[1].trim();

  // "for 200" / "200 guests" / "200 people"
  let min_capacity: number | undefined;
  const capMatch = lower.match(/(\d{2,5})\s*(?:guests?|people|pax)?/);
  if (capMatch) {
    const n = parseInt(capMatch[1], 10);
    if (n > 0 && n < 100000) min_capacity = n;
  }

  // Free-text search: strip known tokens.
  const cleaned = lower
    .replace(/\b(in|at|near|for|with|under|over|guests?|people|pax)\b/g, " ")
    .replace(/\d+/g, " ")
    .replace(venue_type ?? "", " ")
    .replace(city ?? "", " ")
    .trim();
  const search = cleaned.length >= 3 ? cleaned : undefined;

  return { search, venue_type, city, min_capacity };
}

async function handleMessage(chatId: number, text: string, appBase: string) {
  const trimmed = text.trim();

  if (trimmed === "/start") {
    await sendMessage(
      chatId,
      [
        "👋 <b>Book My Venue</b> bot",
        "",
        "Tell me what you're looking for and I'll find matching venues.",
        "",
        "Examples:",
        "• <code>wedding in Kochi</code>",
        "• <code>conference for 200</code>",
        "• <code>party</code>",
        "",
        "Type /help for more options.",
      ].join("\n"),
    );
    return;
  }

  if (trimmed === "/help" || trimmed === "/?") {
    await sendMessage(
      chatId,
      [
        "<b>How to search</b>",
        "Just send a message. You can combine:",
        "• Type: <i>wedding, conference, party, celebration, other</i>",
        "• City: <i>in &lt;city&gt;</i> (e.g. <code>in Mumbai</code>)",
        "• Capacity: <i>for &lt;N&gt;</i> (e.g. <code>for 150</code>)",
        "",
        "<b>Examples</b>",
        "<code>wedding in Goa for 300</code>",
        "<code>conference for 50</code>",
      ].join("\n"),
    );
    return;
  }

  const filter = parseQuery(trimmed);
  try {
    const venues = await buildServices().listVenues(filter);

    if (!venues.length) {
      await sendMessage(
        chatId,
        "No venues matched. Try a broader query — e.g. <code>wedding</code> or <code>in Mumbai</code>.",
      );
      return;
    }

    const top = venues.slice(0, 5);
    const lines: string[] = [];
    lines.push(`<b>Found ${venues.length} venue${venues.length === 1 ? "" : "s"}</b>`);
    if (venues.length > top.length) lines.push(`<i>Showing top ${top.length}</i>`);
    lines.push("");

    for (const v of top) {
      const addr = v.address_data as { city?: string } | null;
      const city = addr?.city ? ` · ${escapeHtml(addr.city)}` : "";
      const price = formatMoney(v.base_price_cents, v.currency);
      const unit = pricingUnitLabel((v.pricing_mode ?? "per_hour") as PricingMode);
      const url = `${appBase}/venues/${v.id}`;
      lines.push(`🏛 <a href="${url}"><b>${escapeHtml(v.name)}</b></a>`);
      lines.push(`   ${escapeHtml(v.venue_type)} · up to ${v.capacity} guests${city}`);
      lines.push(`   From ${price} ${unit}`);
      lines.push("");
    }

    lines.push(`Browse all → ${appBase}/venues`);
    await sendMessage(chatId, lines.join("\n"));
  } catch (err) {
    console.error("venue search failed", err);
    await sendMessage(chatId, "Something went wrong searching venues. Please try again.");
  }
}

export const Route = createFileRoute("/api/public/telegram/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;
        if (!TELEGRAM_API_KEY) {
          return new Response("Not configured", { status: 500 });
        }

        const expected = deriveWebhookSecret(TELEGRAM_API_KEY);
        const provided = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
        if (!safeEqual(provided, expected)) {
          return new Response("Unauthorized", { status: 401 });
        }

        let update: { update_id?: number; message?: { chat?: { id?: number }; text?: string } };
        try {
          update = await request.json();
        } catch {
          return Response.json({ ok: true, ignored: true });
        }

        const chatId = update.message?.chat?.id;
        const text = update.message?.text;
        if (typeof chatId !== "number" || !text) {
          return Response.json({ ok: true, ignored: true });
        }

        // Respond async; Telegram only needs a quick 200.
        const origin = new URL(request.url).origin;
        try {
          await handleMessage(chatId, text, origin);
        } catch (err) {
          console.error("handleMessage error", err);
        }

        return Response.json({ ok: true });
      },
    },
  },
});
