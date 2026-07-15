import { createContext, useContext, useState } from 'react'
import { AuthModal } from '../components/auth/AuthModal'

type Mode = 'login' | 'register'

type AuthModalState = {
  openLogin: () => void
  openRegister: () => void
  close: () => void
}

// Default no-op state for when used outside provider (e.g., during error recovery)
const DEFAULT_STATE: AuthModalState = {
  openLogin: () => {
    console.warn('useAuthModal.openLogin called outside AuthModalProvider')
  },
  openRegister: () => {
    console.warn('useAuthModal.openRegister called outside AuthModalProvider')
  },
  close: () => {
    console.warn('useAuthModal.close called outside AuthModalProvider')
  },
}

const AuthModalContext = createContext<AuthModalState | null>(null)

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode | null>(null)

  const openLogin = () => setMode('login')
  const openRegister = () => setMode('register')
  const close = () => setMode(null)

  return (
    <AuthModalContext.Provider value={{ openLogin, openRegister, close }}>
      {children}
      {mode && <AuthModal mode={mode} onSwitchMode={setMode} onClose={close} />}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal(): AuthModalState {
  const ctx = useContext(AuthModalContext)
  if (!ctx) return DEFAULT_STATE
  return ctx
}