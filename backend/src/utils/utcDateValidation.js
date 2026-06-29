/**
 * ISO 8601 is an international standard for writing dates/times as strings so
 * every system parses them the same way (unlike 01/07/2026 vs 07/01/2026).
 *
 * Examples:
 *   2026-07-01T10:00:00.000Z        — UTC (Z = zero offset)
 *   2026-07-01T10:00:00.000+00:00  — also UTC, same instant, different syntax
 *   2026-07-01T15:30:00+05:30      — IST (rejected — not UTC)
 *   2026-07-01                       — date-only (rejected — no time)
 *
 * express-validator's .isISO8601() accepts all of the above.
 * requireUtcIsoDatetime() narrows to UTC only: must end with Z or +00:00.
 */
function isUtcIsoSuffix(value) {
  return value.endsWith('Z') || value.endsWith('+00:00');
}

export function requireUtcIsoDatetime(fieldLabel) {
  return (value) => {
    if (typeof value !== 'string') {
      throw new Error(`${fieldLabel} must be an ISO 8601 UTC datetime string`);
    }

    // Must include time — rejects date-only ISO strings like "2026-07-01".
    if (!value.includes('T')) {
      throw new Error(
        `${fieldLabel} must include date and time (e.g. 2026-07-01T10:00:00.000Z), not date-only`,
      );
    }

    // UTC only — accepts Z or +00:00; rejects other offsets like +05:30 (IST).
    if (!isUtcIsoSuffix(value)) {
      throw new Error(
        `${fieldLabel} must be UTC (end with Z or +00:00, e.g. 2026-07-01T10:00:00.000Z)`,
      );
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new Error(`${fieldLabel} must be a valid datetime`);
    }

    return true;
  };
}
