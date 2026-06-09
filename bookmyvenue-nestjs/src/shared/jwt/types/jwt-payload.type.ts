import { Role } from "@prisma/client";

export type JwtPayload = {
    sub: number;
    email: string;
    role: Role;
};