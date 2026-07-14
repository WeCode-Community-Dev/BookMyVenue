export enum UserRole {
    USER = 'USER',
    VENUE_OWNER = 'VENUE_OWNER',
    ADMIN = 'ADMIN',
}

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthState {
    isLoading: boolean;
    isAuthenticated: boolean;
    user: AuthUser | null;
    tokens: AuthTokens | null;
}

export interface AuthContextValue extends AuthState {
    login: (
        user: AuthUser,
        tokens: AuthTokens,
    ) => void;

    logout: () => void;

    hasRole: (
        ...roles: UserRole[]
    ) => boolean;
}