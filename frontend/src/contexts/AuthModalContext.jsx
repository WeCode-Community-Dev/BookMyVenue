import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"
import AuthModal from "../components/common/AuthModal"

const AuthModalContext = createContext(null)

export function AuthModalProvider({ children }) {
  const [open, setOpen] = useState(false)
  const optionsRef = useRef(null)

  const openAuthModal = useCallback((options = {}) => {
    optionsRef.current = options
    setOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setOpen(false)
    optionsRef.current = null
  }, [])

  const handleAuthSuccess = useCallback(() => {
    optionsRef.current?.onSuccess?.()
    closeAuthModal()
  }, [closeAuthModal])

  const value = useMemo(
    () => ({
      openAuthModal,
      closeAuthModal,
    }),
    [openAuthModal, closeAuthModal],
  )

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal
        open={open}
        onClose={closeAuthModal}
        onSuccess={handleAuthSuccess}
        message={open ? optionsRef.current?.message : undefined}
      />
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider")
  }
  return context
}
