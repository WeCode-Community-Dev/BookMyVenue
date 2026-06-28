"use client";

import { Check, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { SpaceCategoryResponse } from "@/services/venueServices";

type SpaceCategorySelectProps = {
  categories: SpaceCategoryResponse[];
  value: string;
  onChange: (categoryId: string) => void;
};

export function SpaceCategorySelect({
  categories,
  value,
  onChange,
}: SpaceCategorySelectProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCategory = categories.find((category) => category.id === value);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(categoryId: string) {
    onChange(categoryId);
    setQuery("");
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2">
      <Label htmlFor="space-category" className="text-sm font-medium text-on-surface">
        Category
      </Label>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="space-category"
          type="search"
          placeholder="Search categories..."
          value={isOpen ? query : selectedCategory?.name ?? query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9"
        />
        {isOpen ? (
          <ul
            role="listbox"
            className="absolute top-full z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-outline-variant/40 bg-background shadow-elevation-1"
          >
            {filteredCategories.length === 0 ? (
              <li className="px-3 py-2 text-sm text-on-surface-variant">
                No categories found
              </li>
            ) : (
              filteredCategories.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={category.id === value}
                    onClick={() => handleSelect(category.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-surface-container-low",
                      category.id === value && "bg-primary-container/20 text-surface-tint"
                    )}
                  >
                    <span>{category.name}</span>
                    {category.id === value ? <Check className="size-4" /> : null}
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
