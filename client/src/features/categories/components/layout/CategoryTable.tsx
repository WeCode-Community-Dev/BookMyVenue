import React from 'react';
import type { Category } from '../../types';
import { FolderOpen, Pencil, Trash2, RotateCcw, Eye, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Table, type Column } from '@/shared/components/ui';

type Props = {
  categories: Category[];
  onEdit?: (category: Category) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  isActionLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const CategoryAvatar: React.FC<{ imageUrl?: string; name: string }> = ({ imageUrl, name }) => {
  const [imageError, setImageError] = React.useState(false);
  return (
    <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-border bg-background shadow-inner flex items-center justify-center">
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={name}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <Layers className="h-5 w-5 text-muted stroke-[1.5]" />
      )}
    </div>
  );
};

const CategoryTable: React.FC<Props> = ({
  categories,
  onEdit,
  onDelete,
  onRestore,
  isActionLoading = false,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const columns: Column<Category>[] = [
    {
      header: 'Image',
      accessor: (cat) => <CategoryAvatar imageUrl={cat.imageUrl} name={cat.name} />,
      className: 'w-20',
    },
    {
      header: 'Category',
      accessor: (cat) => (
        <div>
          <div className="font-semibold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">
            {cat.name}
          </div>
          <div className="max-w-xs text-xs text-muted truncate mt-0.5" title={cat.description}>
            {cat.description || 'No description provided.'}
          </div>
        </div>
      ),
    },
    {
      header: 'Date Created',
      accessor: (cat) =>
        cat.createdAt
          ? new Date(cat.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'N/A',
      className: 'hidden md:table-cell text-xs font-medium text-muted',
    },
    {
      header: 'Status',
      accessor: (cat) =>
        cat.isActive ? (
          <span className="inline-flex items-center rounded-lg border border-success/20 bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center rounded-lg border border-error/20 bg-error/10 px-2.5 py-1 text-xs font-semibold text-error">
            Inactive
          </span>
        ),
      className: 'w-32',
    },
    {
      header: 'Actions',
      accessor: (cat) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            to={`/admin/categories/${cat.id || cat._id}`}
            title="View Details"
            className="rounded-lg p-2 text-muted hover:bg-background hover:text-foreground transition-all"
          >
            <Eye size={16} />
          </Link>
          <button
            onClick={() => onEdit?.(cat)}
            disabled={isActionLoading}
            title="Edit Category"
            className="rounded-lg p-2 text-muted hover:bg-background hover:text-primary transition-all disabled:opacity-40"
          >
            <Pencil size={16} />
          </button>
          {cat.isActive ? (
            <button
              onClick={() => onDelete?.(cat.id || cat._id || '')}
              disabled={isActionLoading}
              title="Delete Category"
              className="rounded-lg p-2 text-muted hover:bg-error/10 hover:text-error transition-all disabled:opacity-40"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <button
              onClick={() => onRestore?.(cat.id || cat._id || '')}
              disabled={isActionLoading}
              title="Restore Category"
              className="rounded-lg p-2 text-muted hover:bg-success/10 hover:text-success transition-all disabled:opacity-40"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      ),
      className: 'w-40 text-right',
    },
  ];

  return (
    <Table<Category>
      columns={columns}
      data={categories}
      pagination={{
        page: currentPage,
        totalPages: totalPages,
        total: 0,
        limit: 10,
      }}
      onPageChange={onPageChange}
      itemName="category"
      emptyState={
        <div className="flex flex-col items-center justify-center py-4 gap-3">
          <div className="rounded-full bg-background border border-border p-4 text-muted">
            <FolderOpen size={32} className="stroke-[1.2]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">No Categories Found</p>
            <p className="text-xs text-muted mt-1">
              Try adjusting your search terms or create a new category.
            </p>
          </div>
        </div>
      }
    />
  );
};

export default CategoryTable;
