import * as argon2 from 'argon2';
import type { IPasswordHasher } from 'src/core/application/users/services/password-hasher.interface';

export class Argon2PasswordHasher implements IPasswordHasher {
    async hash(password: string): Promise<string> {
        return argon2.hash(password);
    }

    async compare(password: string, hashed: string): Promise<boolean> {
        return argon2.verify(hashed, password);
    }
}