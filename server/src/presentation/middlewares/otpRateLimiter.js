/**
 * Rate limiting middleware to prevent brute force attacks on OTP verification
 * Limits OTP verification attempts to 5 per email per 15 minutes
 */

const otpAttempts = new Map();

const MAX_ATTEMPTS = 5;
const TIME_WINDOW = 15 * 60 * 1000; // 15 minutes

export const otpRateLimiter = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            status: false,
            message: "Email is required"
        });
    }

    const now = Date.now();
    const key = `otp_${email}`;

    // Get or initialize attempt record
    const attempt = otpAttempts.get(key) || { count: 0, resetTime: now + TIME_WINDOW };

    // Reset counter if time window has passed
    if (now > attempt.resetTime) {
        attempt.count = 0;
        attempt.resetTime = now + TIME_WINDOW;
    }

    // Check if max attempts exceeded
    if (attempt.count >= MAX_ATTEMPTS) {
        const remainingTime = Math.ceil((attempt.resetTime - now) / 1000);
        return res.status(429).json({
            status: false,
            message: `Too many OTP verification attempts. Please try again in ${remainingTime} seconds.`,
            retryAfter: remainingTime
        });
    }

    // Increment attempt counter
    attempt.count++;
    otpAttempts.set(key, attempt);

    next();
};

/**
 * Cleanup function to remove old entries (call periodically)
 */
export const cleanupOtpAttempts = () => {
    const now = Date.now();
    for (const [key, attempt] of otpAttempts.entries()) {
        if (now > attempt.resetTime) {
            otpAttempts.delete(key);
        }
    }
};

// Run cleanup every 30 minutes
setInterval(cleanupOtpAttempts, 30 * 60 * 1000);
