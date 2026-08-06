"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { Role } from "@bookmyvenue/database";

const ProfileButton = () => {
    const router = useRouter();
    const { user } = useUser();
    const role = user?.publicMetadata?.role as Role;

    return (
        <UserButton>
            <UserButton.MenuItems>
                <UserButton.Action
                    label="My Bookings"
                    labelIcon={<ShoppingBag className="w-4 h-4" />}
                    onClick={() => router.push("/bookings")}
                />
                {role === "OWNER" && (
                    <UserButton.Action
                        label="Owner Portal"
                        labelIcon={<LayoutDashboard className="w-4 h-4" />}
                        onClick={() => router.push("/owner")}
                    />
                )}
            </UserButton.MenuItems>
        </UserButton>
    );
};

export default ProfileButton;
