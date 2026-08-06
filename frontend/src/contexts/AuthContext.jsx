import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { fetchCurrentUser } from "../apis/auth"
import {
  REFRESH_TOKEN_KEY,
  TOKEN_KEY,
  USER_KEY,
  clearAuthStorage,
} from "../lib/authStorage"

const AuthContext = createContext(null)

function readStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    clearAuthStorage()
    setUser(null)
  }, [])

  const login = useCallback((authData) => {
    localStorage.setItem(TOKEN_KEY, authData.access_token)
    if (authData.refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, authData.refresh_token)
    }
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user))
    setUser(authData.user)
  }, [])

  const updateUser = useCallback((nextUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return undefined
    }

    let cancelled = false

    fetchCurrentUser()
      .then((currentUser) => {
        if (cancelled) return
        setUser(currentUser)
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser))
      })
      .catch(() => {
        if (cancelled) return
        logout()
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [logout])

  useEffect(() => {
    const onUnauthorized = () => logout()
    window.addEventListener("auth:unauthorized", onUnauthorized)
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized)
  }, [logout])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      updateUser,
    }),
    [user, loading, login, logout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
