export type UserRole = "USER" | "OWNER" | "ADMIN"

export interface CustomJwtSessionClaims {
    metadata?: {
        role?: UserRole;
    };
}
