import { redisClient } from "../../infrastructure/config/redis.config.js";

export class RedisService {
    async reserveSlot(key, value, ttl = 600) {
        await redisClient.set(
            key,
            JSON.stringify(value),
            "EX",
            ttl
        );
    }

    async getReservation(key) {
        const reservation = await redisClient.get(key);

        return reservation ? JSON.parse(reservation) : null;
    }

    async deleteReservation(key) {
        await redisClient.del(key);
    }
}