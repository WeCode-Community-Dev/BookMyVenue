import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  LayoutGrid, Plus, Pencil, Trash2, Image, X,
  AlertTriangle, CheckCircle2,
} from 'lucide-react'
import { createClient } from '@venue404/api-client'
import { adminCategoryEndpoints } from '@venue404/api-client'
import type { AdminCategory } from '@venue404/api-client'
import { AdminLayout } from '../components/AdminLayout'
import {
  MetricCard, StatusBadge, SectionHeader,
  EmptyState, LoadingScreen, ErrorState, Button, Modal,
} from '@venue404/ui'

const api = adminCategoryEndpoints(createClient())

export default function Categories() {
  const qc = useQueryClient()

  const [showArchived, setShowArchived] = useState(false)

  // Create modal
  const [createOpen, setCreateOpen] = useState(false)
  const [createSlug, setCreateSlug] = useState('')
  const [createLabel, setCreateLabel] = useState('')
  const [createIcon, setCreateIcon] = useState('')
  const [createSortOrder, setCreateSortOrder] = useState('0')

  // Edit modal
  const [editTarget, setEditTarget] = useState<AdminCategory | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editIcon, setEditIcon] = useState('')
  const [editSortOrder, setEditSortOrder] = useState('0')
  const [editIsActive, setEditIsActive] = useState(true)

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null)

  // Banner upload
  const [bannerTarget, setBannerTarget] = useState<AdminCategory | null>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => api.listCategories({ include_deleted: true }),
  })

  const allCategories = data?.items ?? []

  const filtered = allCategories.filter((c) => showArchived || !c.deleted_at)

  const stats = {
    total: allCategories.filter((c) => !c.deleted_at).length,
    active: allCategories.filter((c) => !c.deleted_at && c.is_active).length,
    archived: allCategories.filter((c) => !!c.deleted_at).length,
  }

  // ── Mutations ───────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (input: { slug: string; label: string; icon: string | null; sort_order: number }) =>
      api.createCategory(input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'categories'] }); closeCreate() },
  })

  const editMutation = useMutation({
    mutationFn: ({ id, ...body }: { id: string; label: string; icon: string | null; sort_order: number; is_active: boolean }) =>
      api.updateCategory(id, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'categories'] }); closeEdit() },
  })

  const bannerMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => {
      const fd = new FormData()
      fd.append('file', file)
      return api.uploadCategoryBanner(id, fd)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'categories'] }); setBannerTarget(null) },
  })

  const deleteBannerMutation = useMutation({
    mutationFn: (id: string) => api.deleteCategoryBanner(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'categories'] }); closeDelete() },
  })

  // ── Modal helpers ───────────────────────────────────────────────────────────

  function openCreate() {
    setCreateSlug(''); setCreateLabel(''); setCreateIcon(''); setCreateSortOrder('0')
    createMutation.reset(); setCreateOpen(true)
  }
  function closeCreate() { setCreateOpen(false); createMutation.reset() }

  function openEdit(c: AdminCategory) {
    setEditTarget(c); setEditLabel(c.label); setEditIcon(c.icon ?? '')
    setEditSortOrder(String(c.sort_order)); setEditIsActive(c.is_active)
    editMutation.reset()
  }
  function closeEdit() { setEditTarget(null); editMutation.reset() }

  function closeDelete() { setDeleteTarget(null); deleteMutation.reset() }

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleCreate() {
    if (!createSlug.trim() || !createLabel.trim()) return
    createMutation.mutate({
      slug: createSlug.trim(),
      label: createLabel.trim(),
      icon: createIcon.trim() || null,
      sort_order: parseInt(createSortOrder, 10) || 0,
    })
  }

  function handleEdit() {
    if (!editTarget || !editLabel.trim()) return
    editMutation.mutate({
      id: editTarget.id,
      label: editLabel.trim(),
      icon: editIcon.trim() || null,
      sort_order: parseInt(editSortOrder, 10) || 0,
      is_active: editIsActive,
    })
  }

  function handleBannerFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !bannerTarget) return
    bannerMutation.mutate({ id: bannerTarget.id, file })
  }

  return (
    <AdminLayout pageTitle="Categories" pageSubtitle="Manage venue categories shown to owners and customers">

      {/* Metric strip */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-enter" style={{ '--index': 0 } as React.CSSProperties}>
          <MetricCard label="Active" value={isLoading ? '—' : String(stats.active)}
            description="Visible to venue owners" icon={<LayoutGrid className="h-4 w-4" />} accent="brand" />
        </div>
        <div className="card-enter" style={{ '--index': 1 } as React.CSSProperties}>
          <MetricCard label="Total" value={isLoading ? '—' : String(stats.total)}
            description="Including inactive" icon={<CheckCircle2 className="h-4 w-4" />} accent="emerald" />
        </div>
        <div className="card-enter" style={{ '--index': 2 } as React.CSSProperties}>
          <MetricCard label="Archived" value={isLoading ? '—' : String(stats.archived)}
            description="Soft-deleted" icon={<Trash2 className="h-4 w-4" />} accent="amber" />
        </div>
      </div>

      {/* Table card */}
      <div className="card-enter rounded-xl border border-zinc-200 bg-white shadow-sm" style={{ '--index': 2 } as React.CSSProperties}>
        <div className="border-b border-zinc-100 px-5 py-4">
          <SectionHeader
            title="All categories"
            description={!isLoading ? `${filtered.length} ${filtered.length === 1 ? 'category' : 'categories'}` : undefined}
            action={
              <button type="button" onClick={openCreate}
                className="press inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-zinc-700">
                <Plus className="h-3.5 w-3.5" />New category
              </button>
            }
          />
          <div className="mt-3">
            <label className="flex cursor-pointer items-center gap-2 select-none text-sm text-zinc-600">
              <input type="checkbox" className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
              Show archived
            </label>
          </div>
        </div>

        {isLoading && <div className="px-5 py-10"><LoadingScreen message="Loading categories…" fullScreen={false} /></div>}

        {!isLoading && error && (
          <div className="px-5 py-10">
            <ErrorState title="Could not load categories"
              message={error instanceof Error ? error.message : 'Failed to load categories'} fullScreen={false}
              action={<Button variant="secondary" onClick={() => qc.invalidateQueries({ queryKey: ['admin', 'categories'] })}>Retry</Button>} />
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="px-5 py-10">
            <EmptyState icon={<LayoutGrid className="h-4 w-4" />} title="No categories found"
              description="Add your first category to get started." />
          </div>
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/60">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Slug</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Banner</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Venues</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Order</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filtered.map((cat) => (
                  <tr key={cat.id} className={`transition-colors hover:bg-zinc-50/70 ${cat.deleted_at ? 'opacity-50' : ''}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {cat.icon && (
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-base">{cat.icon}</span>
                        )}
                        <span className="font-medium text-zinc-900">{cat.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-mono text-zinc-500">{cat.slug}</td>
                    <td className="px-5 py-3.5">
                      {cat.banner_image ? (
                        <div className="flex items-center gap-2">
                          <img src={cat.banner_image} alt={cat.label} loading="lazy"
                            className="h-10 w-16 rounded object-cover border border-zinc-200" />
                          {!cat.deleted_at && (
                            <button type="button" onClick={() => deleteBannerMutation.mutate(cat.id)}
                              className="press rounded p-1 text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        !cat.deleted_at ? (
                          <button type="button"
                            onClick={() => { setBannerTarget(cat); bannerMutation.reset(); setTimeout(() => bannerInputRef.current?.click(), 50) }}
                            className="press inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-500 border border-zinc-200 hover:bg-zinc-50 transition-colors">
                            <Image className="h-3.5 w-3.5" />Upload
                          </button>
                        ) : (
                          <span className="text-xs text-zinc-400">None</span>
                        )
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {cat.venue_count > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-brand-light px-2 py-0.5 text-xs font-medium text-brand">
                          {cat.venue_count} {cat.venue_count === 1 ? 'venue' : 'venues'}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">None</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {cat.deleted_at ? (
                        <StatusBadge label="Archived" variant="neutral" />
                      ) : cat.is_active ? (
                        <StatusBadge label="Active" variant="success" />
                      ) : (
                        <StatusBadge label="Inactive" variant="warning" />
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-zinc-400">{cat.sort_order}</td>
                    <td className="px-5 py-3.5 text-right">
                      {!cat.deleted_at && (
                        <div className="flex items-center justify-end gap-1">
                          <button type="button" onClick={() => openEdit(cat)}
                            className="press inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100">
                            <Pencil className="h-3.5 w-3.5" />Edit
                          </button>
                          <button type="button" onClick={() => setDeleteTarget(cat)}
                            className="press inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50">
                            <Trash2 className="h-3.5 w-3.5" />Archive
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Hidden banner file input */}
      <input ref={bannerInputRef} type="file" accept="image/*" className="hidden"
        onChange={handleBannerFile} />

      {/* Create Modal */}
      <Modal open={createOpen} onClose={closeCreate} className="max-w-md">
        <div className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
              <Plus className="h-5 w-5 text-zinc-700" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">New category</h3>
            <p className="mb-5 text-sm text-zinc-500">Slug is permanent and used in URLs (lowercase, underscores only).</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="create-slug">Slug <span className="text-red-500">*</span></label>
                <input id="create-slug" type="text" placeholder="e.g. banquet_hall"
                  value={createSlug} onChange={(e) => { setCreateSlug(e.target.value); createMutation.reset() }} autoFocus />
              </div>
              <div>
                <label htmlFor="create-label">Label <span className="text-red-500">*</span></label>
                <input id="create-label" type="text" placeholder="e.g. Banquet Hall"
                  value={createLabel} onChange={(e) => { setCreateLabel(e.target.value); createMutation.reset() }} />
              </div>
              <div>
                <label htmlFor="create-icon">Icon <span className="text-zinc-400 text-xs font-normal">(optional emoji)</span></label>
                <input id="create-icon" type="text" placeholder="e.g. 🏛️"
                  value={createIcon} onChange={(e) => setCreateIcon(e.target.value)} />
              </div>
              <div>
                <label htmlFor="create-order">Sort Order</label>
                <input id="create-order" type="number" min={0}
                  value={createSortOrder} onChange={(e) => setCreateSortOrder(e.target.value)} />
              </div>
            </div>
            {createMutation.error && (
              <p className="mt-3 text-xs font-medium text-red-500">
                {createMutation.error instanceof Error ? createMutation.error.message : 'Failed to create category'}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={closeCreate} disabled={createMutation.isPending}>Cancel</Button>
              <button type="button" onClick={handleCreate}
                disabled={createMutation.isPending || !createSlug.trim() || !createLabel.trim()}
                className="press rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50">
                {createMutation.isPending ? 'Creating…' : 'Create category'}
              </button>
            </div>
          </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editTarget !== null} onClose={closeEdit} className="max-w-md">
        <div className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
              <Pencil className="h-5 w-5 text-zinc-700" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Edit category</h3>
            <p className="mb-5 text-sm text-zinc-500">Slug cannot be changed after creation.</p>
            <div className="space-y-4">
              <div>
                <label>Slug</label>
                <input type="text" value={editTarget?.slug ?? ''} disabled className="opacity-50 cursor-not-allowed" />
              </div>
              <div>
                <label htmlFor="edit-label">Label <span className="text-red-500">*</span></label>
                <input id="edit-label" type="text"
                  value={editLabel} onChange={(e) => { setEditLabel(e.target.value); editMutation.reset() }} autoFocus />
              </div>
              <div>
                <label htmlFor="edit-icon">Icon <span className="text-zinc-400 text-xs font-normal">(optional)</span></label>
                <input id="edit-icon" type="text" placeholder="e.g. 🏛️"
                  value={editIcon} onChange={(e) => setEditIcon(e.target.value)} />
              </div>
              <div>
                <label htmlFor="edit-order">Sort Order</label>
                <input id="edit-order" type="number" min={0}
                  value={editSortOrder} onChange={(e) => setEditSortOrder(e.target.value)} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-zinc-300"
                  checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} />
                <span className="text-sm text-zinc-700">Active (visible to venue owners)</span>
              </label>
            </div>
            {editMutation.error && (
              <p className="mt-3 text-xs font-medium text-red-500">
                {editMutation.error instanceof Error ? editMutation.error.message : 'Failed to update category'}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={closeEdit} disabled={editMutation.isPending}>Cancel</Button>
              <button type="button" onClick={handleEdit}
                disabled={editMutation.isPending || !editLabel.trim()}
                className="press rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50">
                {editMutation.isPending ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
      </Modal>

      {/* Archive Modal */}
      <Modal open={deleteTarget !== null} onClose={closeDelete} className="max-w-md">
        <div className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Archive category</h3>
            <p className="mb-4 text-sm text-zinc-500">
              <span className="font-medium text-zinc-800">{deleteTarget?.label}</span> will be hidden from venue owners.
            </p>
            {deleteTarget && deleteTarget.venue_count > 0 && (
              <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">{deleteTarget.venue_count} {deleteTarget.venue_count === 1 ? 'venue uses' : 'venues use'} this category.</span>{' '}
                  Existing venues are unaffected but this category won't appear for new venues.
                </p>
              </div>
            )}
            {deleteMutation.error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {deleteMutation.error instanceof Error ? deleteMutation.error.message : 'Failed to archive category'}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeDelete} disabled={deleteMutation.isPending}>Cancel</Button>
              <button type="button" onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
                disabled={deleteMutation.isPending}
                className="press rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                {deleteMutation.isPending ? 'Archiving…' : 'Archive category'}
              </button>
            </div>
          </div>
      </Modal>

    </AdminLayout>
  )
}
