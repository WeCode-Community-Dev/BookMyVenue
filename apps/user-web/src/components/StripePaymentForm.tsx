import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useTheme } from '@venue404/ui'

// Loaded once and reused across mounts.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!)

type Props = {
  clientSecret: string
  /** Amount label shown on the pay button, e.g. "₹5,000". */
  payLabel: string
  onSuccess: () => void
  onCancel: () => void
}

function InnerCheckoutForm({ payLabel, onSuccess, onCancel }: Props) {
  const stripe = useStripe()
  const elements = useElements()

  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError('Payment system not ready')
      return
    }

    setProcessing(true)
    setError(null)

    // `redirect: 'if_required'` keeps the SPA in control so we can route to
    // the result page ourselves and poll for the webhook.
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    setProcessing(false)

    if (stripeError) {
      setError(stripeError.message || 'Payment failed')
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Stripe Payment Element */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {/* Inline error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
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

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="press flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Processing…
            </>
          ) : (
            `Pay ${payLabel}`
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex flex-1 items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 py-3.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-300 dark:hover:bg-ink-800"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export function StripePaymentForm(props: Props) {
  const { resolved } = useTheme()

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: props.clientSecret,
        appearance:
          resolved === 'dark'
            ? {
                theme: 'night',
                variables: {
                  colorPrimary: '#408A71', // brand-secondary
                  colorBackground: '#1b302b', // ink-800 — one step lighter than the ink-900 card it sits in
                  colorText: '#f4f4f5', // zinc-100
                  colorTextSecondary: '#a1a1aa', // zinc-400
                  colorTextPlaceholder: '#71717a', // zinc-500
                  colorDanger: '#f87171', // red-400
                  borderRadius: '8px',
                },
                rules: {
                  '.Input': { border: '1px solid #325146' }, // ink-600, visible against ink-800 fill
                  '.Input:focus': { border: '1px solid #408A71', boxShadow: '0 0 0 1px #408A71' },
                  '.Tab': { border: '1px solid #325146', backgroundColor: '#1b302b' },
                  '.Tab:hover': { backgroundColor: '#253f38' },
                  '.Tab--selected': { border: '1px solid #408A71', backgroundColor: '#152623' },
                },
              }
            : { theme: 'stripe' },
      }}
    >
      <InnerCheckoutForm {...props} />
    </Elements>
  )
}
