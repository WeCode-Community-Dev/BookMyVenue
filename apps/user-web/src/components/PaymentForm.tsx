import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createClient, paymentEndpoints } from '@venue404/api-client'
import type { BookingOut, PaymentIntentResponse } from '../types'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!)

type Props = {
  booking: BookingOut
  paymentType?: 'advance' | 'balance' | 'full'
  isFullPayment?: boolean
  onSuccess: () => void
  onCancel: () => void
}

function InnerCheckoutForm({
  booking,
  paymentType = 'advance',
  isFullPayment = false,
  onSuccess,
  onCancel,
}: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const queryClient = useQueryClient()

  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const paymentMutation = useMutation({
    mutationFn: () =>
      paymentEndpoints(createClient()).createPaymentIntent(booking.id, {
        payment_type: paymentType,
      }),

    onSuccess: async (data: PaymentIntentResponse) => {
      if (!stripe || !elements || !data.client_secret) {
        setError('Payment system not ready')
        return
      }

      setProcessing(true)
      setError(null)

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.client_secret,
        { payment_method: { card: elements.getElement(CardElement)! } }
      )

      setProcessing(false)

      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
      } else if (paymentIntent?.status === 'succeeded') {
        setSucceeded(true)
        void queryClient.invalidateQueries({ queryKey: ['booking', booking.id] })
        onSuccess()
      }
    },
  })

  const buttonLabel = isFullPayment
    ? `Pay Full Amount · ${booking.display?.quoted_price ?? ''}`
    : paymentType === 'balance'
      ? `Pay Balance · ${booking.display?.balance_due ?? ''}`
      : paymentType === 'full'
        ? `Pay Full Amount · ${booking.display?.quoted_price ?? ''}`
        : `Pay Advance · ${booking.display?.advance_due ?? ''}`

  return (
    <div className="space-y-5 pt-2">
      {/* Card element */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <CardElement
          options={{
            style: { base: { fontSize: '15px', fontFamily: 'Geist Variable, sans-serif' } },
          }}
        />
      </div>

      {/* Inline error */}
      {error && !succeeded && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
        >
          <svg
            className="mt-0.5 h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Success notice */}
      {succeeded && (
        <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Payment successful!
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => paymentMutation.mutate()}
          disabled={!stripe || processing || succeeded}
          className="press flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Processing…
            </>
          ) : succeeded ? (
            'Done'
          ) : (
            buttonLabel
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={processing || succeeded}
          className="flex flex-1 items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 py-3.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export function PaymentForm(props: Props) {
  return (
    <Elements stripe={stripePromise}>
      <InnerCheckoutForm {...props} />
    </Elements>
  )
}
