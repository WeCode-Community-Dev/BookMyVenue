"use client";

import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    className?: string;
    appName: string;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
    return (
        <button
            className={className}
            onClick={() => {
                console.log(appName);
            }}
        >
            {children}
        </button>
    );
};
