import { createClient } from '../client'
import type { SearchPage } from '../model'

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

export type DeepResearchSearchResponse = {
  query_id: string
  understanding: QueryUnderstanding
  internal_results: SearchPage
}

export const deepResearchEndpoints = (client: ReturnType<typeof createClient>) => ({
  search: (query: string, page = 1, page_size = 20) =>
    client.post<DeepResearchSearchResponse>('/api/deep-research/search', {
      query,
      page,
      page_size,
    }),
})
