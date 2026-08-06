import { useEffect, useRef } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useAuthModal } from "../contexts/AuthModalContext"

function AuthLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  )
}

function UserAuthGate({ message }) {
  const { openAuthModal } = useAuthModal()

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-20">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h2 className="font-serif text-3xl font-semibold text-foreground">
          Sign in required
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {message || "Sign in to access this page."}
        </p>
        <button
          type="button"
          onClick={() => openAuthModal({ message })}
          className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Sign in
        </button>
      </div>
    </div>
  )
}

export function UserProtectedRoute({
  children,
  requiredRole = "user",
  message,
}) {
  const { user, loading, isAuthenticated } = useAuth()
  const { openAuthModal, closeAuthModal } = useAuthModal()
  const location = useLocation()
  const promptedRef = useRef(false)
  const wasAuthenticatedRef = useRef(false)

  useEffect(() => {
    if (!loading && isAuthenticated) {
      wasAuthenticatedRef.current = true
    }
  }, [loading, isAuthenticated])

  useEffect(() => {
    if (loading || isAuthenticated) {
      promptedRef.current = false
      return
    }

    if (wasAuthenticatedRef.current) {
      closeAuthModal()
      return
    }

    if (!promptedRef.current) {
      openAuthModal({
        message: message || "Sign in to access this page.",
      })
      promptedRef.current = true
    }
  }, [loading, isAuthenticated, openAuthModal, closeAuthModal, message])

  if (loading) {
    return <AuthLoading />
  }

  if (!isAuthenticated) {
    if (wasAuthenticatedRef.current) {
      wasAuthenticatedRef.current = false
      return <Navigate to="/" replace />
    }

    return (
      <UserAuthGate
        message={message || "Sign in to access this page."}
      />
    )
  }

  if (requiredRole && user?.role !== requiredRole) {
    if (user?.role === "venue") {
      return (
        <div className="flex min-h-[50vh] items-center justify-center px-4 py-20">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Venue partner account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This page is for customer accounts. Manage your venues from the venue portal.
            </p>
            <Link
              to="/venue"
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Go to venue portal
            </Link>
          </div>
        </div>
      )
    }

    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    )
  }

  return children
}

export function ProtectedRoute({
  children,
  requiredRole,
  loginPath = "/venue/auth",
}) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return <AuthLoading />
  }

  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Navigate
        to={loginPath}
        state={{ wrongRole: true, from: location }}
        replace
      />
    )
  }

  return children
}

export function GuestRoute({
  children,
  allowedRole,
  redirectTo = "/venue",
}) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <AuthLoading />
  }

  if (isAuthenticated && user?.role === allowedRole) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}
