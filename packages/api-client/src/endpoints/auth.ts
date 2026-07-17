import { createClient } from '../client'

export type AuthUser = {
  id: string
  email: string | null
  profile: {
    full_name: string | null
    phone: string | null
    avatar_url: string | null
    status: 'active' | 'suspended' | 'pending' | 'rejected'
  }
  roles: string[]
}

export const authEndpoints = (client: ReturnType<typeof createClient>) => ({
  me: () => client.get<AuthUser>('/api/auth/me'),
  registerOwner: () => client.post<void>('/api/auth/register-owner', {}),
  reapplyOwner: () => client.post<void>('/api/auth/reapply-owner', {}),
  forgotPassword: (email: string, redirectTo: string) =>
    client.post<void>('/api/auth/forgot-password', { email, redirect_to: redirectTo }),
  sendConfirmation: (email: string, redirectTo: string) =>
    client.post<void>('/api/auth/send-confirmation', { email, redirect_to: redirectTo }),
})
