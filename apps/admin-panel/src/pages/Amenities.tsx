import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Sparkles, Plus, Pencil, Trash2, Search,
  AlertTriangle, CheckCircle2,
} from 'lucide-react'
import { createClient } from '@venue404/api-client'
import { adminAmenityEndpoints } from '@venue404/api-client'
import type { AdminAmenity } from '@venue404/api-client'
import { AdminLayout } from '../components/AdminLayout'
import {
  MetricCard, StatusBadge, SectionHeader,
  EmptyState, LoadingScreen, ErrorState, Button, Modal,
} from '@venue404/ui'

const api = adminAmenityEndpoints(createClient())

const DEBOUNCE_MS = 350

export default function Amenities() {
  const qc = useQueryClient()

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [showArchived, setShowArchived] = useState(false)

  // Create modal
  const [createOpen, setCreateOpen] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createIcon, setCreateIcon] = useState('')

  // Edit modal
  const [editTarget, setEditTarget] = useState<AdminAmenity | null>(null)
  const [editName, setEditName] = useState('')
  const [editIcon, setEditIcon] = useState('')

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<AdminAmenity | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  function handleSearchChange(value: string) {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearch(value), DEBOUNCE_MS)
  }
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  // ── Query ───────────────────────────────────────────────────────────────────

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'amenities'],
    queryFn: () => api.listAmenities({ include_deleted: true }),
  })

  const allAmenities = data?.items ?? []

  // ── Mutations ───────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (input: { name: string; icon: string | null }) =>
      api.createAmenity(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'amenities'] })
      closeCreate()
    },
  })

  const editMutation = useMutation({
    mutationFn: ({ id, name, icon }: { id: string; name: string; icon: string | null }) =>
      api.updateAmenity(id, { name, icon }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'amenities'] })
      closeEdit()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteAmenity(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'amenities'] })
      closeDelete()
    },
  })

  // ── Client-side filtering ───────────────────────────────────────────────────

  const filtered = allAmenities
    .filter((a) => showArchived || !a.deleted_at)
    .filter((a) => !search || a.name.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total: allAmenities.filter((a) => !a.deleted_at).length,
    inUse: allAmenities.filter((a) => !a.deleted_at && a.active_venue_count > 0).length,
    archived: allAmenities.filter((a) => !!a.deleted_at).length,
  }

  // ── Modal helpers ───────────────────────────────────────────────────────────

  function openCreate() {
    setCreateName('')
    setCreateIcon('')
    createMutation.reset()
    setCreateOpen(true)
  }

  function closeCreate() {
    setCreateOpen(false)
    createMutation.reset()
  }

  function openEdit(a: AdminAmenity) {
    setEditTarget(a)
    setEditName(a.name)
    setEditIcon(a.icon ?? '')
    editMutation.reset()
  }

  function closeEdit() {
    setEditTarget(null)
    editMutation.reset()
  }

  function closeDelete() {
    setDeleteTarget(null)
    deleteMutation.reset()
  }

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleCreate() {
    if (!createName.trim()) return
    createMutation.mutate({ name: createName.trim(), icon: createIcon.trim() || null })
  }

  function handleEdit() {
    if (!editTarget || !editName.trim()) return
    editMutation.mutate({ id: editTarget.id, name: editName.trim(), icon: editIcon.trim() || null })
  }

  function handleDelete() {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id)
  }

  const hasFilters = !!(search || showArchived)

  return (
    <AdminLayout pageTitle="Amenities" pageSubtitle="Manage platform-wide amenities that venue owners can assign to their listings">

      {/* Metric strip */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-enter" style={{ '--index': 0 } as React.CSSProperties}>
          <MetricCard
            label="Active Amenities"
            value={isLoading ? '—' : String(stats.total)}
            description="Available for venue owners to select"
            icon={<Sparkles className="h-4 w-4" />}
            accent="brand"
          />
        </div>
        <div className="card-enter" style={{ '--index': 1 } as React.CSSProperties}>
          <MetricCard
            label="In Use"
            value={isLoading ? '—' : String(stats.inUse)}
            description="Assigned to at least one venue"
            icon={<CheckCircle2 className="h-4 w-4" />}
            accent="emerald"
          />
        </div>
        <div className="card-enter" style={{ '--index': 2 } as React.CSSProperties}>
          <MetricCard
            label="Archived"
            value={isLoading ? '—' : String(stats.archived)}
            description="Soft-deleted, hidden from owners"
            icon={<Trash2 className="h-4 w-4" />}
            accent="amber"
          />
        </div>
      </div>

      {/* Table card */}
      <div className="card-enter rounded-xl border border-zinc-200 bg-white shadow-sm" style={{ '--index': 2 } as React.CSSProperties}>

        {/* Card header */}
        <div className="border-b border-zinc-100 px-5 py-4">
          <SectionHeader
            title="All amenities"
            description={
              !isLoading
                ? `${filtered.length} ${filtered.length === 1 ? 'amenity' : 'amenities'}${hasFilters ? ' matching filters' : ''}`
                : undefined
            }
            action={
              <button
                type="button"
                onClick={openCreate}
                className="press inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-zinc-700"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                New amenity
              </button>
            }
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative min-w-[200px] flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search by name…"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>

            {/* Show archived toggle */}
            <label className="flex cursor-pointer items-center gap-2 select-none text-sm text-zinc-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
              />
              Show archived
            </label>
          </div>
        </div>

        {/* Content states */}
        {isLoading && (
          <div className="px-5 py-10">
            <LoadingScreen message="Loading amenities…" fullScreen={false} />
          </div>
        )}

        {!isLoading && error && (
          <div className="px-5 py-10">
            <ErrorState
              title="Could not load amenities"
              message={error instanceof Error ? error.message : 'Failed to load amenities'}
              fullScreen={false}
              action={
                <Button variant="secondary" onClick={() => qc.invalidateQueries({ queryKey: ['admin', 'amenities'] })}>
                  Retry
                </Button>
              }
            />
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="px-5 py-10">
            <EmptyState
              icon={<Sparkles className="h-4 w-4" />}
              title="No amenities found"
              description={
                search
                  ? 'Try adjusting the search term.'
                  : 'Add your first amenity to get started.'
              }
            />
          </div>
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/60">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Amenity</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Venues using it</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Created</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filtered.map((amenity) => (
                  <tr
                    key={amenity.id}
                    className={`transition-colors hover:bg-zinc-50/70 ${amenity.deleted_at ? 'opacity-50' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {amenity.icon ? (
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-base">
                            {amenity.icon}
                          </span>
                        ) : (
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                            <Sparkles className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                          </span>
                        )}
                        <span className="font-medium text-zinc-900">{amenity.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {amenity.active_venue_count > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-brand-light px-2 py-0.5 text-xs font-medium text-brand">
                          {amenity.active_venue_count} {amenity.active_venue_count === 1 ? 'venue' : 'venues'}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">None</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {amenity.deleted_at ? (
                        <StatusBadge label="Archived" variant="neutral" />
                      ) : (
                        <StatusBadge label="Active" variant="success" />
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-zinc-400">
                      {new Date(amenity.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {amenity.deleted_at ? null : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(amenity)}
                            className="press inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(amenity)}
                            className="press inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            Archive
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

      {/* Create Modal */}
      <Modal open={createOpen} onClose={closeCreate} className="max-w-md">
        <div className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
              <Plus className="h-5 w-5 text-zinc-700" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">New amenity</h3>
            <p className="mb-5 text-sm text-zinc-500">
              This amenity will immediately be available for venue owners to add to their listings.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="create-name">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="create-name"
                  type="text"
                  placeholder="e.g. Swimming Pool"
                  value={createName}
                  onChange={(e) => { setCreateName(e.target.value); createMutation.reset() }}
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="create-icon">
                  Icon{' '}
                  <span className="text-zinc-400 text-xs font-normal">(optional: emoji or short text)</span>
                </label>
                <input
                  id="create-icon"
                  type="text"
                  placeholder="e.g. 🏊"
                  value={createIcon}
                  onChange={(e) => setCreateIcon(e.target.value)}
                />
              </div>
            </div>

            {createMutation.error && (
              <p className="mt-3 text-xs font-medium text-red-500">
                {createMutation.error instanceof Error ? createMutation.error.message : 'Failed to create amenity'}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={closeCreate} disabled={createMutation.isPending}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={createMutation.isPending || !createName.trim()}
                className="press rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating…' : 'Create amenity'}
              </button>
            </div>
          </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editTarget !== null} onClose={closeEdit} className="max-w-md">
        <div className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
              <Pencil className="h-5 w-5 text-zinc-700" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Edit amenity</h3>
            <p className="mb-5 text-sm text-zinc-500">
              Changes apply immediately across all venues using this amenity.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={editName}
                  onChange={(e) => { setEditName(e.target.value); editMutation.reset() }}
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="edit-icon">
                  Icon{' '}
                  <span className="text-zinc-400 text-xs font-normal">(optional)</span>
                </label>
                <input
                  id="edit-icon"
                  type="text"
                  placeholder="e.g. 🏊"
                  value={editIcon}
                  onChange={(e) => setEditIcon(e.target.value)}
                />
              </div>
            </div>

            {editMutation.error && (
              <p className="mt-3 text-xs font-medium text-red-500">
                {editMutation.error instanceof Error ? editMutation.error.message : 'Failed to update amenity'}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={closeEdit} disabled={editMutation.isPending}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleEdit}
                disabled={editMutation.isPending || !editName.trim()}
                className="press rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editMutation.isPending ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteTarget !== null} onClose={closeDelete} className="max-w-md">
        <div className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
              <Trash2 className="h-5 w-5 text-red-600" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Archive amenity</h3>
            <p className="mb-4 text-sm text-zinc-500">
              <span className="font-medium text-zinc-800">{deleteTarget?.name}</span> will be hidden from venue owners and can no longer be assigned to new listings.
            </p>

            {/* Active venue warning */}
            {deleteTarget && deleteTarget.active_venue_count > 0 && (
              <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">{deleteTarget.active_venue_count} {deleteTarget.active_venue_count === 1 ? 'venue is' : 'venues are'} currently using this amenity.</span>{' '}
                  Their existing listings will be unaffected, but this amenity won't appear in the picker for new selections.
                </p>
              </div>
            )}

            {deleteMutation.error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {deleteMutation.error instanceof Error ? deleteMutation.error.message : 'Failed to archive amenity'}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeDelete} disabled={deleteMutation.isPending}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="press rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Archiving…' : 'Archive amenity'}
              </button>
            </div>
          </div>
      </Modal>

    </AdminLayout>
  )
}
