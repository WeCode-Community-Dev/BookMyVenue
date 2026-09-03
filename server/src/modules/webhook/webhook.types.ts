import type { RazorpayWebhookNotes } from '../booking/booking.types';

export interface RazorpayPaymentEntity {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  method?: string;
  notes: RazorpayWebhookNotes;
}

export interface RazorpayWebhookPayload {
  event: string;
  payload?: {
    payment?: {
      entity?: RazorpayPaymentEntity;
    };
  };
}
