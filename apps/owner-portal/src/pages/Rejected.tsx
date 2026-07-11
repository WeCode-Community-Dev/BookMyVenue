import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { createClient, authEndpoints } from '@venue404/api-client'

export default function Rejected() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [reapplying, setReapplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleReapply() {
    setReapplying(true)
    setError(null)
    try {
      const client = createClient()
      await authEndpoints(client).reapplyOwner()
      navigate('/pending-approval', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to re-apply. Please try again.')
    } finally {
      setReapplying(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-ink-800 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-ink-900 p-8 shadow-sm ring-1 ring-zinc-900/5 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Application not approved</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">
          Your venue owner application was reviewed and could not be approved at this time. You can
          submit a new application for reconsideration.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={handleReapply}
            disabled={reapplying}
            className="press inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-55"
          >
            {reapplying ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                Submitting…
              </>
            ) : (
              'Re-apply'
            )}
          </button>
          <button
            onClick={() => signOut()}
            disabled={reapplying}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 dark:border-ink-800 bg-white dark:bg-ink-900 px-5 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 dark:hover:bg-ink-800 dark:bg-ink-800 disabled:opacity-55"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
