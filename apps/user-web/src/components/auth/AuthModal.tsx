import { Modal, AuthCard, Logo } from '@venue404/ui'
import { AuthModalLoginStep } from './AuthModalLoginStep'
import { RegisterForm } from './RegisterForm'

type Mode = 'login' | 'register'

type Props = {
  mode: Mode
  onSwitchMode: (mode: Mode) => void
  onClose: () => void
}

export function AuthModal({ mode, onSwitchMode, onClose }: Props) {
  return (
    <Modal
      open
      onClose={onClose}
      className="max-w-md"
      overlayClassName="bg-black/10 dark:bg-black/30"
    >
      <div className="relative px-6 py-10 sm:px-10 sm:py-12 min-h-[60dvh]">
        {mode === 'login' ? (
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <Logo />
            </div>
            <h1 className="mb-9 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Log in or sign up
            </h1>
            <div className="text-left">
              <AuthModalLoginStep onSuccess={onClose} />
            </div>
            <p className="mt-8 text-xs text-zinc-400">
              New here?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('register')}
                className="font-medium text-brand hover:text-brand-hover"
              >
                Create an account
              </button>
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <Logo />
            </div>
            <AuthCard title="Create your account" subtitle="Sign up to start discovering and booking venues.">
              <RegisterForm />
              <p className="mt-8 text-center text-xs text-zinc-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => onSwitchMode('login')}
                  className="font-medium text-brand hover:text-brand-hover"
                >
                  Sign in
                </button>
              </p>
            </AuthCard>
          </>
        )}
      </div>
    </Modal>
  )
}
