export abstract class ValueObject<T> {
    protected constructor(
        protected readonly props: T,
    ) { }

    equals(vo?: ValueObject<T>): boolean {
        if (!vo) return false;

        return JSON.stringify(this.props)
            === JSON.stringify(vo.props);
    }
}