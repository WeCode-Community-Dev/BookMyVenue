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
  wishlist?: string[];
  authProvider?: string;
  password?: string;
}

interface AppState {
  user: User | null;
  owner: OwnerDetails | null;
  wishlist: string[];
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User) => void;
  setOwner: (owner: OwnerDetails | null) => void;
  setWishlist: (wishlist: string[]) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      owner: null,
      wishlist: [],
      isAuthenticated: false,
      _hasHydrated: false,

      setAuth: (user) => set({ user, wishlist: user.wishlist || [], isAuthenticated: true }),
      setOwner: (owner) => set({ owner }),
      setWishlist: (wishlist) => set({ wishlist }),
      logout: () => set({ user: null, owner: null, wishlist: [], isAuthenticated: false }),
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
