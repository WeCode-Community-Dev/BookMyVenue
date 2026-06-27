"use client";

import { UserButton } from "@clerk/nextjs";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

const ProfileButton = () => {
    const router = useRouter();
    return (
        <UserButton>
            <UserButton.MenuItems>
                <UserButton.Action
                    label="My Bookings"
                    labelIcon={<ShoppingBag className="w-4 h-4" />}
                    onClick={() => router.push("/bookings")}
                />
            </UserButton.MenuItems>
        </UserButton>
    );
};

export default ProfileButton;
