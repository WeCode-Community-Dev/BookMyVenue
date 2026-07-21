import { createClient } from '../client'

export type DeepResearchStats = {
  labels: string[]
  query_counts: number[]
  avg_match_scores: (number | null)[]
  total_queries: number
  avg_result_count: number
  avg_match_score_overall: number | null
}

export type DeepResearchQuerySummary = {
  id: string
  user_id: string
  query_text: string
  city_filter: string | null
  result_count: number
  avg_match_score: number | null
  created_at: string
}

export type DeepResearchTopResult = {
  id: string
  name: string
  match_source: string | null
  match_score: number | null
}

export type DeepResearchQueryDetail = DeepResearchQuerySummary & {
  understanding_json: Record<string, unknown> | null
  top_results_json: DeepResearchTopResult[] | null
}

export type DeepResearchQueryListResponse = {
  items: DeepResearchQuerySummary[]
  total: number
  page: number
  page_size: number
}

export type ListDeepResearchQueriesParams = {
  page?: number
  page_size?: number
  search?: string
}

export const adminDeepResearchEndpoints = (client: ReturnType<typeof createClient>) => ({
  getStats: (days = 30): Promise<DeepResearchStats> =>
    client.get<DeepResearchStats>(`/api/admin/deep-research/stats?days=${days}`),

  listQueries: (
    params: ListDeepResearchQueriesParams = {}
  ): Promise<DeepResearchQueryListResponse> => {
    const qs = new URLSearchParams()
    if (params.page) qs.set('page', String(params.page))
    if (params.page_size) qs.set('page_size', String(params.page_size))
    if (params.search) qs.set('search', params.search)
    const q = qs.toString()
    return client.get<DeepResearchQueryListResponse>(
      `/api/admin/deep-research/queries${q ? `?${q}` : ''}`
    )
  },

  getQuery: (id: string): Promise<DeepResearchQueryDetail> =>
    client.get<DeepResearchQueryDetail>(`/api/admin/deep-research/queries/${id}`),
})
