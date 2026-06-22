"use server";

import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function ensureOwnerRole() {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { role: "OWNER" },
    });
}
