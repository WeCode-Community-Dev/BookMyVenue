import type { PaymentStatus } from "../../_shared/enum/PaymentStatus.enum";
import type { Payment } from "../entities/payment.entity";

export type UpdatePaymentDto = {
    status?: PaymentStatus,
    providerPaymentId?: string
    paidAt?: Date
    failureReason?: string
}

export interface IPaymentRepository {
    findById(id: string): Promise<Payment | null>;
    findAllByBookingId(bookingId: string): Promise<Payment[]>
    findByBookingId(bookingId: string): Promise<Payment | null>;
    findByProviderOrderId(orderId: string): Promise<Payment | null>
    create(Payment: Payment): Promise<void>;
    update(id: string, data: UpdatePaymentDto): Promise<Payment>
}
