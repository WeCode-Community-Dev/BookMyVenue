import crypto from "crypto";

export class ReservationService {

    constructor(redisClient) {
        this.redisClient = redisClient;
    }

    generateReservationId() {
        return crypto.randomUUID();
    }

    async reserveSlot(key, value, ttl = 600) {
        await this.redisClient.set(
            key,
            JSON.stringify(value),
            "EX",
            ttl
        );
    }

    async getReservation(key) {
        const reservation = await this.redisClient.get(key);

        return reservation ? JSON.parse(reservation) : null;
    }

    async deleteReservation(key) {
        await this.redisClient.del(key);
    }

}