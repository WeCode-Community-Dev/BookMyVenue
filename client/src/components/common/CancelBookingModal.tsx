import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FiAlertTriangle } from 'react-icons/fi';
import { useApiMutation } from '@/hooks/useApi';
import { API_ENDPOINTS } from '@/constants';
import { useToast } from '@/hooks/useToast';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import type { BookingDetailDTO, CancelBookingResponse } from '@/types/booking.types';

interface CancelBookingModalProps {
  booking: BookingDetailDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CancelBookingModal = ({ booking, open, onOpenChange }: CancelBookingModalProps) => {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const { mutate: cancelBooking, isPending } = useApiMutation<
    CancelBookingResponse,
    { reason?: string }
  >({
    url: API_ENDPOINTS.CANCEL_BOOKING(booking._id),
    method: 'DELETE',
  });

  const handleCancel = () => {
    cancelBooking(
      { reason: reason.trim() || undefined },
      {
        onSuccess: (data: CancelBookingResponse) => {
          // data.refundAmount is in Rupees (sent as amountPaise / 100)
          toast.success(
            `Booking cancelled successfully. Refund of ₹${data.refundAmount} initiated.`
          );
          queryClient.invalidateQueries({ queryKey: ['bookings', 'my'] });
          queryClient.invalidateQueries({ queryKey: ['bookings', booking._id] });
          onOpenChange(false);
          navigate('/my-bookings', { replace: true });
        },
        onError: () => {
          toast.error('Failed to cancel booking');
        },
      }
    );
  };

  const refundAmount = Math.floor(
    booking.totalPrice * ((booking.cancellationRefundPct || 0) / 100)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <FiAlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
          </div>
          <DialogTitle className="text-lg font-bold text-[var(--text-primary)]">
            Cancel Booking
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <p className="text-sm text-[var(--text-secondary)]">
            Are you sure you want to cancel your booking at{' '}
            <span className="font-semibold text-[var(--text-primary)]">{booking.venueName}</span>?
            This action cannot be undone.
          </p>

          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="text-sm font-semibold text-orange-800 mb-1">Cancellation Policy</h4>
            <p className="text-sm text-orange-700">{booking.cancellationPolicy}</p>
          </div>

          <div className="mt-4 p-4 bg-[var(--bg-primary)] border border-[var(--bg-grey)] rounded-lg flex justify-between items-center">
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Estimated Refund
            </span>
            <span className="text-lg font-bold text-[var(--bg-green)]">₹{refundAmount}</span>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Reason for Cancellation (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please tell us why you are cancelling..."
              maxLength={200}
              rows={3}
              className="w-full bg-[var(--bg-primary)] border border-[var(--bg-grey)] rounded-lg p-3 text-sm text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--bg-green)] outline-none resize-none"
            ></textarea>
            <div className="text-right mt-1 text-xs text-[var(--text-secondary)]">
              {reason.length}/200
            </div>
          </div>
        </div>

        <div className="mt-6 sm:flex sm:flex-row-reverse gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={handleCancel}
            className="inline-flex w-full justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            Yes, Cancel Booking
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className="mt-3 inline-flex w-full justify-center rounded-lg bg-[var(--bg-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] shadow-sm ring-1 ring-inset ring-[var(--bg-grey)] hover:bg-[var(--bg-grey)] sm:mt-0 sm:w-auto disabled:opacity-50"
          >
            Keep Booking
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelBookingModal;
