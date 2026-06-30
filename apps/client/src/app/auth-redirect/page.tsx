import { UserRole } from "@bookmyvenue/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthRedirectPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const role = user.publicMetadata?.role as UserRole | undefined;

    if (role === "OWNER") {
        redirect("/owner");
    }

    redirect("/");
}
