import { Link } from 'react-router-dom'

export default function RegisterSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-ink-800 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-ink-900 p-8 shadow-sm ring-1 ring-zinc-900/5 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
          <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Account created!</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Please check your email to confirm your account. Once confirmed, log in — your application
          will be reviewed by our team before you can access the owner portal.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover"
        >
          Go to login
        </Link>
      </div>
    </div>
  )
}
