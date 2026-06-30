import { AggregateRoot } from '../../_shared/entity/aggregate-root';
import { PaymentStatus } from '../../_shared/enum/PaymentStatus.enum';
import { DomainException } from '../../_shared/exception/domain.exception';

export interface PaymentProps {
    bookingId: string;

    provider: string;

    providerOrderId: string | null;

    providerPaymentId: string | null;

    amount: number;

    currency: string;

    status: PaymentStatus;

    paidAt: Date | null;

    failureReason: string | null;

    createdAt?: Date;

    updatedAt?: Date;
}

export class Payment extends AggregateRoot<string> {

    private constructor(
        id: string,
        private readonly props: PaymentProps,
    ) {
        super(id);

        this.props = {
            ...props,
            providerOrderId: props.providerOrderId ?? null,
            providerPaymentId: props.providerPaymentId ?? null,
            paidAt: props.paidAt ?? null,
            failureReason: props.failureReason ?? null,
            createdAt: props.createdAt ?? new Date(),
            updatedAt: props.updatedAt ?? new Date(),
        };
    }

    public static create(
        id: string,
        props: PaymentProps,
    ): Payment {

        if (!props.bookingId) {
            throw new DomainException('Booking id is required');
        }

        if (!props.provider) {
            throw new DomainException('Payment provider is required');
        }

        if (props.amount <= 0) {
            throw new DomainException('Amount should be greater than 0');
        }

        if (!props.currency) {
            throw new DomainException('Currency is required');
        }

        return new Payment(id, props);
    }

    public static restore(
        id: string,
        props: PaymentProps,
    ): Payment {
        return new Payment(id, props);
    }

    private touch(): void {
        this.props.updatedAt = new Date();
    }

    public setProviderOrderId(orderId: string): void {

        if (this.props.providerOrderId) {
            throw new DomainException('Provider order id already assigned');
        }

        this.props.providerOrderId = orderId;

        this.touch();
    }

    public markPaid(
        providerPaymentId: string,
        paidAt: Date = new Date(),
    ): void {

        if (this.props.status === PaymentStatus.PAID) {
            throw new DomainException('Payment already completed');
        }

        this.props.providerPaymentId = providerPaymentId;

        this.props.status = PaymentStatus.PAID;

        this.props.paidAt = paidAt;

        this.props.failureReason = null;

        this.touch();
    }

    public markFailed(reason: string): void {

        if (this.props.status === PaymentStatus.PAID) {
            throw new DomainException('Paid payment cannot be marked as failed');
        }

        this.props.status = PaymentStatus.FAILED;

        this.props.failureReason = reason;

        this.touch();
    }

    public markInitiated(): void {

        if (this.props.status !== PaymentStatus.PENDING) {
            return;
        }

        this.props.status = PaymentStatus.INITIATED;

        this.touch();
    }

    // Getters

    get bookingId(): string {
        return this.props.bookingId;
    }

    get provider(): string {
        return this.props.provider;
    }

    get providerOrderId(): string | null {
        return this.props.providerOrderId;
    }

    get providerPaymentId(): string | null {
        return this.props.providerPaymentId;
    }

    get amount(): number {
        return this.props.amount;
    }

    get currency(): string {
        return this.props.currency;
    }

    get status(): PaymentStatus {
        return this.props.status;
    }

    get paidAt(): Date | null {
        return this.props.paidAt;
    }

    get failureReason(): string | null {
        return this.props.failureReason;
    }

    get createdAt(): Date {
        return this.props.createdAt!;
    }

    get updatedAt(): Date {
        return this.props.updatedAt!;
    }
}