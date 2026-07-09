import { useState } from 'react'
import Modal from '../../Modal'
import Button from '../../Button'
import { formatPaise } from '../../lib/money'

interface RefundDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  amountPaise: number
  currency?: string
  loading?: boolean
}

export function RefundDialog({
  open, onClose, onConfirm, amountPaise, currency = 'INR', loading,
}: RefundDialogProps) {
  const [reason, setReason] = useState('')
  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4 p-2">
        <h2 className="text-lg font-semibold">Refund booking</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 dark:text-zinc-500">
          This will refund <strong>{formatPaise(amountPaise, currency.toUpperCase())}</strong> to the
          guest and cancel the booking.
        </p>
        <textarea
          className="w-full rounded-md border border-zinc-200 dark:border-ink-800 p-2 text-sm"
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={() => onConfirm(reason)} disabled={loading}>
            {loading ? 'Refunding…' : 'Issue refund'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
