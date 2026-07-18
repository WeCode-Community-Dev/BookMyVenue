import { Link } from "@tanstack/react-router";
import {
  FolderOpen,
  Building2,
  Tag,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const statusConfig = {
  active: {
    label: "Active",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  inactive: {
    label: "Inactive",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

const formatNumber = (value) => {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("en-US").format(value);
};

export function AdminCategoryCard({
  category,
  onEdit,
  onDelete,
  onViewDetails,
  showActions = true,
}) {
  const status = statusConfig[category?.status] || statusConfig.active;

  const handleAction = (callback) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (callback) callback(category);
  };

  return (
    <article
      role="article"
      aria-label={`Category: ${category?.name || "Unnamed category"}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {category?.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <FolderOpen className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold leading-tight">
            {category?.name || "Unnamed category"}
          </h3>
          {category?.slug && (
            <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
              <Tag className="h-3.5 w-3.5" />
              <span className="max-w-[100px] truncate text-xs">
                {category.slug}
              </span>
            </div>
          )}
        </div>

        <div className="mb-4 space-y-2 text-sm text-muted-foreground">
          {category?.description && (
            <p className="line-clamp-2 text-sm leading-relaxed">
              {category.description}
            </p>
          )}
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0" />
            <span>{formatNumber(category?.venueCount)} venues</span>
          </div>
        </div>

        {showActions && (
          <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-2">
            {onViewDetails && (
              <Link
                to="/admin/categories/$categoryId"
                params={{ categoryId: category?.id }}
                className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </Link>
            )}

            {onEdit && (
              <Link
                to="/admin/categories/$categoryId/edit"
                params={{ categoryId: category?.id }}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                onClick={(e) => e.stopPropagation()}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Link>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={handleAction(onDelete)}
                className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default AdminCategoryCard;
