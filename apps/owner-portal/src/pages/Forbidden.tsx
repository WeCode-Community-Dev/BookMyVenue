import { useAuth } from '../lib/AuthContext'
import { ShieldAlert } from 'lucide-react'
import { Navigate } from 'react-router-dom'

export default function Forbidden() {
  const { user, signOut } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-ink-800 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-ink-900 p-8 shadow-sm ring-1 ring-zinc-900/5 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
          <ShieldAlert className="h-6 w-6 text-red-500" />
        </div>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Access denied</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          You need a venue owner account to access this portal. Your current account doesn't have the required permissions.
        </p>
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => signOut()}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-zinc-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-5 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-sm transition-colors hover:bg-zinc-50 dark:hover:bg-ink-800"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
