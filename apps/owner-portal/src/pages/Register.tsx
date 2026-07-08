import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { createClient, authEndpoints } from '@venue404/api-client'
import { AuthLayout, AuthCard, Logo } from '@venue404/ui'
import { OwnerFlowPanel } from '../components/OwnerFlowPanel'

function isAlreadyRegisteredError(err: unknown): boolean {
  const code = (err as { code?: string })?.code
  if (code === 'user_already_exists') return true
  const message = err instanceof Error ? err.message : ''
  return /already registered|already exists/i.test(message)
}

export default function Register() {
  const { user, loading, signUp, signIn } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) navigate('/login/success', { replace: true })
  }, [user, loading, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const trimmedEmail = email.trim()
    try {
      try {
        await signUp({ email: trimmedEmail, password, fullName: fullName.trim(), phone: phone.trim() || undefined })
      } catch (signUpErr: unknown) {
        if (!isAlreadyRegisteredError(signUpErr)) throw signUpErr
        try {
          await signIn({ email: trimmedEmail, password })
        } catch {
          throw new Error('An account with this email already exists. Sign in to continue, or check your password.')
        }
      }
      await authEndpoints(createClient()).registerOwner()
      navigate('/register/success', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <AuthLayout
      left={
        <AuthCard
          title="Create your owner account"
          subtitle="Register and our team will review your application. You'll get access once approved."
          footer={
            <>
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-brand hover:text-brand-hover">
                Sign in
              </Link>
            </>
          }
        >
          <div className="mb-7">
            <Logo />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="full-name">
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                id="full-name"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="email">
                Email address <span className="text-red-500">*</span>
              </label>
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

            <div>
              <label htmlFor="phone">
                Phone{' '}
                <span className="font-normal text-zinc-400 dark:text-zinc-500">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
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
              disabled={submitting || !fullName || !email || !password}
              className="press flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition-[background-color,box-shadow] duration-150 hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="mt-5 flex items-start gap-2 rounded-lg bg-zinc-50 dark:bg-ink-800 px-3.5 py-2.5">
            <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Applications are reviewed by our team. We'll email you once a decision is made.
            </p>
          </div>
        </AuthCard>
      }
      right={<OwnerFlowPanel />}
    />
  )
}
