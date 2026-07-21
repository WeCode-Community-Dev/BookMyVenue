import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { AuthLayout, AuthCard, Logo } from '@venue404/ui'
import { VenueFlowPanel } from '../components/VenueFlowPanel'
import { RegisterForm } from '../components/auth/RegisterForm'

export default function Register() {
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
          title="Create your account"
          subtitle="Sign up to start discovering and booking venues."
          footer={
            <>
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-brand hover:text-brand-hover">
                Sign in
              </Link>
            </>
          }
        >
          <div className="mb-7">
            <Logo />
          </div>
          <RegisterForm />
        </AuthCard>
      }
      right={<VenueFlowPanel />}
    />
  )
}
