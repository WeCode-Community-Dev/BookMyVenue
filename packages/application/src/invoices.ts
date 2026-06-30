// Application layer — Invoices use-cases

import { formatInvoiceNumber, invoicePdfPath, type Invoice } from "@repo/domain/invoices";
import { pricingUnitLabel } from "@repo/domain/venues";
import type { BookingWithVenue } from "@repo/contracts";
import type {
  EmailSender,
  InvoicePdfRenderer,
  InvoiceStorage,
  InvoicesRepo,
  ProfilesRepo,
  UserRolesRepo,
} from "@repo/contracts";

export interface InvoiceUseCaseDeps {
  invoices: InvoicesRepo;
  storage: InvoiceStorage;
  renderer: InvoicePdfRenderer;
  email: EmailSender;
  profiles: ProfilesRepo;
  brand: { name: string; supportEmail: string };
}

function formatAddress(a: unknown): string {
  const x = a as { street?: string; city?: string; state?: string; country?: string } | null;
  if (!x) return "";
  return [x.street, x.city, x.state, x.country].filter(Boolean).join(", ");
}

function money(cents: number, currency: string) {
  return `${currency} ${(cents / 100).toFixed(2)}`;
}

/**
 * Generate the invoice PDF, persist metadata, upload to storage, and email
 * it to the customer as an attachment. Best-effort: returns the invoice if
 * created; throws only on hard infrastructure failures so callers can decide
 * whether to surface or swallow the error.
 */
export const generateAndSendInvoiceUseCase =
  (deps: InvoiceUseCaseDeps) =>
  async (args: { booking: BookingWithVenue }): Promise<Invoice> => {
    const { booking } = args;
    const { invoices, storage, renderer, email, profiles, brand } = deps;

    // Idempotent: reuse if already generated.
    const existing = await invoices.findByBookingId(booking.id);
    if (existing) return existing;

    // Resolve recipient
    let recipientEmail = booking.guest_email ?? null;
    let recipientName = booking.guest_name ?? "";
    if (booking.customer_id) {
      const p = await profiles.findById(booking.customer_id);
      if (p) {
        recipientEmail = recipientEmail ?? p.email;
        recipientName =
          recipientName ||
          [p.first_name, p.last_name].filter(Boolean).join(" ") ||
          p.email ||
          "Guest";
      }
    }
    if (!recipientName) recipientName = "Guest";

    const invoiceNumber = formatInvoiceNumber(booking.id);
    const issuedAt = new Date().toISOString();

    // Single line item — venue rental for the booked window.
    const venueName = booking.venues?.name ?? "Venue rental";
    const venueAddress = formatAddress(booking.venues?.address_data);
    const lineItems = [
      {
        description: `${venueName} — ${pricingUnitLabel("per_hour")} rental`,
        amount_cents: booking.subtotal_cents,
      },
    ];

    const pdfBytes = await renderer.render({
      invoice_number: invoiceNumber,
      issued_at: issuedAt,
      brand_name: brand.name,
      support_email: brand.supportEmail,
      customer: { name: recipientName, email: recipientEmail },
      venue: { name: venueName, address: venueAddress },
      booking: {
        id: booking.id,
        start_time: booking.start_time,
        end_time: booking.end_time,
        guest_count: booking.guest_count,
      },
      line_items: lineItems,
      discount_cents: booking.discount_amount_cents,
      subtotal_cents: booking.subtotal_cents,
      total_cents: booking.total_cents,
      currency: booking.currency,
      payment: {
        method: booking.payment_method ?? "online",
        amount_paid_cents: booking.amount_paid_cents || booking.total_cents,
        status: booking.status,
      },
    });

    const path = invoicePdfPath(booking.id, invoiceNumber);
    await storage.upload(path, pdfBytes);

    const invoice = await invoices.create({
      booking_id: booking.id,
      invoice_number: invoiceNumber,
      pdf_path: path,
      amount_cents: booking.total_cents,
      currency: booking.currency,
      issued_at: issuedAt,
      sent_at: null,
      recipient_email: recipientEmail,
    });

    if (!recipientEmail) {
      // Nothing to send to, but invoice is generated and downloadable.
      return invoice;
    }

    // Email with PDF attachment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const base64 = (globalThis as any).Buffer
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).Buffer.from(pdfBytes).toString("base64")
      : btoa(String.fromCharCode(...pdfBytes));

    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1f">
        <h1 style="font-size:20px;margin:0 0 8px">Your booking is confirmed</h1>
        <p style="color:#555;margin:0 0 20px">Thanks ${recipientName.split(" ")[0] || "there"} — here's your invoice <strong>${invoiceNumber}</strong>.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
          <tr><td style="padding:6px 0;color:#666">Venue</td><td style="padding:6px 0;text-align:right"><strong>${venueName}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#666">When</td><td style="padding:6px 0;text-align:right">${new Date(booking.start_time).toUTCString()}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Total paid</td><td style="padding:6px 0;text-align:right"><strong>${money(booking.total_cents, booking.currency)}</strong></td></tr>
        </table>
        <p style="color:#555;font-size:13px;margin:20px 0 0">The PDF invoice is attached. Questions? Reply to this email or write to ${brand.supportEmail}.</p>
        <p style="color:#999;font-size:12px;margin:24px 0 0">${brand.name}</p>
      </div>`;

    try {
      await email.send({
        to: recipientEmail,
        subject: `Your booking is confirmed — Invoice ${invoiceNumber}`,
        html,
        attachments: [
          { filename: `${invoiceNumber}.pdf`, content: base64, contentType: "application/pdf" },
        ],
      });
      await invoices.markSent(invoice.id, new Date().toISOString(), recipientEmail);
    } catch (err) {
      // Don't undo the invoice — sending can be retried later.
      console.error("[invoice] email send failed", err);
    }

    return invoice;
  };

/**
 * Authorised download URL for an invoice PDF.
 * Customers, hosts of the venue, and admins may download.
 */
export const getInvoiceDownloadUrlUseCase =
  (deps: {
    invoices: InvoicesRepo;
    storage: InvoiceStorage;
    bookings: { findWithVenue: (id: string) => Promise<BookingWithVenue | null> };
    roles: UserRolesRepo;
  }) =>
  async (bookingId: string, userId: string): Promise<{ url: string; invoice_number: string }> => {
    const booking = await deps.bookings.findWithVenue(bookingId);
    if (!booking) throw new Error("Booking not found");

    const isCustomer = booking.customer_id === userId;
    const isHost = booking.venues?.host_id === userId;
    const isAdmin = !isCustomer && !isHost ? await deps.roles.isAdmin(userId) : false;
    if (!isCustomer && !isHost && !isAdmin) throw new Error("Not authorised");

    const invoice = await deps.invoices.findByBookingId(bookingId);
    if (!invoice) throw new Error("Invoice not available yet");

    const url = await deps.storage.createSignedDownloadUrl(invoice.pdf_path, 60 * 10);
    return { url, invoice_number: invoice.invoice_number };
  };
