import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { categoriesApi } from '../services/categories.api';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import type { Category } from '../types';
import { ChevronLeft, Pencil, Trash2, RotateCcw, Calendar, Layers } from 'lucide-react';
import AddEditModal from '../components/ui/AddEditModal';
import { toast } from 'sonner';

const CategoryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // useAsyncFetch hooks
  const {
    data: fetchResponse,
    loading,
    execute: fetchCategory,
  } = useAsyncFetch<{ success: boolean; message: string; data: Category }>();
  const { loading: actionLoading, execute: executeAction } = useAsyncFetch<any>();

  const category = fetchResponse?.data;

  const loadCategory = () => {
    if (id) {
      fetchCategory(() => categoriesApi.getById(id));
    }
  };

  useEffect(() => {
    loadCategory();
  }, [id]);

  // Soft delete category
  const handleDelete = async () => {
    if (!category) return;
    const catId = category.id || category._id || '';
    if (!window.confirm('Are you sure you want to disable this category?')) return;

    try {
      await executeAction(() => categoriesApi.remove(catId));
      toast.success('Category disabled successfully');
      loadCategory();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to disable category';
      toast.error(msg);
    }
  };

  // Restore category
  const handleRestore = async () => {
    if (!category) return;
    const catId = category.id || category._id || '';
    try {
      await executeAction(() => categoriesApi.restore(catId));
      toast.success('Category restored successfully');
      loadCategory();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to restore category';
      toast.error(msg);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted">Loading category details...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-error/10 border border-error/20 p-4 text-error mb-4">
          <Layers size={32} />
        </div>
        <h2 className="text-xl font-bold text-foreground">Category Not Found</h2>
        <p className="text-sm text-muted mt-2">
          The category you are trying to view does not exist or may have been deleted.
        </p>
        <Link
          to="/admin/categories"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent transition-all"
        >
          <ChevronLeft size={16} /> Back to Categories
        </Link>
      </div>
    );
  }

  const formattedCreated = category.createdAt
    ? new Date(category.createdAt).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  const formattedUpdated = category.updatedAt
    ? new Date(category.updatedAt).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className="space-y-6">
      {/* Top Navigation & Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/categories')}
            className="rounded-xl border border-border bg-background p-2.5 text-muted hover:text-foreground transition-all hover:bg-surface active:scale-95 cursor-pointer"
            title="Back to Categories"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                {category.name}
              </h1>
              {category.isActive ? (
                <span className="inline-flex items-center rounded-lg border border-success/20 bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center rounded-lg border border-error/20 bg-error/10 px-2.5 py-0.5 text-xs font-semibold text-error">
                  Inactive
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted">Category ID: {category.id || category._id}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            disabled={actionLoading}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-border
              bg-background
              px-4
              py-2.5
              text-sm
              font-semibold
              text-foreground
              hover:bg-surface
              transition-all
              disabled:opacity-50
              active:scale-95
              cursor-pointer
            "
          >
            <Pencil size={16} />
            Edit
          </button>

          {category.isActive ? (
            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-error
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-error/20
                hover:bg-error/90
                transition-all
                disabled:opacity-50
                active:scale-95
                cursor-pointer
              "
            >
              <Trash2 size={16} />
              Disable Category
            </button>
          ) : (
            <button
              onClick={handleRestore}
              disabled={actionLoading}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-success
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-success/20
                hover:bg-success/90
                transition-all
                disabled:opacity-50
                active:scale-95
                cursor-pointer
              "
            >
              <RotateCcw size={16} />
              Restore Category
            </button>
          )}
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Info and timestamps */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Category Details
            </h3>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted">Description</span>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {category.description || 'No description provided for this category.'}
              </p>
            </div>
          </div>

          {/* Timestamps Card */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              System Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-background border border-border p-2 text-muted">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
                    Created At
                  </span>
                  <span className="text-xs font-semibold text-foreground">{formattedCreated}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-background border border-border p-2 text-muted">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
                    Last Modified
                  </span>
                  <span className="text-xs font-semibold text-foreground">{formattedUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Image Preview */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4 flex flex-col">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Image Cover
          </h3>

          <div className="relative flex-1 overflow-hidden rounded-2xl border border-border bg-surface flex items-center justify-center min-h-[260px] max-h-[360px]">
            {category.imageUrl && !imageError ? (
              <img
                src={category.imageUrl}
                alt={category.name}
                onError={() => setImageError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-center p-6 flex flex-col items-center justify-center gap-2">
                <Layers className="h-10 w-10 text-muted stroke-[1.2]" />
                <span className="text-xs text-muted">No cover image available</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <AddEditModal
          category={category}
          onClose={() => setModalOpen(false)}
          onSuccess={loadCategory}
        />
      )}
    </div>
  );
};

export default CategoryDetails;
