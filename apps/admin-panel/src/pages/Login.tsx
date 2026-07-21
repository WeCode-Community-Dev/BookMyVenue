import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { AuthLayout, AuthCard, AuthStatusPanel, Logo } from '@venue404/ui'
import { ShieldCheck, Building2, Users, BookOpen, ClipboardList } from 'lucide-react'

const FEATURES = [
  { label: 'Venue Approvals', icon: <Building2 className="h-3.5 w-3.5" /> },
  { label: 'User Management', icon: <Users className="h-3.5 w-3.5" /> },
  { label: 'Booking Monitor', icon: <BookOpen className="h-3.5 w-3.5" /> },
  { label: 'Audit Trail', icon: <ClipboardList className="h-3.5 w-3.5" /> },
]

export default function Login() {
  const { user, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
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
    try {
      await signIn({ email, password })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <AuthLayout
      left={
        <AuthCard
          title="Sign in to Admin"
          subtitle="Venue404 operations panel. Restricted access only."
          footer={
            <>Not an admin? Contact your system administrator.</>
          }
        >
          <div className="mb-7">
            <Logo />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@venue404.com"
                disabled={submitting}
                className="block w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-brand focus:ring-3 focus:ring-brand-secondary/15 disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                disabled={submitting}
                className="block w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-brand focus:ring-3 focus:ring-brand-secondary/15 disabled:opacity-50"
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
              disabled={submitting || !email || !password}
              className="press flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition-[background-color,box-shadow] duration-150 hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                  Signing in
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-5 flex items-center gap-2 rounded-lg bg-zinc-50 px-3.5 py-2.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
            <p className="text-xs text-zinc-400">All admin sessions are logged and audited.</p>
          </div>
        </AuthCard>
      }
      right={
        <AuthStatusPanel
          title="Manage your venue marketplace"
          description="Review submissions, monitor bookings, and keep the platform healthy from one place."
          features={FEATURES}
        />
      }
    />
  )
}
