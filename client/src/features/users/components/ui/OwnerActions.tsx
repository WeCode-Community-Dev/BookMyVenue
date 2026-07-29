import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface OwnerActionsProps {
  loading?: boolean;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

export default function OwnerActions({ loading = false, onApprove, onReject }: OwnerActionsProps) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState('');

  const handleRejectSubmit = () => {
    if (!reason.trim()) return;

    onReject(reason);
    setReason('');
    setShowRejectForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onApprove}
          disabled={loading}
          className="
            inline-flex items-center gap-2
            rounded-md
            bg-emerald-600
            px-3 py-1.5
            text-xs font-semibold text-white
            hover:bg-emerald-700
            transition
            disabled:opacity-50
          "
        >
          <CheckCircle2 size={14} />
          Approve
        </button>

        <button
          onClick={() => setShowRejectForm(true)}
          disabled={loading}
          className="
            inline-flex items-center gap-2
            rounded-md
            bg-red-600
            px-3 py-1.5
            text-xs font-semibold text-white
            hover:bg-red-700
            transition
            disabled:opacity-50
          "
        >
          <XCircle size={14} />
          Reject
        </button>
      </div>

      {/* Reject Form */}
      {showRejectForm && (
        <div className="space-y-3 border-t border-border pt-3">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Rejection Reason
          </label>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Enter reason..."
            className="
              w-full
              rounded-md
              border border-border
              bg-background
              px-3 py-2
              text-xs
              focus:outline-none
              focus:ring-2
              focus:ring-primary/20
            "
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowRejectForm(false);
                setReason('');
              }}
              className="
                rounded-md
                border border-border
                px-3 py-1.5
                text-xs font-medium
                text-muted
                hover:bg-surface
                transition
              "
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!reason.trim()}
              onClick={handleRejectSubmit}
              className="
                rounded-md
                bg-primary
                px-3 py-1.5
                text-xs font-semibold text-white
                hover:bg-primary/90
                disabled:opacity-50
                transition
              "
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
