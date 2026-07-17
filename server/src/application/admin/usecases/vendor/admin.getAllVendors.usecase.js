export class AdminGetAllVendorsUsecase {

    constructor(vendorRepository){
        this._vendorRepository =
            vendorRepository
    }

    async execute(
        search,
        status,
        isBlocked,
        page,
        limit
    ){

        return await
            this._vendorRepository
                .findAllFiltered({
                    search,
                    status,
                    isBlocked,
                    page,
                    limit
                })
    }
}