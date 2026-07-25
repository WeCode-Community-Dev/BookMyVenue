import { Role } from "@prisma/client";

export type SignupCachePayload = {
    email: string;
    name: string;
    passwordHash: string;
    role: Role;
    otpHash: string;
};