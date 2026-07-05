import bcrypt from "bcryptjs";
import crypto from 'crypto'
import { IHashService } from '../../application/services/hashService.js'

export class HashService extends IHashService {
    async hash(password) {
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)
        return await bcrypt.hash(password, saltRounds);
    }

    async compare(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest("hex")
    }
}

