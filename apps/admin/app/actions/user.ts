"use server";

import { unstable_cache } from "next/cache";
import { prisma, Role } from "@bookmyvenue/database";
import { mapOwner, mapCustomer, SELECT_OWNER, SELECT_CUSTOMER } from "./utils";

export type Owner = {
    id: string;
    name: string | null;
    email: string;
    role: Role;
    joined: string;
    venues: number;
};

export type Customer = {
    id: string;
    name: string | null;
    email: string;
    role: Role;
    joined: string;
    bookings: number;
};

export type OwnerPageResult = { owners: Owner[]; total: number };
export type CustomerPageResult = { customers: Customer[]; total: number };

export const fetchOwners = unstable_cache(
    async (page: number, pageSize: number): Promise<OwnerPageResult> => {
        const where = { role: Role.OWNER };
        const [rows, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: SELECT_OWNER,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.user.count({ where }),
        ]);
        return { owners: rows.map((u) => mapOwner(u)), total };
    },
    ["owners"],
    { revalidate: 3 * 60, tags: ["users"] },
);

export const fetchCustomers = unstable_cache(
    async (page: number, pageSize: number): Promise<CustomerPageResult> => {
        const where = { role: Role.USER };
        const [rows, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: SELECT_CUSTOMER,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.user.count({ where }),
        ]);
        return { customers: rows.map((u) => mapCustomer(u)), total };
    },
    ["customers"],
    { revalidate: 3 * 60, tags: ["users"] },
);
