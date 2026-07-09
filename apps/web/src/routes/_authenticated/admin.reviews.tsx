import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listAllReviews, deleteReview } from "@/server-adapters/admin.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: AdminReviews,
});

function AdminReviews() {
  const fn = useServerFn(listAllReviews);
  const del = useServerFn(deleteReview);
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["admin-reviews"], queryFn: () => fn() });

  async function remove(id: string) {
    if (!confirm("Delete this review?")) return;
    await del({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
  }

  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/5 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 text-[11px] uppercase tracking-widest text-lead/40 font-bold text-left">
          <tr>
            <th className="px-4 py-3">When</th>
            <th className="px-4 py-3">Venue</th>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Feedback</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-950/5">
          {isLoading && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-lead/50">
                Loading…
              </td>
            </tr>
          )}
          {data.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3">{r.venues?.name ?? "—"}</td>
              <td className="px-4 py-3 text-xs">{r.user?.email ?? "—"}</td>
              <td className="px-4 py-3">
                {"★".repeat(r.rating)}
                <span className="text-lead/20">{"★".repeat(5 - r.rating)}</span>
              </td>
              <td className="px-4 py-3 text-xs max-w-md truncate">{r.feedback ?? ""}</td>
              <td className="px-4 py-3 text-right">
                <Button size="sm" variant="destructive" onClick={() => remove(r.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {!isLoading && data.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-lead/50">
                No reviews.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
