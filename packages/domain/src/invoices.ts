// Domain layer — Invoices
// Pure value objects + formatting helpers. No I/O.

export interface Invoice {
  id: string;
  booking_id: string;
  invoice_number: string;
  pdf_path: string;
  amount_cents: number;
  currency: string;
  issued_at: string;
  sent_at: string | null;
  recipient_email: string | null;
}

/** Build a stable, human-readable invoice number from a booking UUID. */
export function formatInvoiceNumber(bookingId: string): string {
  return `INV-${bookingId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

/** Storage path for a booking's invoice PDF. */
export function invoicePdfPath(bookingId: string, invoiceNumber: string): string {
  return `${bookingId}/${invoiceNumber}.pdf`;
}
