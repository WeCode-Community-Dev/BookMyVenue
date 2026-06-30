// Presentation/server adapter — Invoices

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAuth } from "@/lib/auth-middleware";
import { buildServices } from "@/infrastructure/services";

const InvoiceIdSchema = z.object({ booking_id: z.string().uuid() });

export const getInvoiceDownloadUrl = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => InvoiceIdSchema.parse(input))
  .handler(({ data, context }) =>
    buildServices({ db: context.db, userId: context.userId }).getInvoiceDownloadUrl(
      data.booking_id,
      context.userId,
    ),
  );
