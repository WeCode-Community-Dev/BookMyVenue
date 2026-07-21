import { createClient } from '../client'

export const profileEndpoints = (client: ReturnType<typeof createClient>) => ({
  getProfile: () => client.get<any>('/api/profile/me'),
  updateProfile: (body: { full_name: string }) => client.patch<any>('/api/profile/me', body),
})
