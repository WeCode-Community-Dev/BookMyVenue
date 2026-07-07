import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resetPasswordForEmail } from '@venue404/api-client'
import { AuthLayout, AuthCard, Logo } from '@venue404/ui'
import { OwnerFlowPanel } from '../components/OwnerFlowPanel'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await resetPasswordForEmail(email, `${window.location.origin}/reset-password`)
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not send reset email. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      left={
        <AuthCard
          title="Reset your password"
          subtitle="Enter your email and we'll send you a link to set a new password."
          footer={
            <>
              Remembered it?{' '}
              <Link to="/login" className="font-medium text-brand hover:text-brand-hover">
                Back to sign in
              </Link>
            </>
          }
        >
          <div className="mb-7">
            <Logo />
          </div>

          {sent ? (
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700"
            >
              <span>
                If an account exists for <span className="font-medium">{email}</span>, a reset link is on its way.
                Check your inbox.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={submitting}
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
                >
                  <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !email}
                className="press flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition-[background-color,box-shadow] duration-150 hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>
          )}
        </AuthCard>
      }
      right={<OwnerFlowPanel />}
    />
  )
}
