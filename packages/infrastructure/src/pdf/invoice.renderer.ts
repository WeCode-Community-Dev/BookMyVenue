// Invoice PDF renderer (pdf-lib — Worker-safe, no native deps).

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { InvoicePdfInput, InvoicePdfRenderer } from "@repo/contracts";

function formatMoney(cents: number, currency: string): string {
  const major = (cents / 100).toFixed(2);
  return `${currency} ${major}`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toUTCString().replace(" GMT", " UTC");
}

export function makePdfLibInvoiceRenderer(): InvoicePdfRenderer {
  return {
    async render(input: InvoicePdfInput): Promise<Uint8Array> {
      const doc = await PDFDocument.create();
      const page = doc.addPage([595.28, 841.89]); // A4 portrait
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);

      const margin = 50;
      const { width, height } = page.getSize();
      let y = height - margin;

      const draw = (
        text: string,
        x: number,
        yy: number,
        opts: { size?: number; bold?: boolean; color?: [number, number, number] } = {},
      ) => {
        page.drawText(text, {
          x,
          y: yy,
          size: opts.size ?? 10,
          font: opts.bold ? bold : font,
          color: rgb(opts.color?.[0] ?? 0.1, opts.color?.[1] ?? 0.1, opts.color?.[2] ?? 0.12),
        });
      };

      // Header
      draw(input.brand_name, margin, y, { size: 20, bold: true });
      draw("INVOICE", width - margin - 80, y, { size: 20, bold: true, color: [0.4, 0.4, 0.45] });
      y -= 28;
      draw(input.invoice_number, width - margin - 80, y, { size: 11, bold: true });
      y -= 14;
      draw(`Issued ${formatDateTime(input.issued_at)}`, width - margin - 160, y, {
        size: 9,
        color: [0.45, 0.45, 0.5],
      });

      // Divider
      y -= 18;
      page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 0.6,
        color: rgb(0.85, 0.85, 0.88),
      });
      y -= 24;

      // Bill to
      draw("BILL TO", margin, y, { size: 8, bold: true, color: [0.45, 0.45, 0.5] });
      draw("BOOKING", width / 2, y, { size: 8, bold: true, color: [0.45, 0.45, 0.5] });
      y -= 14;
      draw(input.customer.name || "Guest", margin, y, { bold: true });
      draw(`#${input.booking.id.slice(0, 8).toUpperCase()}`, width / 2, y, { bold: true });
      y -= 12;
      if (input.customer.email) draw(input.customer.email, margin, y, { color: [0.4, 0.4, 0.5] });
      draw(input.venue.name, width / 2, y);
      y -= 12;
      draw(input.venue.address, width / 2, y, { color: [0.4, 0.4, 0.5] });
      y -= 14;
      draw(`From: ${formatDateTime(input.booking.start_time)}`, width / 2, y, {
        size: 9,
        color: [0.4, 0.4, 0.5],
      });
      y -= 12;
      draw(`To:   ${formatDateTime(input.booking.end_time)}`, width / 2, y, {
        size: 9,
        color: [0.4, 0.4, 0.5],
      });
      if (input.booking.guest_count) {
        y -= 12;
        draw(`Guests: ${input.booking.guest_count}`, width / 2, y, {
          size: 9,
          color: [0.4, 0.4, 0.5],
        });
      }

      // Line items table
      y -= 30;
      page.drawRectangle({
        x: margin,
        y: y - 4,
        width: width - margin * 2,
        height: 20,
        color: rgb(0.96, 0.96, 0.97),
      });
      draw("DESCRIPTION", margin + 8, y + 2, { size: 8, bold: true, color: [0.4, 0.4, 0.5] });
      draw("AMOUNT", width - margin - 80, y + 2, { size: 8, bold: true, color: [0.4, 0.4, 0.5] });
      y -= 18;

      for (const li of input.line_items) {
        draw(li.description, margin + 8, y);
        draw(formatMoney(li.amount_cents, input.currency), width - margin - 80, y);
        y -= 16;
      }

      // Totals
      y -= 6;
      page.drawLine({
        start: { x: width / 2, y },
        end: { x: width - margin, y },
        thickness: 0.4,
        color: rgb(0.85, 0.85, 0.88),
      });
      y -= 14;
      draw("Subtotal", width / 2, y, { color: [0.4, 0.4, 0.5] });
      draw(formatMoney(input.subtotal_cents, input.currency), width - margin - 80, y);
      if (input.discount_cents > 0) {
        y -= 14;
        draw("Discount", width / 2, y, { color: [0.4, 0.4, 0.5] });
        draw(`-${formatMoney(input.discount_cents, input.currency)}`, width - margin - 80, y);
      }
      y -= 16;
      draw("TOTAL", width / 2, y, { size: 11, bold: true });
      draw(formatMoney(input.total_cents, input.currency), width - margin - 80, y, {
        size: 11,
        bold: true,
      });

      // Payment block
      y -= 30;
      page.drawRectangle({
        x: margin,
        y: y - 36,
        width: width - margin * 2,
        height: 50,
        color: rgb(0.96, 0.97, 0.96),
      });
      draw("PAYMENT", margin + 12, y, { size: 8, bold: true, color: [0.3, 0.5, 0.35] });
      y -= 14;
      draw(`Status: ${input.payment.status}`, margin + 12, y);
      draw(
        `Paid: ${formatMoney(input.payment.amount_paid_cents, input.currency)}`,
        width - margin - 160,
        y,
      );
      y -= 12;
      if (input.payment.method) draw(`Method: ${input.payment.method}`, margin + 12, y);

      // Footer
      draw(`Questions? Contact ${input.support_email}`, margin, margin, {
        size: 8,
        color: [0.5, 0.5, 0.55],
      });

      return doc.save();
    },
  };
}
