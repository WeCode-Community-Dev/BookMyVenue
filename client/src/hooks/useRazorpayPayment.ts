import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { useApiMutation } from '@/hooks/useApi';
import { API_ENDPOINTS, RAZORPAY_KEY_ID } from '@/constants';
import { useToast } from '@/hooks/useToast';
import { axiosInstance } from '@/config/axios';
import type {
  CheckoutResponse,
  RazorpaySuccessResponse,
  RazorpayErrorResponse,
} from '@/types/booking.types';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  timeout: number;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      on(event: 'payment.failed', handler: (response: RazorpayErrorResponse) => void): void;
      open(): void;
    };
  }
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-checkout-js')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface UseRazorpayPaymentProps {
  venueName?: string;
  date?: string;
  slotTime?: string;
  amountToPay?: number;
  name: string;
  email: string;
  phone: string;
  onProcessingChange: (isProcessing: boolean) => void;
}

export function useRazorpayPayment({
  venueName,
  date,
  slotTime,
  amountToPay,
  name,
  email,
  phone,
  onProcessingChange,
}: UseRazorpayPaymentProps) {
  const navigate = useNavigate();
  const { error: showError } = useToast();

  const checkoutIdempotencyKeyRef = useRef(crypto.randomUUID());

  const { mutate: initCheckout } = useApiMutation(
    (variables) => ({
      url: API_ENDPOINTS.CHECKOUT,
      method: 'POST',
      data: variables,
      headers: { 'Idempotency-Key': checkoutIdempotencyKeyRef.current },
    }),
    {
      onSuccess: async (data: CheckoutResponse) => {
        const { orderId, amount, currency } = data;
        const res = await loadRazorpayScript();

        if (!res) {
          showError('Failed to load Razorpay SDK. Please check your connection.');
          onProcessingChange(false);
          return;
        }

        const options = {
          key: RAZORPAY_KEY_ID,
          amount,
          currency,
          order_id: orderId,
          name: 'BookMyVenue',
          description: `Booking for ${venueName}`,
          timeout: 540,
          handler: async function (response: RazorpaySuccessResponse) {
            try {
              const verifyRes = await axiosInstance.post('/bookings/verify-payment', {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });

              navigate('/booking/confirmation', {
                state: {
                  paymentId: response.razorpay_payment_id,
                  venueName,
                  date,
                  slotTime,
                  amountToPay,
                  bookingId: verifyRes.data?.data?._id || '',
                  bookingRef: verifyRes.data?.data?.bookingRef || '',
                },
              });
            } catch {
              onProcessingChange(false);
              showError(
                'Payment verification failed. Please contact support if your card was charged.'
              );
            }
          },
          prefill: { name, email, contact: phone },
          theme: { color: '#16a34a' },
          modal: {
            ondismiss: function () {
              onProcessingChange(false);
              showError('Payment cancelled. You can try again before the timer runs out.');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: RazorpayErrorResponse) {
          onProcessingChange(false);
          showError(response.error.description || 'Payment failed');
        });
        rzp.open();
      },
      onError: () => {
        onProcessingChange(false);
      },
    }
  );

  return { initCheckout };
}
