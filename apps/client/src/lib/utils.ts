import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const fmt12h = (t: string) => {
    if (!t) return "";
    const parts = t.split(":");
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
};
