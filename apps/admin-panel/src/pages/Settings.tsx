import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Percent, Clock, Timer, CalendarX, RefreshCcw, Info, Bell, ShieldAlert,
  Gauge, CalendarClock, Globe, Coins, PlayCircle, KeyRound, Bug, Briefcase,
} from 'lucide-react'
import { createClient, adminSettingsEndpoints } from '@venue404/api-client'
import type { JobInfo, PlatformSettings, PlatformSettingsUpdate } from '@venue404/api-client'
import { AdminLayout } from '../components/AdminLayout'
import { SectionHeader, StatusBadge, LoadingScreen, ErrorState, Button, Input } from '@venue404/ui'

const api = adminSettingsEndpoints(createClient())

type EditableRow = {
  key: keyof PlatformSettingsUpdate
  label: string
  description: string
  icon: React.ReactNode
  suffix: string
  step?: number
}

const EDITABLE_ROWS: EditableRow[] = [
  {
    key: 'default_platform_commission_pct',
    label: 'Default Platform Commission',
    description: 'Applied to every newly created venue. Owners can be given a different rate per venue afterwards.',
    icon: <Percent className="h-4 w-4" />,
    suffix: '%',
    step: 0.5,
  },
  {
    key: 'token_payment_hold_hours',
    label: 'Token Payment Hold Window',
    description: 'Time an accepted booking request has to complete the token advance before its hold expires.',
    icon: <Clock className="h-4 w-4" />,
    suffix: 'hours',
  },
  {
    key: 'instant_booking_payment_timeout_minutes',
    label: 'Instant Booking Payment Timeout',
    description: 'Time window to complete payment on an instant booking before it is released.',
    icon: <Timer className="h-4 w-4" />,
    suffix: 'minutes',
  },
  {
    key: 'booking_request_expiry_days',
    label: 'Booking Request Expiry',
    description: 'An unanswered booking request automatically expires after this many days.',
    icon: <CalendarX className="h-4 w-4" />,
    suffix: 'days',
  },
  {
    key: 'max_deadline_extensions',
    label: 'Max Deadline Extensions',
    description: 'Maximum number of times an owner can extend a booking’s payment deadline.',
    icon: <RefreshCcw className="h-4 w-4" />,
    suffix: 'extensions',
  },
  {
    key: 'payment_reminder_hours_before_expiry',
    label: 'Payment Reminder Lead Time',
    description: 'Users are reminded to pay the token advance this long before their hold expires.',
    icon: <Bell className="h-4 w-4" />,
    suffix: 'hours',
  },
  {
    key: 'balance_overdue_action_window_hours',
    label: 'Balance Overdue Action Window',
    description: 'Default time an owner has to act on an overdue balance before auto-cancellation. Venues can override this.',
    icon: <ShieldAlert className="h-4 w-4" />,
    suffix: 'hours',
  },
  {
    key: 'deep_research_rate_limit_per_minute',
    label: 'Deep Research Rate Limit',
    description: 'Per-user limit on external venue-discovery searches, per minute.',
    icon: <Gauge className="h-4 w-4" />,
    suffix: '/min',
  },
  {
    key: 'deep_research_daily_limit',
    label: 'Deep Research Daily Limit',
    description: 'Per-user daily cap on external venue-discovery searches.',
    icon: <Gauge className="h-4 w-4" />,
    suffix: '/day',
  },
]

type Row = { label: string; value: string; description: string; icon: React.ReactNode }

function EditableRuleCard({
  data, isLoading, error, onRetry,
}: {
  data: PlatformSettings | undefined
  isLoading: boolean
  error: unknown
  onRetry: () => void
}) {
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!data) return
    setDraft(
      Object.fromEntries(EDITABLE_ROWS.map((row) => [row.key, String(data[row.key])]))
    )
  }, [data])

  const mutation = useMutation({
    mutationFn: (body: PlatformSettingsUpdate) => api.updatePlatformSettings(body),
    onSuccess: (updated) => {
      queryClient.setQueryData(['admin', 'settings'], updated)
    },
  })

  const dirtyKeys = data
    ? EDITABLE_ROWS.filter((row) => draft[row.key] !== undefined && draft[row.key] !== String(data[row.key]))
    : []

  const handleSave = () => {
    const body: PlatformSettingsUpdate = {}
    for (const row of dirtyKeys) {
      const raw = draft[row.key]
      const num = Number(raw)
      if (Number.isNaN(num)) continue
      ;(body as Record<string, number>)[row.key] = num
    }
    if (Object.keys(body).length > 0) mutation.mutate(body)
  }

  const handleReset = () => {
    if (!data) return
    setDraft(Object.fromEntries(EDITABLE_ROWS.map((row) => [row.key, String(data[row.key])])))
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-ink-700 dark:bg-ink-900">
      <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-ink-700">
        <SectionHeader
          title="Booking & commission rules"
          description="Admin-editable — changes are cached and take effect on the next read, no deployment needed."
        />
        {dirtyKeys.length > 0 && (
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset} disabled={mutation.isPending}>
              Discard
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving…' : `Save ${dirtyKeys.length} change${dirtyKeys.length > 1 ? 's' : ''}`}
            </Button>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="px-5 py-10">
          <LoadingScreen message="Loading…" fullScreen={false} />
        </div>
      )}

      {!isLoading && !!error && (
        <div className="px-5 py-10">
          <ErrorState
            title="Could not load settings"
            message={error instanceof Error ? error.message : 'Failed to load platform settings'}
            fullScreen={false}
            action={<Button variant="secondary" onClick={onRetry}>Retry</Button>}
          />
        </div>
      )}

      {mutation.isError && (
        <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {mutation.error instanceof Error ? mutation.error.message : 'Failed to save settings'}
        </div>
      )}

      {!isLoading && !error && data && (
        <div className="divide-y divide-zinc-50 dark:divide-ink-800">
          {EDITABLE_ROWS.map((row) => (
            <div key={row.key} className="flex items-center gap-4 px-5 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-ink-800 dark:text-zinc-400">
                {row.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{row.label}</p>
                <p className="mt-0.5 text-xs text-zinc-400">{row.description}</p>
              </div>
              <div className="w-32 shrink-0">
                <Input
                  type="number"
                  step={row.step ?? 1}
                  suffix={row.suffix}
                  value={draft[row.key] ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, [row.key]: e.target.value }))}
                  disabled={mutation.isPending}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RuleCard({ title, description, rows, isLoading, error, onRetry }: {
  title: string
  description: string
  rows: Row[]
  isLoading: boolean
  error: unknown
  onRetry: () => void
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-ink-700 dark:bg-ink-900">
      <div className="border-b border-zinc-100 px-5 py-4 dark:border-ink-700">
        <SectionHeader title={title} description={description} />
      </div>

      {isLoading && (
        <div className="px-5 py-10">
          <LoadingScreen message="Loading…" fullScreen={false} />
        </div>
      )}

      {!isLoading && !!error && (
        <div className="px-5 py-10">
          <ErrorState
            title="Could not load settings"
            message={error instanceof Error ? error.message : 'Failed to load platform settings'}
            fullScreen={false}
            action={<Button variant="secondary" onClick={onRetry}>Retry</Button>}
          />
        </div>
      )}

      {!isLoading && !error && (
        <div className="divide-y divide-zinc-50 dark:divide-ink-800">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start gap-4 px-5 py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-ink-800 dark:text-zinc-400">
                {row.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{row.label}</p>
                <p className="mt-0.5 text-xs text-zinc-400">{row.description}</p>
              </div>
              <p className="shrink-0 pt-1 text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{row.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function JobsCard({ jobs, isLoading, error, onRetry }: {
  jobs: JobInfo[]
  isLoading: boolean
  error: unknown
  onRetry: () => void
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-ink-700 dark:bg-ink-900">
      <div className="border-b border-zinc-100 px-5 py-4 dark:border-ink-700">
        <SectionHeader
          title="Background jobs"
          description="Static catalog — what runs and when. No live run history is tracked yet."
        />
      </div>

      {isLoading && (
        <div className="px-5 py-10">
          <LoadingScreen message="Loading…" fullScreen={false} />
        </div>
      )}

      {!isLoading && !!error && (
        <div className="px-5 py-10">
          <ErrorState
            title="Could not load jobs"
            message={error instanceof Error ? error.message : 'Failed to load job catalog'}
            fullScreen={false}
            action={<Button variant="secondary" onClick={onRetry}>Retry</Button>}
          />
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50/60 dark:border-ink-700 dark:bg-ink-800/60">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Job</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">What it does</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Schedule</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Mechanism</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-ink-800">
              {jobs.map((job) => (
                <tr key={job.name} className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-ink-800/70">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      <Briefcase className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                      {job.name}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 max-w-[320px] text-zinc-600 dark:text-zinc-400">{job.description}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge label={job.schedule} variant="neutral" dot={false} />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-zinc-400">{job.queue_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function Settings() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => api.getPlatformSettings(),
  })

  const configRows: Row[] = data ? [
    {
      label: 'Environment',
      value: data.environment,
      description: 'Which deployment environment the API is currently running as.',
      icon: <Globe className="h-4 w-4" />,
    },
    {
      label: 'Currency',
      value: data.currency,
      description: 'Currency used for all payments processed through Stripe.',
      icon: <Coins className="h-4 w-4" />,
    },
    {
      label: 'Background Jobs (in-process)',
      value: data.background_jobs_enabled ? 'Enabled' : 'Disabled',
      description: 'Whether the API runs jobs itself on a schedule, vs. relying on an external trigger.',
      icon: <PlayCircle className="h-4 w-4" />,
    },
    {
      label: 'Job Runner Endpoint',
      value: data.job_runner_configured ? 'Configured' : 'Not configured',
      description: 'Whether the token-guarded external job-trigger endpoint has a token set.',
      icon: <KeyRound className="h-4 w-4" />,
    },
    {
      label: 'Search Diagnostics',
      value: data.search_diagnostics_enabled ? 'Enabled' : 'Disabled',
      description: 'Whether search requests return extra ranking/debug information.',
      icon: <Bug className="h-4 w-4" />,
    },
  ] : []

  return (
    <AdminLayout pageTitle="Admin Settings" pageSubtitle="Platform-wide rules, configuration, and background jobs">

      <div className="space-y-5">
        <EditableRuleCard data={data} isLoading={isLoading} error={error} onRetry={refetch} />

        <RuleCard
          title="Platform config"
          description="Deployment-level — set via environment variables, not editable here. Secrets and credentials are never shown here."
          rows={configRows}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        />

        <JobsCard
          jobs={data?.jobs ?? []}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        />

        <div className="flex items-start gap-2 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-xs text-zinc-500 dark:border-ink-700 dark:bg-ink-800/60 dark:text-zinc-400">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
          <div className="flex items-center gap-1.5">
            <CalendarClock className="h-3.5 w-3.5" />
            Per-venue commission and advance percentages are set individually per venue and are not
            shown here — see the venue details in Venue Approvals.
          </div>
        </div>
      </div>

    </AdminLayout>
  )
}
