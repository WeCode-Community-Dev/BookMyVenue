
export class AdminGetAllUsersUsecase {

    constructor(userRepository){
        this._userRepository = userRepository
    }

    async execute(search, page, limit){

        const { data, totalPages, totalCount } =
            await this._userRepository.findAllUsers({
                search,
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