import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ChevronDown, ChevronRight } from 'lucide-react';

function statusBadge(status) {
  const map = {
    DRAFT:           'bg-gray-100 text-gray-600',
    EDIT_DRAFT:      'bg-yellow-100 text-yellow-700',
    PENDING:         'bg-blue-100 text-blue-700',
    APPROVED:        'bg-green-100 text-green-700',
    REJECTED:        'bg-red-100 text-red-600',
    CHANGES_PENDING: 'bg-orange-100 text-orange-700',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
}

function VenueRow({ venue, onAction }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [showReason, setShowReason] = useState(false);

  async function handle(action) {
    setBusy(true);
    try {
      await onAction(action, venue);
    } finally {
      setBusy(false);
    }
  }

  const canSubmit  = ['DRAFT', 'EDIT_DRAFT'].includes(venue.status);
  const isApproved = venue.status === 'APPROVED';
  // A rejected venue (Rejected tab) re-enters editing via the reEdit action, which
  // flips it back to a draft state on the backend before opening the edit form.
  const isRejected = venue.status === 'REJECTED';
  // Backend only hard-deletes DRAFT / EDIT_DRAFT; hide the button elsewhere.
  const canDelete  = ['DRAFT', 'EDIT_DRAFT'].includes(venue.status);

  // For a live (APPROVED) venue, editStatus describes its edit copy:
  //   CHANGES_PENDING → edits already submitted; block re-editing until reviewed.
  //   REJECTED        → last edit was rejected; re-edit happens from the Rejected tab.
  //   EDIT_DRAFT      → an edit is in progress; the button resumes it.
  //   null/undefined  → no edit copy yet; the button starts one.
  const editInReview = isApproved && venue.editStatus === 'CHANGES_PENDING';
  const editRejected = isApproved && venue.editStatus === 'REJECTED';
  const editLabel = isApproved && venue.editStatus === 'EDIT_DRAFT' ? 'Resume edit' : 'Edit';

  // Only rejected venues that carry an admin reason get the expandable panel.
  const hasReason = isRejected && !!venue.rejectionReason;

  // Slots are configured on the original venue document, never on an edit copy
  // (editOf set) — the owner manages slots from the original row instead.
  const canManageSlots = venue.editOf === null || venue.editOf === undefined;

  return (
    <>
    <tr className="border-b last:border-0 hover:bg-gray-50">
      <td className="py-3 px-4 text-sm font-medium text-gray-900 max-w-xs truncate">{venue.name}</td>
      <td className="py-3 px-4 text-sm text-gray-500">{venue.city || '—'}</td>
      <td className="py-3 px-4">
        {statusBadge(venue.status)}
        {hasReason && (
          <button
            onClick={() => setShowReason((v) => !v)}
            className="ml-2 inline-flex items-center gap-0.5 text-xs text-red-600 hover:text-red-700 cursor-pointer"
            aria-expanded={showReason}
          >
            {showReason ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            {showReason ? 'Hide reason' : 'View reason'}
          </button>
        )}
      </td>
      <td className="py-3 px-4 text-sm text-gray-500">
        {venue.isActive ? (
          <span className="text-green-600 text-xs font-medium">Visible</span>
        ) : (
          <span className="text-gray-400 text-xs font-medium">Hidden</span>
        )}
      </td>
      <td className="py-3 px-4 text-sm text-right">
        <div className="flex items-center justify-end gap-2 flex-wrap">
          {canSubmit && (
            <button
              disabled={busy}
              onClick={() => handle('submit')}
              className="px-3 py-1 text-xs border border-blue-500 text-blue-600 rounded hover:bg-blue-50 disabled:opacity-50 cursor-pointer"
            >
              Submit
            </button>
          )}
          {editInReview ? (
            <span
              title="Your edits have been submitted for approval. You can edit again once an admin reviews and approves them."
              className="inline-flex items-center gap-1 px-3 py-1 text-xs border border-gray-200 text-gray-400 rounded cursor-not-allowed"
            >
              Edit
              <Info size={13} />
            </span>
          ) : editRejected ? (
            <span
              title="This venue's edit was rejected by an admin. Open the Rejected tab to see the reason and edit it again."
              className="inline-flex items-center gap-1 px-3 py-1 text-xs border border-gray-200 text-gray-400 rounded cursor-not-allowed"
            >
              Edit
              <Info size={13} />
            </span>
          ) : isRejected ? (
            <button
              disabled={busy}
              onClick={() => handle('reEdit')}
              className="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              Edit again
            </button>
          ) : (
            <button
              disabled={busy}
              onClick={() => handle('edit')}
              className="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              {editLabel}
            </button>
          )}
          {canManageSlots && (
            <button
              disabled={busy}
              onClick={() => navigate(`/venue-owner/venues/${venue._id}/slots`)}
              className="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              Manage Slots
            </button>
          )}
          {isApproved && (
            venue.isActive ? (
              <button
                disabled={busy}
                onClick={() => handle('disable')}
                className="px-3 py-1 text-xs border border-gray-300 text-gray-500 rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
              >
                Disable
              </button>
            ) : (
              <button
                disabled={busy}
                onClick={() => handle('enable')}
                className="px-3 py-1 text-xs border border-green-400 text-green-600 rounded hover:bg-green-50 disabled:opacity-50 cursor-pointer"
              >
                Enable
              </button>
            )
          )}
          {canDelete && (
            <button
              disabled={busy}
              onClick={() => handle('delete')}
              className="px-3 py-1 text-xs border border-red-300 text-red-500 rounded hover:bg-red-50 disabled:opacity-50 cursor-pointer"
            >
              {venue.status === 'EDIT_DRAFT' ? 'Discard Edit' : 'Delete'}
            </button>
          )}
        </div>
      </td>
    </tr>
    {hasReason && showReason && (
      <tr className="border-b last:border-0 bg-red-50/40">
        <td colSpan={5} className="px-4 pb-4 pt-0">
          <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
              Rejection reason
            </p>
            <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
              {venue.rejectionReason}
            </p>
          </div>
        </td>
      </tr>
    )}
    </>
  );
}

export default function VenueTable({ venues, onAction, emptyText }) {
  if (venues.length === 0) {
    return <p className="py-10 text-center text-gray-400 text-sm">{emptyText}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-xs text-gray-400 uppercase tracking-wide">
            <th className="py-2 px-4 font-medium">Name</th>
            <th className="py-2 px-4 font-medium">City</th>
            <th className="py-2 px-4 font-medium">Status</th>
            <th className="py-2 px-4 font-medium">Visibility</th>
            <th className="py-2 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {venues.map((v) => (
            <VenueRow key={v._id} venue={v} onAction={onAction} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
