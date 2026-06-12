import bcrypt from "bcryptjs";
import IHashService from "../../domain/interfaces/IHashService.js";

class HashService extends IHashService {
    async hash(data, saltRounds = 10) {
        return await bcrypt.hash(data, saltRounds);
    }

    async compare(data, hashed) {
        return await bcrypt.compare(data, hashed);
    }
}

export default new HashService();
