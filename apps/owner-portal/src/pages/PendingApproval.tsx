import { useAuth } from '../lib/AuthContext'

export default function PendingApproval() {
  const { signOut } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-ink-800 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-ink-900 p-8 shadow-sm ring-1 ring-zinc-900/5 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
          <svg className="h-6 w-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Application under review</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Your venue owner account is pending approval from our team. We'll reach out via email once
          a decision has been made.
        </p>
        <button
          onClick={() => signOut()}
          className="mt-6 inline-flex items-center justify-center rounded-lg border border-zinc-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-5 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-sm transition-colors hover:bg-zinc-50 dark:hover:bg-ink-800"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
