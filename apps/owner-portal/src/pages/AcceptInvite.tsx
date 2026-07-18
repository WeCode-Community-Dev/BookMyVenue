import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession, updatePassword, onAuthStateChange } from '@venue404/api-client'
import { AuthLayout, AuthCard, Logo, LoadingScreen } from '@venue404/ui'
import { OwnerFlowPanel } from '../components/OwnerFlowPanel'

export default function AcceptInvite() {
  const navigate = useNavigate()
  const [checkingSession, setCheckingSession] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Supabase's client detects the invite token in the URL and establishes a
    // session automatically (detectSessionInUrl); PASSWORD_RECOVERY fires once
    // that happens, but the session may already be there by the time we mount.
    const subscription = onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setHasSession(true)
        setCheckingSession(false)
      }
    })

    getSession().then((session) => {
      setHasSession(!!session)
      setCheckingSession(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      await updatePassword(password)
      navigate('/login/success', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not set your password. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (checkingSession) return <LoadingScreen message="Verifying your invite…" />

  return (
    <AuthLayout
      left={
        <AuthCard
          title="Set your password"
          subtitle="Finish setting up your Venue404 owner account to complete your venue."
        >
          <div className="mb-7">
            <Logo />
          </div>

          {!hasSession ? (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
            >
              <span>
                This invite link is invalid or has expired. Ask the Venue404 admin who invited you to resend it.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="password">New password</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  disabled={submitting}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••"
                  disabled={submitting}
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
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
                disabled={submitting || !password || !confirmPassword}
                className="press flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition-[background-color,box-shadow] duration-150 hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                    Saving…
                  </>
                ) : (
                  'Set password & continue'
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
