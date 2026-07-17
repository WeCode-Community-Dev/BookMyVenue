import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authEndpoints, createClient } from '@venue404/api-client'
import { useAuth } from '../lib/AuthContext'
import { AuthLayout, AuthCard, Logo } from '@venue404/ui'
import { OwnerFlowPanel } from '../components/OwnerFlowPanel'

export default function Login() {
  const { user, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) navigate('/login/success', { replace: true })
  }, [user, loading, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setUnconfirmedEmail(null)
    setResendState('idle')
    setSubmitting(true)
    try {
      await signIn({ email, password })
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err && err.code === 'email_not_confirmed') {
        setUnconfirmedEmail(email)
      } else {
        setError(err instanceof Error ? err.message : 'Sign in failed. Check your credentials.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResend() {
    if (!unconfirmedEmail || resendState === 'sending') return
    setResendState('sending')
    try {
      await authEndpoints(createClient()).sendConfirmation(
        unconfirmedEmail,
        `${window.location.origin}/login`,
      )
      setResendState('sent')
    } catch {
      setResendState('idle')
    }
  }

  if (loading) return null

  return (
    <AuthLayout
      left={
        <AuthCard
          title="Welcome back"
          subtitle="Sign in to manage your venues and bookings."
          footer={
            <>
              New here?{' '}
              <Link to="/register" className="font-medium text-brand hover:text-brand-hover">
                Register as a venue owner
              </Link>
            </>
          }
        >
          <div className="mb-7">
            <Logo />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); setUnconfirmedEmail(null) }}
                placeholder="you@example.com"
                disabled={submitting}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-brand hover:text-brand-hover">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                disabled={submitting}
              />
            </div>

            {unconfirmedEmail && (
              <div
                role="alert"
                className="space-y-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800"
              >
                <div className="flex items-start gap-2.5">
                  <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>
                    Confirm your email to sign in. We sent a link to <strong>{unconfirmedEmail}</strong>.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendState === 'sending' || resendState === 'sent'}
                  className="font-medium text-amber-900 underline underline-offset-2 hover:text-amber-950 disabled:cursor-not-allowed disabled:no-underline disabled:opacity-70"
                >
                  {resendState === 'sent'
                    ? 'Confirmation email sent'
                    : resendState === 'sending'
                      ? 'Sending…'
                      : 'Resend confirmation email'}
                </button>
              </div>
            )}

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
              disabled={submitting || !email || !password}
              className="press flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition-[background-color,box-shadow] duration-150 hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-5 flex items-start gap-2 rounded-lg bg-zinc-50 dark:bg-ink-800 px-3.5 py-2.5">
            <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-zinc-400 dark:text-zinc-400">
              Your account must be approved before you can access the portal.
            </p>
          </div>
        </AuthCard>
      }
      right={<OwnerFlowPanel />}
    />
  )
}
