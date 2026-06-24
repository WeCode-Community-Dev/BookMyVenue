export class AdminGetAllVendorsUsecase {

    constructor(vendorRepository){
        this._vendorRepository =
            vendorRepository
    }

    async execute(
        search,
        status,
        page,
        limit
    ){

        return await
            this._vendorRepository
                .findAllFiltered({
                    search,
                    status,
                    page,
                    limit
                })
    }
}