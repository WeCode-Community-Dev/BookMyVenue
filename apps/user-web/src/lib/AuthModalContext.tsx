import { createContext, useContext, useState } from 'react'
import { AuthModal } from '../components/auth/AuthModal'

type Mode = 'login' | 'register'

type AuthModalState = {
  openLogin: () => void
  openRegister: () => void
  close: () => void
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
  if (!ctx) throw new Error('useAuthModal must be used inside AuthModalProvider')
  return ctx
}
