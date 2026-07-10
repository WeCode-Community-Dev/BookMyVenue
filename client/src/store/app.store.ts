import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface OwnerDetails {
  _id: string;
  userId: string;
  profileImage?: string;
  idProof: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
  };
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  avatar?: string;
  // add other necessary fields
}

interface AppState {
  user: User | null;
  owner: OwnerDetails | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User) => void;
  setOwner: (owner: OwnerDetails | null) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      owner: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setAuth: (user) => set({ user, isAuthenticated: true }),
      setOwner: (owner) => set({ owner }),
      logout: () => set({ user: null, owner: null, isAuthenticated: false }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
