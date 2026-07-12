import { createClient } from '../client'

export interface JobInfo {
  name: string
  description: string
  schedule: string
  queue_type: string
}

export interface PlatformSettings {
  default_platform_commission_pct: number
  token_payment_hold_hours: number
  instant_booking_payment_timeout_minutes: number
  booking_request_expiry_days: number
  max_deadline_extensions: number
  payment_reminder_hours_before_expiry: number
  balance_overdue_action_window_hours: number
  deep_research_rate_limit_per_minute: number
  deep_research_daily_limit: number

  environment: string
  currency: string
  background_jobs_enabled: boolean
  job_runner_configured: boolean
  search_diagnostics_enabled: boolean

  jobs: JobInfo[]
}

export function adminSettingsEndpoints(client: ReturnType<typeof createClient>) {
  return {
    /**
     * Read-only platform-wide booking/commission defaults (admin only)
     */
    getPlatformSettings: async (): Promise<PlatformSettings> => {
      return client.get('/api/admin/settings')
    },
  }
}
