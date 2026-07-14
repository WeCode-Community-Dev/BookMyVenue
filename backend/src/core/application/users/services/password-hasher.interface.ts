export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hashed: string): Promise<boolean>;
}
