import { createClient } from '../client'

export interface ContactMessageCreate {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactMessageResponse {
  sent: boolean
}

export function contactEndpoints(client: ReturnType<typeof createClient>) {
  return {
    /**
     * Submit a "Contact Us" message (public, no auth required)
     */
    submit: async (payload: ContactMessageCreate): Promise<ContactMessageResponse> => {
      return client.post('/api/contact', payload)
    },
  }
}
