import { useRef, useState } from 'react'
import { useAuth } from '../../lib/AuthContext'

type Props = {
  onSuccess: () => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AuthModalLoginStep({ onSuccess }: Props) {
  const { signIn } = useAuth()
  const [step, setStep] = useState<'email' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    // Browser autofill can set the DOM value without firing a React onChange
    // (especially on a field that just mounted), leaving state stale — read
    // the live input value as the source of truth, not just React state.
    const currentEmail = emailRef.current?.value ?? email
    if (currentEmail !== email) setEmail(currentEmail)
    if (!EMAIL_RE.test(currentEmail)) {
      setError('Enter a valid email address.')
      return
    }
    setError(null)
    setStep('password')
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const currentEmail = emailRef.current?.value ?? email
      const currentPassword = passwordRef.current?.value ?? password
      await signIn({ email: currentEmail, password: currentPassword })
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={step === 'email' ? handleContinue : handleSignIn} className="space-y-5" noValidate>
      <div>
        <input
          ref={emailRef}
          id="modal-email"
          type="email"
          autoComplete="username"
          required
          autoFocus={step === 'email'}
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(null) }}
          placeholder="Email"
          readOnly={step === 'password'}
          className="py-3"
        />
      </div>

      {step === 'password' && (
        <div>
          <input
            ref={passwordRef}
            id="modal-password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null) }}
            placeholder="Password"
            disabled={submitting}
            className="py-3"
          />
          <div className="mt-3 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => { setStep('email'); setPassword(''); setError(null) }}
              className="font-medium text-zinc-400 hover:text-zinc-600"
            >
              ← Use a different email
            </button>
            <a href="/forgot-password" className="font-medium text-brand hover:text-brand-hover">
              Forgot password?
            </a>
          </div>
        </div>
      )}

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
        disabled={step === 'email' ? !email : submitting || !password}
        className="press flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3.5 text-sm font-semibold text-white shadow-sm outline-none transition-[background-color,box-shadow] duration-150 hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {step === 'email' ? (
          'Continue'
        ) : submitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  )
}
