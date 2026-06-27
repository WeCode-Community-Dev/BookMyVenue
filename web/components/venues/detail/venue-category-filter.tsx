import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type VenueCategoryFilterProps = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

export function VenueCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: VenueCategoryFilterProps) {
  const options = ["All", ...categories];

  return (
    <Card className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
      <CardContent className="flex flex-col gap-4 p-5">
        <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
          Category Filter
        </p>
        <div className="flex flex-wrap gap-2">
          {options.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  isActive
                    ? "border-surface-tint bg-surface-tint text-on-primary"
                    : "border-outline-variant/60 bg-transparent text-on-surface-variant hover:border-surface-tint/50 hover:text-on-surface",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
