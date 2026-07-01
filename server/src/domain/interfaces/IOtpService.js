export class IOtpService {
    generate() {
        throw new Error('Method not implemented');
    }

    async hash(otp) {
        throw new Error('Method not implemented');
    }

    async compare(otp, hashedOtp) {
        throw new Error('Method not implemented');
    }

    getExpiry(minutes = 10) {
        throw new Error('Method not implemented');
    }
}
