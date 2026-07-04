export class AdminGetAllPaymentsUsecase {

    constructor(paymentRepository) {

        this._paymentRepository = paymentRepository;

    }

    async execute(

        search,
        paymentStatus,
        paymentMethod,
        paymentType,
        sortBy,
        page,
        limit

    ) {

        return await this._paymentRepository.findAllFiltered({

            search,
            paymentStatus,
            paymentMethod,
            paymentType,
            sortBy,
            page,
            limit

        });

    }

}