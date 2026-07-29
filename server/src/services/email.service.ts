import nodemailer, { Transporter } from 'nodemailer';
import dns from 'node:dns';
import env from '../configs/env.config';

const transporter: Transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  lookup: (hostname: string, options: any, callback: any) => {
    dns.lookup(hostname, { ...options, family: 4 }, callback);
  },
} as any);

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const emailService = {
  async sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
    });
  },
};
