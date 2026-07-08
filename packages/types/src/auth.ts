import { Role } from "@bookmyvenue/database";

// export type UserRole = Exclude<Role, "ADMIN">;

export interface CustomJwtSessionClaims {
    metadata?: {
        role?: Role;
    };
}
