import Modal from '../../Modal'
import Button from '../../Button'
import { formatPaise } from '../../lib/money'

interface ConfirmPaymentDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  amountPaise: number
  currency?: string
  venueName?: string
  loading?: boolean
}

export function ConfirmPaymentDialog({
  open, onClose, onConfirm, amountPaise, currency = 'INR', venueName, loading,
}: ConfirmPaymentDialogProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4 p-2">
        <h2 className="text-lg font-semibold">Pay token advance</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 dark:text-zinc-500">
          You're about to pay a token advance of{' '}
          <strong>{formatPaise(amountPaise, currency.toUpperCase())}</strong>
          {venueName ? ` to confirm ${venueName}` : ''}. This confirms your booking and blocks the slot.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm} disabled={loading}>
            {loading ? 'Processing…' : 'Pay & confirm'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
