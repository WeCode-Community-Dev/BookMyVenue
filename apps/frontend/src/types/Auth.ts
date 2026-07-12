export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: "USER" | "VENUE_OWNER" | "ADMIN";
  profileIssues: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  justLoggedOut: boolean;
}
