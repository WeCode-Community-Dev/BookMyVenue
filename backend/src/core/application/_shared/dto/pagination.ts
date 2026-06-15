export class Pagination<T> {
    constructor(
        public readonly data: T[],
        public readonly total: number,
        public readonly page: number,
        public readonly limit: number,
    ) { }

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
            totalPages: this.totalPages,
            hasNext: this.hasNext,
            hasPrevious: this.hasPrevious,
        }
    }
}