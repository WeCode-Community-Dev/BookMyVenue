// Presentation/server adapter — Venues
// Thin createServerFn wrappers. All wiring lives in the services factory;
// these adapters only parse input and call the relevant use-case.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAuth } from "@/lib/auth-middleware";
import { VenueInputSchema, VenueListFilterSchema } from "@repo/application/venues";
import { buildServices } from "@/infrastructure/services";

// Public reads (no auth)
export const listVenues = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => VenueListFilterSchema.parse(input ?? {}))
  .handler(({ data }) => buildServices().listVenues(data));

export const getVenue = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(({ data }) => buildServices().getVenue(data.id));

// Host operations (authenticated)
export const becomeHost = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    await buildServices({ db: context.db, userId: context.userId }).becomeHost();
    return { ok: true };
  });

export const createVenue = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => VenueInputSchema.parse(input))
  .handler(({ data, context }) =>
    buildServices({ db: context.db, userId: context.userId }).createVenue(
      data,
      context.userId,
    ),
  );

export const updateVenue = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).merge(VenueInputSchema.partial()).parse(input),
  )
  .handler(({ data, context }) => {
    const { id, ...patch } = data;
    return buildServices({ db: context.db, userId: context.userId }).updateVenue(
      id,
      patch,
    );
  });

export const listHostVenues = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(({ context }) =>
    buildServices({ db: context.db, userId: context.userId }).listHostVenues(
      context.userId,
    ),
  );

export const deleteVenue = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await buildServices({ db: context.db, userId: context.userId }).deleteVenue(
      data.id,
    );
    return { ok: true as const };
  });
