import { producer } from "@/lib/kafka";
import { prisma } from "@bookmyvenue/database";
import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
        return new Response("Webhook secret not configured", { status: 500 });
    }

    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
        return new Response("Missing svix headers", { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let event: WebhookEvent;

    try {
        event = wh.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        }) as WebhookEvent;
    } catch {
        return new Response("Invalid webhook signature", { status: 400 });
    }

    if (event.type === "user.created") {
        const { id, email_addresses, first_name, last_name, unsafe_metadata } = event.data;

        const email = email_addresses[0]?.email_address;
        if (!email) {
            return new Response("No email found", { status: 400 });
        }

        const name = [first_name, last_name].filter(Boolean).join(" ") || email.split("@")[0];

        const role = (unsafe_metadata?.role as string) === "OWNER" ? "OWNER" : "USER";

        // if (role === "USER") {
            const clerk = await clerkClient();
            await clerk.users.updateUserMetadata(id, {
                publicMetadata: { role },
            });
        // }

        await prisma.user.create({
            data: { id, email, name, role },
        });

        await producer.send("user-created", {
            userId: id,
            email,
            name,
            role,
        });
    }

    return new Response("OK", { status: 200 });
}
