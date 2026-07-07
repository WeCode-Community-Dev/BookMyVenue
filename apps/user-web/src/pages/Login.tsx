import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { AuthLayout, AuthCard, Logo } from '@venue404/ui'
import { VenueFlowPanel } from '../components/VenueFlowPanel'
import { LoginForm } from '../components/auth/LoginForm'

export default function Login() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/login/success', { replace: true })
  }, [user, loading, navigate])

  if (loading) return null

  return (
    <AuthLayout
      left={
        <AuthCard
          title="Welcome back"
          subtitle="Sign in to discover and book amazing venues."
          footer={
            <>
              New here?{' '}
              <Link to="/register" className="font-medium text-brand hover:text-brand-hover">
                Create an account
              </Link>
            </>
          }
        >
          <div className="mb-7">
            <Logo />
          </div>
          <LoginForm />
        </AuthCard>
      }
      right={<VenueFlowPanel />}
    />
  )
}
