import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  getPasswordResetTemplate,
  getAdminPasswordResetTemplate,
  getBookingConfirmationTemplate,
  getVenueRejectedTemplate,
  getVenueSuspendedTemplate,
  getUserBannedTemplate,
  getReviewRemovedTemplate,
} from '../../src/services/emailTemplateFactory';

describe('escapeHtml', () => {
  it('escapes HTML metacharacters', () => {
    expect(escapeHtml(`<b>"x"</b> & 'y'`)).toBe('&lt;b&gt;&quot;x&quot;&lt;/b&gt; &amp; &#39;y&#39;');
  });
});

describe('template escaping of user input', () => {
  const html = '<script>alert(1)</script>';
  const escaped = '&lt;script&gt;alert(1)&lt;/script&gt;';

  it('escapes venueName in the suspended template', () => {
    const out = getVenueSuspendedTemplate(html, 'reason');
    expect(out).toContain(escaped);
    expect(out).not.toContain('<script>');
  });

  it('escapes reason in the rejected template', () => {
    const out = getVenueRejectedTemplate('Venue', html, new Date(Date.now() + 86400000), 1);
    expect(out).toContain(escaped);
    expect(out).not.toContain('<script>');
  });

  it('escapes username in the admin password reset template', () => {
    const out = getAdminPasswordResetTemplate('P@ssw0rd!', html);
    expect(out).toContain(escaped);
    expect(out).not.toContain('<script>');
  });

  it('escapes venueName in the booking confirmation template', () => {
    const out = getBookingConfirmationTemplate({
      venueName: html,
      date: '2026-09-01',
      startTime: '10:00',
      endTime: '12:00',
      amount: 5000,
      paymentReference: 'pay_1',
    });
    expect(out).toContain(escaped);
    expect(out).not.toContain('<script>');
  });

  it('escapes venueName embedded in ban scope description', () => {
    const out = getUserBannedTemplate('commenting', 'spam', null, html);
    expect(out).toContain(escaped);
    expect(out).not.toContain('<script>');
  });

  it('escapes venueName and reason in the review removed template', () => {
    const out = getReviewRemovedTemplate(html, html);
    expect(out).toContain(escaped);
    expect(out).not.toContain('<script>');
  });

  it('escapes resetLink and recipient in the password reset template', () => {
    const out = getPasswordResetTemplate(`https://x.com/?a=${html}`, html);
    expect(out).toContain(escaped);
    expect(out).not.toContain('<script>');
  });

  it('leaves plain text unchanged', () => {
    const out = getVenueSuspendedTemplate('Grand Hall', 'Policy violation');
    expect(out).toContain('Grand Hall');
    expect(out).toContain('Policy violation');
  });
});
