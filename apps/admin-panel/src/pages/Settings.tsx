import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Percent, Search, Undo2, Gauge, SlidersHorizontal, Info, Globe, Coins,
  PlayCircle, KeyRound, Bug, Briefcase, AlertTriangle,
} from 'lucide-react'
import { createClient, adminSettingsEndpoints } from '@venue404/api-client'
import type {
  JobInfo, PlatformSettings, PlatformSettingsUpdate,
  SettingCategoryMeta, SettingFieldMeta, SettingKey,
} from '@venue404/api-client'
import { AdminLayout } from '../components/AdminLayout'
import { SectionHeader, StatusBadge, LoadingScreen, ErrorState, Button, Input } from '@venue404/ui'

const api = adminSettingsEndpoints(createClient())

// Cosmetic display hints keyed by setting — the backend registry (fetched via
// getSettingsMetadata) owns label/description/validation; this table only
// adds a unit suffix and input step, since those aren't meaningful server-side.
const DISPLAY_HINTS: Record<SettingKey, { suffix: string; step?: number }> = {
  default_platform_commission_pct: { suffix: '%', step: 0.5 },
  token_payment_hold_hours: { suffix: 'hours' },
  instant_booking_payment_timeout_minutes: { suffix: 'minutes' },
  booking_request_expiry_days: { suffix: 'days' },
  max_deadline_extensions: { suffix: 'extensions' },
  payment_reminder_hours_before_expiry: { suffix: 'hours' },
  balance_overdue_action_window_hours: { suffix: 'hours' },
  default_no_policy_refund_pct: { suffix: '%', step: 0.5 },
  default_no_policy_platform_fee_refundable: { suffix: '' },
  deep_research_rate_limit_per_minute: { suffix: '/min' },
  deep_research_daily_limit: { suffix: '/day' },
  contact_rate_limit_per_hour: { suffix: '/hour' },
  search_min_vector_similarity: { suffix: '', step: 0.01 },
  search_fts_weight: { suffix: '', step: 0.05 },
  search_vector_weight: { suffix: '', step: 0.05 },
  search_wedding_boost: { suffix: '×', step: 0.05 },
  search_event_boost: { suffix: '×', step: 0.05 },
  search_corporate_boost: { suffix: '×', step: 0.05 },
  search_normalizer_match_threshold: { suffix: '/100' },
  search_normalizer_min_token_len: { suffix: 'chars' },
}

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  booking: <Percent className="h-4 w-4" />,
  cancellation: <Undo2 className="h-4 w-4" />,
  rate_limits: <Gauge className="h-4 w-4" />,
  search: <SlidersHorizontal className="h-4 w-4" />,
}

const CATEGORY_ACCENT: Record<string, { icon: string; ring: string }> = {
  booking: {
    icon: 'bg-brand-light dark:bg-brand-secondary/20 text-brand dark:text-brand-secondary',
    ring: 'focus:ring-brand/20',
  },
  cancellation: {
    icon: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
    ring: 'focus:ring-rose-500/20',
  },
  rate_limits: {
    icon: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400',
    ring: 'focus:ring-violet-500/20',
  },
  search: {
    icon: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
    ring: 'focus:ring-amber-500/20',
  },
}

const CATEGORY_NOTE: Record<string, string> = {
  search: 'Affects live search ranking for every user — change with care and verify results after saving.',
}

function matchesQuery(field: SettingFieldMeta, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return field.label.toLowerCase().includes(q) || field.description.toLowerCase().includes(q)
}

function SettingsCategoryCard({
  category, values, query,
}: {
  category: SettingCategoryMeta
  values: PlatformSettings
  query: string
}) {
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState<Record<string, string>>({})

  useEffect(() => {
    setDraft(
      Object.fromEntries(
        category.fields.map((f) => [f.key, String(values[f.key as keyof PlatformSettings])])
      )
    )
  }, [values])

  const mutation = useMutation({
    mutationFn: (body: PlatformSettingsUpdate) => api.updatePlatformSettings(body),
    onSuccess: (updated) => {
      queryClient.setQueryData(['admin', 'settings'], updated)
    },
  })

  const visibleFields = category.fields.filter((f) => matchesQuery(f, query))

  const dirtyKeys = category.fields.filter(
    (f) => draft[f.key] !== undefined && draft[f.key] !== String(values[f.key as keyof PlatformSettings])
  )

  const handleSave = () => {
    const body: PlatformSettingsUpdate = {}
    for (const field of dirtyKeys) {
      const raw = draft[field.key]
      if (field.value_type === 'bool') {
        ;(body as Record<string, boolean>)[field.key] = raw === 'true'
        continue
      }
      const num = Number(raw)
      if (Number.isNaN(num)) continue
      ;(body as Record<string, number>)[field.key] = num
    }
    if (Object.keys(body).length > 0) mutation.mutate(body)
  }

  const handleReset = () => {
    setDraft(
      Object.fromEntries(
        category.fields.map((f) => [f.key, String(values[f.key as keyof PlatformSettings])])
      )
    )
  }

  if (visibleFields.length === 0) return null

  const accent = CATEGORY_ACCENT[category.key] ?? CATEGORY_ACCENT.booking
  const note = CATEGORY_NOTE[category.key]

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-ink-700 dark:bg-ink-900">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-100 px-5 py-4 dark:border-ink-700">
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent.icon}`}>
            {CATEGORY_ICON[category.key] ?? <SlidersHorizontal className="h-4 w-4" />}
          </span>
          <SectionHeader title={category.label} description={`${visibleFields.length} setting${visibleFields.length === 1 ? '' : 's'}`} />
        </div>
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

      {note && (
        <div className="flex items-start gap-2 border-b border-amber-100 bg-amber-50/60 px-5 py-2.5 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-500/5 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {note}
        </div>
      )}

      {mutation.isError && (
        <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {mutation.error instanceof Error ? mutation.error.message : 'Failed to save settings'}
        </div>
      )}

      <div className="divide-y divide-zinc-50 dark:divide-ink-800">
        {visibleFields.map((field) => {
          const hint = DISPLAY_HINTS[field.key] ?? { suffix: '' }
          return (
            <div key={field.key} className="flex items-center gap-4 px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{field.label}</p>
                <p className="mt-0.5 text-xs text-zinc-400">{field.description}</p>
              </div>
              <div className="w-32 shrink-0">
                {field.value_type === 'bool' ? (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={draft[field.key] === 'true'}
                    disabled={mutation.isPending}
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        [field.key]: d[field.key] === 'true' ? 'false' : 'true',
                      }))
                    }
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                      draft[field.key] === 'true' ? 'bg-brand' : 'bg-zinc-200 dark:bg-ink-700'
                    } disabled:opacity-50`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        draft[field.key] === 'true' ? 'translate-x-[22px]' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                ) : (
                  <Input
                    type="number"
                    step={hint.step ?? 1}
                    min={field.min_value ?? undefined}
                    max={field.max_value ?? undefined}
                    suffix={hint.suffix}
                    value={draft[field.key] ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                    disabled={mutation.isPending}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

type Row = { label: string; value: string; description: string; icon: React.ReactNode }

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
  const [query, setQuery] = useState('')

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => api.getPlatformSettings(),
  })

  const { data: metadata, isLoading: metaLoading, error: metaError } = useQuery({
    queryKey: ['admin', 'settings', 'metadata'],
    queryFn: () => api.getSettingsMetadata(),
    staleTime: Infinity,
  })

  const totalFields = useMemo(
    () => metadata?.categories.reduce((n, c) => n + c.fields.length, 0) ?? 0,
    [metadata]
  )

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

  const loading = isLoading || metaLoading
  const anyError = error ?? metaError

  return (
    <AdminLayout pageTitle="Admin Settings" pageSubtitle="Platform-wide rules, configuration, and background jobs">

      <div className="space-y-5">
        {!loading && !anyError && (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${totalFields} settings…`}
              className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
          </div>
        )}

        {loading && (
          <div className="rounded-xl border border-zinc-200 bg-white px-5 py-10 shadow-sm dark:border-ink-700 dark:bg-ink-900">
            <LoadingScreen message="Loading settings…" fullScreen={false} />
          </div>
        )}

        {!loading && !!anyError && (
          <div className="rounded-xl border border-zinc-200 bg-white px-5 py-10 shadow-sm dark:border-ink-700 dark:bg-ink-900">
            <ErrorState
              title="Could not load settings"
              message={anyError instanceof Error ? anyError.message : 'Failed to load platform settings'}
              fullScreen={false}
              action={<Button variant="secondary" onClick={() => refetch()}>Retry</Button>}
            />
          </div>
        )}

        {!loading && !anyError && data && metadata && (
          <>
            {metadata.categories.map((category) => (
              <SettingsCategoryCard key={category.key} category={category} values={data} query={query} />
            ))}

            <RuleCard
              title="Platform config"
              description="Deployment-level — set via environment variables, not editable here. Secrets and credentials are never shown here."
              rows={configRows}
              isLoading={false}
              error={null}
              onRetry={refetch}
            />

            <JobsCard jobs={data.jobs} isLoading={false} error={null} onRetry={refetch} />

            <div className="flex items-start gap-2 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-xs text-zinc-500 dark:border-ink-700 dark:bg-ink-800/60 dark:text-zinc-400">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <div className="flex items-center gap-1.5">
                Per-venue commission and advance percentages are set individually per venue and are not
                shown here — see the venue details in Venue Approvals.
              </div>
            </div>
          </>
        )}
      </div>

    </AdminLayout>
  )
}
