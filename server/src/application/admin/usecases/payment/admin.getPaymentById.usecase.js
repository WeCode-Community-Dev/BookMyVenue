import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { PaymentMessages } from "../../../../shared/constants/messages/paymentMessages.js";

export class AdminGetPaymentByIdUsecase {

    constructor(paymentRepository) {

        this._paymentRepository = paymentRepository;

    }

    async execute(paymentId) {

        const payment =
            await this._paymentRepository.findById(paymentId);

        if (!payment) {

            throw new NotFoundError(
                PaymentMessages.error.PAYMENT_NOT_FOUND
            );

        }

        return payment;

    }

}