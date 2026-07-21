import { useNavigate } from 'react-router-dom'
import { ForbiddenState } from '@venue404/ui'
import { useAuth } from '../lib/AuthContext'

export default function Forbidden() {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <ForbiddenState
      title="Admin Access Required"
      message="This panel is restricted to Venue404 super admins. If you believe this is a mistake, contact your system administrator."
      action={
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={handleSignOut}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Sign out
          </button>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Sign in with a different account
          </button>
        </div>
      }
    />
  )
}
