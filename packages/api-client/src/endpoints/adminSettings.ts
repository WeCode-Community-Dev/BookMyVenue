import { createClient } from '../client'

export interface JobInfo {
  name: string
  description: string
  schedule: string
  queue_type: string
}

export interface PlatformSettings {
  // Booking & commission
  default_platform_commission_pct: number
  token_payment_hold_hours: number
  instant_booking_payment_timeout_minutes: number
  booking_request_expiry_days: number
  max_deadline_extensions: number
  payment_reminder_hours_before_expiry: number
  balance_overdue_action_window_hours: number

  // Cancellation & refunds
  default_no_policy_refund_pct: number
  default_no_policy_platform_fee_refundable: boolean

  // Rate limits
  deep_research_rate_limit_per_minute: number
  deep_research_daily_limit: number
  contact_rate_limit_per_hour: number

  // Search ranking
  search_min_vector_similarity: number
  search_fts_weight: number
  search_vector_weight: number
  search_wedding_boost: number
  search_event_boost: number
  search_corporate_boost: number
  search_normalizer_match_threshold: number
  search_normalizer_min_token_len: number

  // Deployment-level (read-only, set via env vars)
  environment: string
  currency: string
  background_jobs_enabled: boolean
  job_runner_configured: boolean
  search_diagnostics_enabled: boolean

  jobs: JobInfo[]
}

export type PlatformSettingsUpdate = Partial<{
  default_platform_commission_pct: number
  token_payment_hold_hours: number
  instant_booking_payment_timeout_minutes: number
  booking_request_expiry_days: number
  max_deadline_extensions: number
  payment_reminder_hours_before_expiry: number
  balance_overdue_action_window_hours: number
  default_no_policy_refund_pct: number
  default_no_policy_platform_fee_refundable: boolean
  deep_research_rate_limit_per_minute: number
  deep_research_daily_limit: number
  contact_rate_limit_per_hour: number
  search_min_vector_similarity: number
  search_fts_weight: number
  search_vector_weight: number
  search_wedding_boost: number
  search_event_boost: number
  search_corporate_boost: number
  search_normalizer_match_threshold: number
  search_normalizer_min_token_len: number
}>

export type SettingKey = keyof PlatformSettingsUpdate

export interface SettingFieldMeta {
  key: SettingKey
  label: string
  description: string
  value_type: 'int' | 'float' | 'bool'
  min_value: number | null
  max_value: number | null
}

export interface SettingCategoryMeta {
  key: string
  label: string
  fields: SettingFieldMeta[]
}

export interface SettingsMetadataResponse {
  categories: SettingCategoryMeta[]
}

export function adminSettingsEndpoints(client: ReturnType<typeof createClient>) {
  return {
    /**
     * Platform-wide booking/commission defaults and operational config (admin only)
     */
    getPlatformSettings: async (): Promise<PlatformSettings> => {
      return client.get('/api/admin/settings')
    },
    /**
     * Update one or more admin-editable booking/commission/rate-limit settings.
     * Invalidates the server-side cache and writes a settings_updated audit entry.
     */
    updatePlatformSettings: async (body: PlatformSettingsUpdate): Promise<PlatformSettings> => {
      return client.patch('/api/admin/settings', body)
    },
    /**
     * Static registry metadata (labels, descriptions, categories, validation
     * ranges) for every admin-editable setting. Effectively immutable at
     * runtime — safe to cache indefinitely on the client.
     */
    getSettingsMetadata: async (): Promise<SettingsMetadataResponse> => {
      return client.get('/api/admin/settings/metadata')
    },
  }
}
