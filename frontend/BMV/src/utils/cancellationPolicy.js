export function parsePolicyDays(value) {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function validateCancellationPolicyFields(refund50, refund25, cutoff) {
  const values = [refund50, refund25, cutoff];
  const anySet = values.some((v) => v !== null);
  const allSet = values.every((v) => v !== null);

  if (!anySet) return null;
  if (!allSet) {
    return "Fill all three cancellation policy fields or leave all empty";
  }
  if (values.some((v) => v < 1)) {
    return "Each policy value must be at least 1 day";
  }
  if (!(refund50 > refund25 && refund25 > cutoff)) {
    return "Order required: full-refund days > 50% days > last-cancel days";
  }
  return null;
}

export function policyPayloadFromFields(refund50Days, refund25Days, cancelCutoffDays) {
  const refund_50_days_before = parsePolicyDays(refund50Days);
  const refund_25_days_before = parsePolicyDays(refund25Days);
  const cancel_cutoff_days_before = parsePolicyDays(cancelCutoffDays);
  return {
    refund_50_days_before,
    refund_25_days_before,
    cancel_cutoff_days_before,
  };
}

export function formatPolicyDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function venueHasCancellationPolicy(venue) {
  return (
    venue?.refund_50_days_before != null &&
    venue?.refund_25_days_before != null &&
    venue?.cancel_cutoff_days_before != null
  );
}
