import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import { ThemeProvider } from '@venue404/ui'
import App from './App'
import { AuthProvider } from './lib/AuthContext'
import './styles/index.css'

// No-op unless VITE_SENTRY_DSN is set — same fail-open pattern as the backend.
// All 4 apps can share one Sentry project — this tag is how you tell them
// apart in the issue list when they do.
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0,
    initialScope: { tags: { app: 'owner-portal' } },
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
)

function ErrorFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center dark:bg-ink-950">
      <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Something went wrong</p>
      <p className="text-sm text-zinc-500">Please refresh the page and try again.</p>
    </div>
  )
}
