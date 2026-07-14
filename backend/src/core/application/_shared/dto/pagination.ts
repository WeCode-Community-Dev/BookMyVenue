
export interface PaginationFilter {
    limit: number,
    offset: number,
    search?: string
}

type PaginationProps<T> = {
    limit: number,
    offset: number,
    total: number
    data: T[]
}

export class Pagination<T> {

    public readonly page: number
    public readonly total: number
    public readonly offset: number
    public readonly limit: number
    public readonly data: T[]

    constructor(readonly props: PaginationProps<T>) {
        this.page = (props.offset / props.limit) + 1
        this.total = props.total
        this.offset = props.offset
        this.limit = props.limit
        this.data = props.data
    }

    get totalPages(): number {
        return Math.ceil(
            this.total / this.limit,
        );
    }

    get hasNext(): boolean {
        return this.page < this.totalPages;
    }

    get hasPrevious(): boolean {
        return this.page > 1;
    }

    toJSON() {
        return {
            data: this.data,
            total: this.total,
            page: this.page,
            limit: this.limit,
            offset: this.offset,
            totalPages: this.totalPages,
            hasNext: this.hasNext,
            hasPrevious: this.hasPrevious,
        }
    }
}