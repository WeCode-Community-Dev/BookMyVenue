import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import type { IPasswordHasher } from '../../core/application/users/services/password-hasher.interface';

@Injectable()
export class CryptoPasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(`${salt}:${derivedKey.toString('hex')}`);
      });
    });
  }

  async compare(password: string, hashed: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = hashed.split(':');
      if (!salt || !key) {
        resolve(false);
        return;
      }
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(key === derivedKey.toString('hex'));
      });
    });
  }
}
