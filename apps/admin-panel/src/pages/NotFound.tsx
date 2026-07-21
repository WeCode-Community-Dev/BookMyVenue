import { useNavigate } from 'react-router-dom'
import { NotFoundState } from '@venue404/ui'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <NotFoundState
      action={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="press rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
          >
            Go back
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard', { replace: true })}
            className="press rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-hover"
          >
            Dashboard
          </button>
        </div>
      }
    />
  )
}
