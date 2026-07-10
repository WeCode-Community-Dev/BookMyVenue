import { Link, useRouteError } from 'react-router-dom';
import { useState } from 'react';

export default function ErrorPage() {
  const error = useRouteError() as any;
  const [showDev, setShowDev] = useState(false);

  const message = error?.message || error?.statusText || 'Something went wrong';
  const status = error?.status;
  const stack = error?.stack;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-white px-6">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-lg">
        {/* Icon + Title */}
        <div className="text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center text-2xl font-bold">
            !
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold">Something went wrong</h1>

          <p className="text-sm text-muted-foreground">
            We couldn't load this page. Please try again.
          </p>
        </div>

        {/* Error details */}
        <div className="mt-6 space-y-3">
          {status && (
            <div className="flex justify-between items-center rounded-lg border border-border bg-muted px-4 py-3">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Status</span>
              <span className="text-sm font-medium text-white">{status}</span>
            </div>
          )}

          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Message</p>
            <p className="text-sm text-white break-words">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-muted transition text-sm text-white"
          >
            Go Back
          </button>

          <button
            onClick={() => setShowDev((s) => !s)}
            className="px-5 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-white transition"
          >
            {showDev ? 'Hide Debug' : 'Show Debug'}
          </button>
        </div>

        {/* Dev panel */}
        {showDev && (
          <div className="mt-6 rounded-xl border border-border bg-black/80 p-4 overflow-auto">
            <p className="text-xs text-green-400 mb-2 uppercase tracking-wide">Stack Trace</p>
            <pre className="text-xs text-green-300 whitespace-pre-wrap break-words leading-relaxed">
              {stack || 'No stack available'}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
