export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}
