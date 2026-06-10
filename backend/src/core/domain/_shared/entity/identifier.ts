export abstract class Identifier {
    constructor(
        protected readonly value: string,
    ) { }

    toString(): string {
        return this.value;
    }

    equals(other: Identifier): boolean {
        return this.value === other.value;
    }
}