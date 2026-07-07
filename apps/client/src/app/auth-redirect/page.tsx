"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ensureOwnerRole } from "@/app/owner/actions";

export default function AuthRedirectPage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) {
            router.replace("/sign-in");
            return;
        }

        const publicRole = user.publicMetadata?.role;
        const intendedRole = user.unsafeMetadata?.role; 
        (async () => {
            if (publicRole !== "OWNER" && intendedRole === "OWNER") {
                await ensureOwnerRole(); 
                await getToken({ skipCache: true }); 
                router.replace("/owner");
                return;
            }
            router.replace(publicRole === "OWNER" ? "/owner" : "/");
        })();
    }, [isLoaded, isSignedIn, user, getToken, router]);

    return null;
}

// "use client";

// import { UserRole } from "@bookmyvenue/types";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function AuthRedirectPage() {
//     const { isLoaded, isSignedIn, user } = useUser();
//     const router = useRouter();

//     useEffect(() => {
//         if (!isLoaded) return;

//         if (!isSignedIn) {
//             router.replace("/sign-in");
//             return;
//         }

//         const role = user.publicMetadata?.role as UserRole | undefined;
//         router.replace(role === "OWNER" ? "/owner" : "/");
//     }, [isLoaded, isSignedIn, user, router]);

//     return null;
// }
