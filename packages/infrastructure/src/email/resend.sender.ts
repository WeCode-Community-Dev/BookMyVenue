// Resend email adapter — calls Resend API directly.
// Supports file attachments (Resend native feature).

import type { EmailMessage, EmailSender } from "@repo/contracts";

export interface ResendEmailSenderConfig {
  /** Default From address. Example: "Book My Venue <bookings@yourdomain.com>". */
  defaultFrom: string;
}

export function makeResendEmailSender(config: ResendEmailSenderConfig): EmailSender {
  const base = "https://api.resend.com";

  return {
    async send(message: EmailMessage) {
      const resendKey = process.env.RESEND_API_KEY;
      if (!resendKey) throw new Error("RESEND_API_KEY is not configured");

      const body = {
        from: message.from ?? config.defaultFrom,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        reply_to: message.replyTo,
        attachments: message.attachments?.map((a) => ({
          filename: a.filename,
          content: a.content,
          content_type: a.contentType,
        })),
      };

      const res = await fetch(`${base}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Resend send failed [${res.status}]: ${text}`);
      }
      const data = (await res.json()) as { id?: string };
      return { id: data.id };
    },
  };
}
