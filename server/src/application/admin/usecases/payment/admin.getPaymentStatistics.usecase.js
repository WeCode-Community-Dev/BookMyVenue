export class AdminGetPaymentStatisticsUsecase {

    constructor(paymentRepository) {

        this._paymentRepository = paymentRepository;

    }

    async execute() {

        return await this._paymentRepository.getPaymentStatistics();

    }

}