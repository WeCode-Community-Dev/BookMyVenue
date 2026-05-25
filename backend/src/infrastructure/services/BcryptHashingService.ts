import bcrypt from "bcrypt";
import { HashingService } from "../../application/ports/HashingService";

export class BcryptHashingService implements HashingService {
  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, 12);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
