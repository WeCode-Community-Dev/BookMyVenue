import { randomInt } from "crypto";

export function generateOtp() {
    return randomInt(100000, 1000000).toString();
}