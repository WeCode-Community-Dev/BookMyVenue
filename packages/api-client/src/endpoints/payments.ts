import { createClient } from '../client'

export type PaymentIntent = {
  payment_id: string
  booking_id: string
  client_secret: string | null
  amount_paise: number
  currency: string
  status: string
}

export type CreatePaymentIntentRequest = {
  payment_type?: 'advance' | 'balance' | 'full'
}

export type Payment = {
  id: string
  booking_id: string
  amount_paise: number
  currency: string
  status: string
  stripe_payment_intent_id: string
}

export type RefundResult = {
  booking_id: string
  refunded_paise: number
  status: string
}

export type OwnerLedgerStats = {
  gross_volume_paise: number
  platform_fees_paise: number
  refunds_issued_paise: number
  net_revenue_paise: number
  payouts_completed_paise: number
  available_balance_paise: number
}

export type LedgerEntry = {
  id: string
  booking_id: string
  venue_id: string
  venue_name: string | null
  user_full_name: string | null
  entry_type: string
  amount_paise: number
  direction: string
  stripe_pi_ref: string | null
  created_at: string
}

export const paymentEndpoints = (client: ReturnType<typeof createClient>) => ({
  /** Create a Stripe PaymentIntent for a booking's token advance, balance, or full amount. */
  createPaymentIntent: (bookingId: string, params: CreatePaymentIntentRequest) =>
    client.post<PaymentIntent>('/api/payments/', { booking_id: bookingId, payment_type: params.payment_type || 'advance' }),
  /** Owner/admin full refund of a booking's captured payment. */
  refund: (bookingId: string, reason?: string) =>
    client.post<RefundResult>('/api/payments/refund', { booking_id: bookingId, reason }),
  /** All payment attempts for a booking. */
  getByBooking: (bookingId: string) =>
    client.get<Payment[]>(`/api/payments/${bookingId}`),
  /** Get aggregated financial stats for the owner */
  getOwnerStats: () =>
    client.get<OwnerLedgerStats>('/api/payments/owner/stats'),
  /** Get ledger entries for the owner */
  getOwnerLedger: (entryType?: string) =>
    client.get<LedgerEntry[]>(`/api/payments/owner/ledger${entryType ? `?entry_type=${entryType}` : ''}`),
})
