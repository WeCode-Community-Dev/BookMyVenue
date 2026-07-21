import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClient, authEndpoints } from '@venue404/api-client'
import { LoadingScreen, ErrorState } from '@venue404/ui'
import { queryClient } from '../lib/queryClient'

export default function LoginSuccess() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function verify() {
      try {
        const user = await queryClient.fetchQuery({
          queryKey: ['me'],
          queryFn: () => authEndpoints(createClient()).me(),
        })

        // Any authenticated user (customer, venue_owner, super_admin, or a
        // combination) can use user-web — 'customer' is the baseline role
        // every account should carry, but we don't gate the redirect on it
        // specifically so admin/owner accounts still land on the site.
        if (user.roles.length > 0) {
          navigate('/', { replace: true })
          return
        }

        setError('Your account has no assigned role. Please contact support.')
      } catch {
        setError('Session verification failed. Please sign in again.')
      }
    }

    verify()
  }, [navigate])

  if (error) {
    return (
      <ErrorState
        title="Session Verification Failed"
        message={error}
        action={
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
          >
            Back to Login
          </button>
        }
      />
    )
  }

  return <LoadingScreen message="Signing you in…" />
}
