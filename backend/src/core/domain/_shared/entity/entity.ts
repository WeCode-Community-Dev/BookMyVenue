export abstract class Entity<TId> {
    protected constructor(
        protected readonly _id: TId,
    ) { }

    get id(): TId {
        return this._id;
    }

    equals(entity?: Entity<TId>): boolean {
        if (!entity) return false;

        return this._id === entity._id;
    }
}