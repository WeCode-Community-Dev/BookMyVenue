import { createContext } from "react";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "superAdmin";
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  isError: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
