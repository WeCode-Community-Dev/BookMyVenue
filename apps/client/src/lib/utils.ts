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

export const formatEnum = (value: string) => {
    return value
        .split("_")
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" ");
};

//  Friday, 10 July 2026
export const formatToDetailedDate = (selectedDate: string | null) => {
    return selectedDate
        ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : null;
};

// 30 Jun 2026
export const fmtDate = (d: string | Date) =>
    new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
