import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClient, authEndpoints } from '@venue404/api-client'
import { LoadingScreen, ErrorState } from '@venue404/ui'

export default function LoginSuccess() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function verify() {
      try {
        const client = createClient()
        const user = await authEndpoints(client).me()

        if (user.roles.includes('super_admin')) {
          navigate('/dashboard', { replace: true })
        } else {
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

  return <LoadingScreen message="Verifying admin access…" />
}
