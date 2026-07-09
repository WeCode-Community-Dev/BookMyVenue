// Public REST endpoint — list active venues.
// Used by the Python MCP server (and any other public consumer) to fetch
// venues without going through TanStack server-fn RPC.
//
// Caching: backed by the shared `api_cache` table (see api-cache.server.ts)
// so multiple Worker instances share state and explicit invalidations from
// mutations are visible everywhere.

import { createFileRoute } from "@tanstack/react-router";
import { buildServices } from "@/infrastructure/services";
import type { VenueType } from "@repo/domain/venues";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
} as const;

const VENUE_TYPES: ReadonlySet<VenueType> = new Set([
  "wedding",
  "conference",
  "party",
  "celebration",
  "other",
]);

const CACHE_TTL_SECONDS = 60;

export const Route = createFileRoute("/api/public/venues")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS_HEADERS }),
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const id = url.searchParams.get("id") || undefined;
          const svc = buildServices();

          if (id) {
            const venue = await svc.getVenue(id);
            if (!venue) {
              return new Response(JSON.stringify({ error: "Venue not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json", ...CORS_HEADERS },
              });
            }
            return new Response(JSON.stringify({ venue }), {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                ...CORS_HEADERS,
              },
            });
          }

          const search = url.searchParams.get("search")?.slice(0, 200) || undefined;
          const venueTypeRaw = url.searchParams.get("venue_type") || undefined;
          const venue_type =
            venueTypeRaw && VENUE_TYPES.has(venueTypeRaw as VenueType)
              ? (venueTypeRaw as VenueType)
              : undefined;
          const minCapRaw = url.searchParams.get("min_capacity");
          const min_capacity = minCapRaw ? Math.max(0, parseInt(minCapRaw, 10) || 0) : undefined;

          const cacheKey = JSON.stringify({
            search: search ?? "",
            venue_type: venue_type ?? "",
            min_capacity: min_capacity ?? 0,
          });

          const cache = svc.cache;

          const cached = await cache.get("venues", cacheKey);
          if (cached) {
            return new Response(JSON.stringify(cached), {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
                "X-Cache": "HIT",
                ...CORS_HEADERS,
              },
            });
          }

          const venues = await svc.listVenues({
            search,
            venue_type,
            min_capacity,
          });
          const payload = { venues };

          // fire-and-forget; we don't want cache write latency to slow the response
          void cache.set("venues", cacheKey, payload, CACHE_TTL_SECONDS);

          return new Response(JSON.stringify(payload), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
              "X-Cache": "MISS",
              ...CORS_HEADERS,
            },
          });
        } catch (err) {
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
            { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
          );
        }
      },
    },
  },
});
