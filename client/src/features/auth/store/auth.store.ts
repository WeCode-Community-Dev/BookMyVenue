import { create } from 'zustand';

export type SignupStep = 'details' | 'otp';
export type ForgotPasswordStep = 'details' | 'otp' | 'reset';

interface AuthState {
  signupStep: SignupStep;
  verificationToken: string | null;
  pendingEmail: string | null;

  forgotPasswordStep: ForgotPasswordStep;
  resetToken: string | null;

  resendTimer: number;
  resendCount: number;
  maxResends: number;

  setSignupStep: (step: SignupStep) => void;
  setRegistrationData: (email: string, token: string) => void;
  startResendTimer: () => void;
  tickTimer: () => void;
  resetSignupFlow: () => void;
  incrementResendCount: () => void;

  setForgotPasswordStep: (step: ForgotPasswordStep) => void;
  setForgotPasswordData: (email: string, token: string) => void;
  setResetToken: (token: string) => void;
  resetForgotPasswordFlow: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  signupStep: 'details',
  verificationToken: null,
  pendingEmail: null,

  forgotPasswordStep: 'details',
  resetToken: null,
  resendTimer: 60,
  resendCount: 0,
  maxResends: 3,

  setSignupStep: (step) => set({ signupStep: step }),

  setRegistrationData: (email, token) =>
    set({
      pendingEmail: email,
      verificationToken: token,
      signupStep: 'otp',
      resendTimer: 60,
      resendCount: 0,
    }),

  startResendTimer: () => set({ resendTimer: 60 }),

  tickTimer: () => {
    const current = get().resendTimer;
    if (current > 0) set({ resendTimer: current - 1 });
  },

  incrementResendCount: () => set((state) => ({ resendCount: state.resendCount + 1 })),

  resetSignupFlow: () =>
    set({
      signupStep: 'details',
      verificationToken: null,
      pendingEmail: null,
      resendTimer: 60,
      resendCount: 0,
    }),

  setForgotPasswordStep: (step) => set({ forgotPasswordStep: step }),

  setForgotPasswordData: (email, token) =>
    set({
      pendingEmail: email,
      verificationToken: token,
      forgotPasswordStep: 'otp',
      resendTimer: 60,
      resendCount: 0,
    }),

  setResetToken: (token) => set({ resetToken: token }),

  resetForgotPasswordFlow: () =>
    set({
      forgotPasswordStep: 'details',
      verificationToken: null,
      pendingEmail: null,
      resetToken: null,
      resendTimer: 60,
      resendCount: 0,
    }),
}));
