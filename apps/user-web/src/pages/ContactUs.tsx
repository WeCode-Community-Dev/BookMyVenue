import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createClient, contactEndpoints, ApiError } from '@venue404/api-client'
import { AppNavbar } from '../components/shared/AppNavbar'
import { HomeFooter } from '../components/home/HomeFooter'

const SUPPORT_EMAIL = 'venue404.support@gmail.com'

export default function ContactUs() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const submitMutation = useMutation({
    mutationFn: () =>
      contactEndpoints(createClient()).submit({ name, email, subject, message }),
    onSuccess: () => {
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitMutation.reset()
    submitMutation.mutate()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950">
      <AppNavbar />

      <main className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
        <div className="mb-12 max-w-2xl lg:mb-16">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
            Contact Us
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            Questions about a booking, a venue, or your account? Send us a message and our
            team will get back to you.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-16">
          {/* ── Form ─────────────────────────────────────────── */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-ink-700 dark:bg-ink-900"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name">Your name</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  disabled={submitMutation.isPending}
                />
              </div>
              <div>
                <label htmlFor="contact-email">Email address</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={submitMutation.isPending}
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What's this about?"
                disabled={submitMutation.isPending}
              />
            </div>

            <div className="mt-5">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how we can help…"
                disabled={submitMutation.isPending}
              />
            </div>

            {submitMutation.isError && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
              >
                <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span>
                  {submitMutation.error instanceof ApiError
                    ? submitMutation.error.message
                    : 'Something went wrong. Please try again.'}
                </span>
              </div>
            )}

            {submitMutation.isSuccess && (
              <div
                role="status"
                className="mt-5 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
              >
                <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Thanks — your message has been sent. We'll reply to your email soon.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitMutation.isPending || !name || !email || !subject || !message}
              className="press mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition-[background-color,box-shadow] duration-150 hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
            >
              {submitMutation.isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                'Send message'
              )}
            </button>
          </form>

          {/* ── Contact info ─────────────────────────────────── */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary">
                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Email us</h2>
              <p className="mt-1 text-xs text-zinc-400">We usually reply within one business day.</p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-3 inline-block text-sm font-medium text-brand hover:underline dark:text-brand-secondary"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary">
                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h2 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Help Center</h2>
              <p className="mt-1 text-xs text-zinc-400">
                Check common questions about booking, payments, and hosting.
              </p>
              <a
                href="/help"
                className="mt-3 inline-block text-sm font-medium text-brand hover:underline dark:text-brand-secondary"
              >
                Visit Help Center
              </a>
            </div>
          </aside>
        </div>
      </main>

      <HomeFooter />
    </div>
  )
}
