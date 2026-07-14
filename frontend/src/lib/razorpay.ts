import type { RazorpayCheckoutData } from 'src/api/types/payment.type';

export interface RazorpaySuccessResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

declare global {
    interface Window {
        Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
    }
}

export function loadRazorpayScript(): Promise<boolean> {
    if (typeof window === 'undefined') {
        return Promise.resolve(false);
    }

    if (window.Razorpay) {
        return Promise.resolve(true);
    }

    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(!!window.Razorpay);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export function openRazorpayCheckout(
    checkoutData: RazorpayCheckoutData,
    options: {
        name: string;
        email?: string;
        phone: string;
        description?: string;
        onSuccess: (response: RazorpaySuccessResponse) => void;
        onDismiss?: () => void;
    },
): void {
    if (!window.Razorpay) {
        throw new Error('Razorpay SDK failed to load');
    }

    const rzp = new window.Razorpay({
        key: checkoutData.key,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        order_id: checkoutData.orderId,
        name: 'BookMyVenue',
        description: options.description,
        prefill: {
            name: options.name,
            email: options.email,
            contact: options.phone,
        },
        theme: { color: '#1877F2' },
        handler: options.onSuccess,
        modal: {
            ondismiss: options.onDismiss,
        },
    });

    rzp.open();
}
