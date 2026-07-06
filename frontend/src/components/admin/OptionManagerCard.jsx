import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { showInfo } from "../../utils/toastBus";

// Generic CRUD list card used for both Amenities and Categories on the
// Admin "Venue Options" page. All the actual API calls are passed in as
// props (list/create/update/remove) so this component stays UI-only.
export default function OptionManagerCard({
  title,
  itemLabel, // e.g. "amenity" / "category" — used in copy
  list,
  create,
  update,
  remove,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [savingId, setSavingId] = useState(null);

  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await list();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim() || creating) return;
    setCreating(true);
    try {
      const created = await create(newName.trim());
      setItems((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
      showInfo(`${itemLabel} added`);
    } catch {
      // api client already surfaces the error toast
    } finally {
      setCreating(false);
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setEditValue(item.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  async function saveEdit(id) {
    if (!editValue.trim()) return;
    setSavingId(id);
    try {
      const updated = await update(id, { name: editValue.trim() });
      setItems((prev) =>
        prev
          .map((it) => (it._id === id ? updated : it))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      showInfo(`${itemLabel} updated`);
      cancelEdit();
    } catch {
      // api client already surfaces the error toast
    } finally {
      setSavingId(null);
    }
  }

  async function toggleActive(item) {
    setSavingId(item._id);
    try {
      const updated = await update(item._id, { isActive: !item.isActive });
      setItems((prev) => prev.map((it) => (it._id === item._id ? updated : it)));
    } catch {
      // api client already surfaces the error toast
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await remove(id);
      setItems((prev) => prev.filter((it) => it._id !== id));
      showInfo(`${itemLabel} deleted`);
    } catch {
      // api client already surfaces the error toast
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>

      {/* Add new */}
      <form onSubmit={handleCreate} className="flex gap-2 px-6 py-4 border-b border-gray-100">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={`New ${itemLabel} name...`}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
        />
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          <Plus size={16} />
          Add
        </button>
      </form>

      {/* List */}
      <div className="max-h-105 overflow-y-auto">
        {loading && (
          <p className="py-8 text-center text-sm text-gray-400">Loading {title.toLowerCase()}...</p>
        )}
        {!loading && error && (
          <p className="py-8 text-center text-sm text-red-500">{error}</p>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">No {title.toLowerCase()} yet.</p>
        )}

        {!loading &&
          !error &&
          items.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between gap-3 border-b border-gray-50 px-6 py-3 last:border-b-0"
            >
              {editingId === item._id ? (
                <>
                  <input
                    autoFocus
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(item._id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-red-500"
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => saveEdit(item._id)}
                      disabled={savingId === item._id}
                      className="rounded-lg p-1.5 text-green-600 hover:bg-green-50 disabled:opacity-50"
                      title="Save"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm font-medium text-gray-900">{item.name}</span>
                    {!item.isActive && (
                      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => toggleActive(item)}
                      disabled={savingId === item._id}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium disabled:opacity-50 ${
                        item.isActive
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {item.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>

                    {confirmId === item._id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(item._id)}
                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
