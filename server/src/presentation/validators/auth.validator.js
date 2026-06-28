export const registerValidation = (req, res, next) => {
    const { fullName, email, phone, password } = req.body;

    const errors = [];

    // Validate fullName
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
        errors.push("Full name is required and must be at least 2 characters");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Valid email is required");
    }

    // Validate phone format (basic validation for international format)
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    if (!phone || !phoneRegex.test(phone)) {
        errors.push("Valid phone number is required");
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
        errors.push(
            "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
        );
    }

    if (errors.length > 0) {
        return res.status(400).json({
            status: false,
            message: "Validation failed",
            errors
        });
    }

    next();
};

export const verifyOtpValidation = (req, res, next) => {
    const { email, otpCode } = req.body;

    const errors = [];

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Valid email is required");
    }

    // Validate OTP code - must be exactly 6 digits
    if (!otpCode || !/^\d{6}$/.test(otpCode.toString())) {
        errors.push("OTP code must be exactly 6 digits");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            status: false,
            message: "Validation failed",
            errors
        });
    }

    next();
};
