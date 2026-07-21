import { createContext, useContext, useEffect, useState } from 'react'
import {
  createClient,
  onAuthStateChange,
  signInWithEmail,
  signUpWithEmail,
  signOut as supabaseSignOut,
  type SignInInput,
  type SignUpInput,
} from '@venue404/api-client'
import { authEndpoints, type AuthUser } from '@venue404/api-client'

type AuthState = {
  user: AuthUser | null
  loading: boolean
  signIn: (input: SignInInput) => Promise<void>
  signUp: (input: SignUpInput) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadUser() {
    try {
      const client = createClient()
      const authUser = await authEndpoints(client).me()
      setUser(authUser)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    const subscription = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
        return
      }

      if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && session) {
        await loadUser()
        setLoading(false)
        return
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(input: SignInInput) {
    await signInWithEmail(input)
  }

  async function signUp(input: SignUpInput) {
    await signUpWithEmail(input)
  }

  async function signOut() {
    await supabaseSignOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
