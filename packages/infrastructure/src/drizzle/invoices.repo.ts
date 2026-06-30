// Drizzle implementation of InvoicesRepo & ProfilesRepo

import { eq, and } from "drizzle-orm";
import type { Invoice } from "@repo/domain/invoices";
import type { InvoicesRepo, ProfileContact, ProfilesRepo } from "@repo/contracts";
import { invoices, profiles } from "./schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapInvoice(row: any): Invoice {
  return {
    id: row.id,
    booking_id: row.bookingId,
    invoice_number: row.invoiceNumber,
    pdf_path: row.pdfPath,
    amount_cents: row.amountCents,
    currency: row.currency,
    issued_at: row.issuedAt,
    sent_at: row.sentAt ?? null,
    recipient_email: row.recipientEmail ?? null,
  };
}

export function makeInvoicesRepo(deps: { adminDb: any }): InvoicesRepo {
  const { adminDb } = deps;
  return {
    async findByBookingId(bookingId) {
      const rows = await adminDb
        .select()
        .from(invoices)
        .where(eq(invoices.bookingId, bookingId))
        .limit(1);
      return rows[0] ? mapInvoice(rows[0]) : null;
    },

    async create(input) {
      const id = crypto.randomUUID();
      const insertData = {
        id,
        bookingId: input.booking_id,
        invoiceNumber: input.invoice_number,
        pdfPath: input.pdf_path,
        amountCents: input.amount_cents,
        currency: input.currency,
        issuedAt: input.issued_at || new Date().toISOString(),
        sentAt: input.sent_at,
        recipientEmail: input.recipient_email,
      };

      await adminDb.insert(invoices).values(insertData);

      const rows = await adminDb.select().from(invoices).where(eq(invoices.id, id)).limit(1);
      return mapInvoice(rows[0]);
    },

    async markSent(id, sentAt, recipientEmail) {
      await adminDb
        .update(invoices)
        .set({
          sentAt,
          recipientEmail,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(invoices.id, id));
    },
  };
}

export function makeProfilesRepo(deps: { adminDb: any }): ProfilesRepo {
  const { adminDb } = deps;
  return {
    async findById(userId) {
      const rows = await adminDb
        .select({
          id: profiles.id,
          email: profiles.email,
          firstName: profiles.firstName,
          lastName: profiles.lastName,
        })
        .from(profiles)
        .where(eq(profiles.id, userId))
        .limit(1);

      if (!rows[0]) return null;
      return {
        id: rows[0].id,
        email: rows[0].email,
        first_name: rows[0].firstName ?? null,
        last_name: rows[0].lastName ?? null,
      };
    },
  };
}
