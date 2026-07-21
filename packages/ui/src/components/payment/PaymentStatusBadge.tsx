import { StatusBadge } from '../dashboard/StatusBadge'

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'pending'

// Maps booking + payment statuses to a label and badge variant.
const MAP: Record<string, { label: string; variant: Variant }> = {
  // payment attempt / booking payment_status
  unpaid: { label: 'Unpaid', variant: 'neutral' },
  pending: { label: 'Pending', variant: 'pending' },
  succeeded: { label: 'Paid', variant: 'success' },
  paid: { label: 'Paid', variant: 'success' },
  fully_paid: { label: 'Fully Paid', variant: 'success' },
  advance_paid: { label: 'Advance Paid', variant: 'success' },
  failed: { label: 'Failed', variant: 'danger' },
  refunded: { label: 'Refunded', variant: 'info' },
  partially_refunded: { label: 'Partially Refunded', variant: 'info' },
  // booking status
  requested: { label: 'Requested', variant: 'neutral' },
  accepted: { label: 'Accepted', variant: 'pending' },
  hold_expired: { label: 'Hold expired', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'success' },
  conflict_canceled: { label: 'Conflict canceled', variant: 'danger' },
  canceled: { label: 'Canceled', variant: 'danger' },
  completed: { label: 'Completed', variant: 'success' },
  request_expired: { label: 'Expired', variant: 'neutral' },
}

export function PaymentStatusBadge({ status, className }: { status: string; className?: string }) {
  const m = MAP[status] ?? { label: status, variant: 'neutral' as Variant }
  return <StatusBadge label={m.label} variant={m.variant} className={className} />
}
