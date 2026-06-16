import type { UserRole } from "./auth.type";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null | undefined;
    status: "ACTIVE" | "INACTIVE";
    role: UserRole;
    createdAt: string;
}


export interface ListUserResponse extends Pagination<User> { }