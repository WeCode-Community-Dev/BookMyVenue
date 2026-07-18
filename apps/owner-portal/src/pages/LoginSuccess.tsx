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
        const client = createClient()
        const user = await queryClient.fetchQuery({
          queryKey: ['me'],
          queryFn: () => authEndpoints(client).me(),
        })

        if (!user.roles.includes('venue_owner') && !user.roles.includes('super_admin')) {
          navigate('/403', { replace: true })
          return
        }

        // if (user.roles.includes('super_admin')) {
        //   navigate('/', { replace: true })
        //   return
        // }

        switch (user.profile.status) {
          case 'active':
            navigate('/', { replace: true })
            break
          case 'pending':
            navigate('/pending-approval', { replace: true })
            break
          case 'rejected':
            navigate('/rejected', { replace: true })
            break
          default:
            navigate('/403', { replace: true })
        }
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

  return <LoadingScreen message="Verifying your account…" />
}
