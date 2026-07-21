import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient, profileEndpoints } from '@venue404/api-client'
import { useAuth } from '../lib/AuthContext'
import { AppNavbar } from '../components/shared/AppNavbar'
import { HomeFooter } from '../components/home/HomeFooter'

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  super_admin: { label: 'Super Admin', color: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900/50' },
  venue_owner: { label: 'Venue Owner', color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50' },
  customer:    { label: 'Customer',    color: 'bg-brand-light text-brand border-brand-muted dark:bg-brand/15 dark:text-brand-secondary dark:border-brand/30' },
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active:    { label: 'Active',    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' },
  suspended: { label: 'Suspended', color: 'bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400' },
  pending:   { label: 'Pending',   color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' },
  rejected:  { label: 'Rejected',  color: 'bg-zinc-100 text-zinc-500 dark:bg-ink-800 dark:text-zinc-400' },
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase() || '?'
}

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const fullName   = user?.profile?.full_name ?? ''
  const email      = user?.email ?? ''
  const roles      = user?.roles ?? ['customer']
  const status     = user?.profile?.status ?? 'active'
  const initials   = getInitials(fullName || email)

  const [nameInput, setNameInput] = useState(fullName)
  const [saved, setSaved] = useState(false)

  const updateProfile = useMutation({
    mutationFn: (full_name: string) => {
      const client = createClient()
      return profileEndpoints(client).updateProfile({ full_name })
    },
    onSuccess: () => {
      setSaved(true)
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      setTimeout(() => setSaved(false), 2500)
    },
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (nameInput.trim() === fullName) return
    updateProfile.mutate(nameInput.trim())
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const primaryRole = roles.includes('super_admin')
    ? 'super_admin'
    : roles.includes('venue_owner')
    ? 'venue_owner'
    : 'customer'

  const roleConfig   = ROLE_LABELS[primaryRole]   ?? ROLE_LABELS.customer
  const statusConfig = STATUS_LABELS[status] ?? STATUS_LABELS.active

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-ink-950">
      <AppNavbar />

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">

        {/* ── Page header ─────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">My Profile</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage your account and personal details.</p>
        </div>

        <div className="space-y-4">

          {/* ── Avatar + identity card ──────────────────── */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand text-xl font-bold text-white shadow-sm">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {fullName || 'No name set'}
                </p>
                <p className="mt-0.5 truncate text-sm text-zinc-500">{email}</p>

                {/* Badges */}
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleConfig.color}`}>
                    {roleConfig.label}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.color}`}>
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                    {statusConfig.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Edit name ───────────────────────────────── */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900">
            <h2 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Personal Information</h2>
            <p className="mb-5 text-xs text-zinc-400">Update your display name shown across the platform.</p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Full Name
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => { setNameInput(e.target.value); setSaved(false) }}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/10 dark:border-ink-700 dark:bg-ink-800 dark:text-zinc-100 dark:focus:bg-ink-900"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-400 cursor-not-allowed dark:border-ink-800 dark:bg-ink-800"
                />
                <p className="mt-1 text-xs text-zinc-400">Email is managed by your auth provider and cannot be changed here.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                {saved && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved
                  </span>
                )}
                {updateProfile.isError && (
                  <span className="text-xs text-red-500">Failed to save. Try again.</span>
                )}
                <button
                  type="submit"
                  disabled={updateProfile.isPending || nameInput.trim() === fullName || !nameInput.trim()}
                  className="rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-hover active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateProfile.isPending ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* ── Account details (read-only) ─────────────── */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900">
            <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Account Details</h2>
            <dl className="divide-y divide-zinc-100 dark:divide-ink-800">
              <div className="flex items-center justify-between py-3">
                <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wider">User ID</dt>
                <dd className="font-mono text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]">{user?.id ?? '—'}</dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Role</dt>
                <dd>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleConfig.color}`}>
                    {roleConfig.label}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</dt>
                <dd>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.color}`}>
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                    {statusConfig.label}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* ── Quick links ─────────────────────────────── */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900">
            <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Quick Links</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'My Bookings', href: '/my-bookings', icon: (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                )},
                { label: 'Notifications', href: '/notifications', icon: (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                )},
              ].map(({ label, href, icon }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-200 hover:bg-white dark:border-ink-800 dark:bg-ink-800 dark:text-zinc-300 dark:hover:border-ink-700 dark:hover:bg-ink-900"
                >
                  <span className="text-zinc-400">{icon}</span>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Danger zone ─────────────────────────────── */}
          <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm dark:border-red-900/40 dark:bg-ink-900">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Sign Out</h2>
                <p className="mt-0.5 text-xs text-zinc-400">Sign out from your account on this device.</p>
              </div>
              <button
                onClick={handleSignOut}
                className="shrink-0 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 active:scale-[0.97] dark:border-red-900/50 dark:bg-ink-900 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                Sign out
              </button>
            </div>
          </div>

        </div>
      </div>
      <HomeFooter />
    </div>
  )
}
