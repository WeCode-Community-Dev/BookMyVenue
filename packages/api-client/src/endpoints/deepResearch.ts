import { createClient } from '../client'

export type QueryUnderstanding = {
  intent: string
  city: string | null
  venue_type: string | null
  capacity: number | null
  budget_hint: string | null
  date_hint: string | null
  required_amenities: string[]
  special_requirements: string[]
}

export const deepResearchEndpoints = (client: ReturnType<typeof createClient>) => ({
  understandQuery: (query: string) =>
    client.post<QueryUnderstanding>('/api/deep-research/understand', { query }),
})
