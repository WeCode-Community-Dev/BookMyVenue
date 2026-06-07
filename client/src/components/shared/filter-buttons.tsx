// src/components/venues/filter-buttons.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const CATEGORIES = [
  { label: "Wedding", value: "wedding" },
  { label: "Birthday", value: "birthday" },
  { label: "Corporate", value: "corporate" },
  { label: "Photo Shoot", value: "photoshoot" },
  { label: "Party", value: "party" },
];

export function FilterButtons() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const currentCategory = searchParams.get("category") || "all";

  const handleFilterClick = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete("category");
      } else {
        params.set("category", value);
      }
      router.push(`/venues?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isActive = currentCategory === cat.value;

        return (
          <button
            key={cat.value}
            onClick={() => handleFilterClick(cat.value)}
            disabled={isPending}
            className={`
              whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all
              ${isActive 
                ? "bg-black text-white shadow-md" 
                : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-white hover:border-gray-300 hover:shadow-sm"
              }
              ${isPending ? "opacity-70 cursor-not-allowed" : ""}
            `}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}