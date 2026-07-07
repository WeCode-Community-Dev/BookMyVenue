/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  Power,
} from "lucide-react";
import { showInfo } from "../../utils/toastBus";

export default function OptionManagerTable({
  title,
  itemLabel,
  list,
  create,
  update,
  remove,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [newName, setNewName] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const data = await list();

      setItems(
        data.sort((a, b) => a.name.localeCompare(b.name))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function handleCreate() {
    if (!newName.trim()) return;

    try {
      const created = await create(newName.trim());

      setItems((prev) =>
        [...prev, created].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );

      setNewName("");
      setShowCreate(false);

      showInfo(`${itemLabel} added`);
    } catch {
      // handled by api client
    }
  }

  async function save(id) {
    if (!editValue.trim()) return;

    try {
      const updated = await update(id, {
        name: editValue.trim(),
      });

      setItems((prev) =>
        prev
          .map((item) =>
            item._id === id ? updated : item
          )
          .sort((a, b) =>
            a.name.localeCompare(b.name)
          )
      );

      setEditingId(null);
      setEditValue("");

      showInfo(`${itemLabel} updated`);
    } catch {
      // handled by api client
    }
  }

  async function toggle(item) {
    try {
      const updated = await update(item._id, {
        isActive: !item.isActive,
      });

      setItems((prev) =>
        prev.map((it) =>
          it._id === item._id ? updated : it
        )
      );
    } catch {
      // handled by api client
    }
  }

  async function handleDelete(id) {
    try {
      await remove(id);

      setItems((prev) =>
        prev.filter((item) => item._id !== id)
      );

      showInfo(`${itemLabel} deleted`);
    } catch {
      // handled by api client
    }
  }

  const filtered = useMemo(() => {
    return items.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [items, search]);

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          <Plus size={16} />
          Add {itemLabel}
        </button>

        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-red-500"
        />
      </div>

      {/* Create Row */}
      {showCreate && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={`Enter ${itemLabel.toLowerCase()} name`}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-red-500"
            />

            <button
              onClick={handleCreate}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Add
            </button>

            <button
              onClick={() => {
                setShowCreate(false);
                setNewName("");
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr className="text-left text-sm font-medium text-gray-600">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={3}
                  className="py-12 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td
                  colSpan={3}
                  className="py-12 text-center text-red-500"
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              filtered.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    {editingId === item._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) =>
                            setEditValue(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              save(item._id);

                            if (e.key === "Escape") {
                              setEditingId(null);
                              setEditValue("");
                            }
                          }}
                          className="w-72 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        />

                        <button
                          onClick={() =>
                            save(item._id)
                          }
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check size={18} />
                        </button>

                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditValue("");
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <span className="font-medium text-gray-900">
                        {item.name}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={
                        item.isActive
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      {item.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setEditingId(item._id);
                          setEditValue(item.name);
                        }}
                        className="text-gray-500 transition hover:text-gray-800"
                        title="Edit"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => toggle(item)}
                        className={`transition ${
                          item.isActive
                            ? "text-orange-500 hover:text-orange-600"
                            : "text-green-600 hover:text-green-700"
                        }`}
                        title={
                          item.isActive
                            ? "Deactivate"
                            : "Activate"
                        }
                      >
                        <Power size={17} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(item._id)
                        }
                        className="text-red-600 transition hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading &&
              !error &&
              filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-12 text-center text-gray-500"
                  >
                    No {title.toLowerCase()} found.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </>
  );
}