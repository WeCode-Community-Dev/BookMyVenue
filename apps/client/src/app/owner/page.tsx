"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ensureOwnerRole } from "./actions";

const Onboarding = () => {
    const { getToken } = useAuth();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        ensureOwnerRole()
            .then(() => getToken({ skipCache: true }))
            .then(setToken);
    }, [getToken]);

    return <div>{token}</div>;
};

export default Onboarding;
