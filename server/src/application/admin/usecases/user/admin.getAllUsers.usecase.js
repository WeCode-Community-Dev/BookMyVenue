
export class AdminGetAllUsersUsecase {

    constructor(userRepository){
        this._userRepository = userRepository
    }

    async execute(search, isBlocked,page, limit){

        const { data, totalPages, totalCount } =
            await this._userRepository.findAllFiltered({
                search,
                isBlocked,
                page,
                limit
            })

        return {
            data,
            totalPages,
            totalCount
        }
    }
} 