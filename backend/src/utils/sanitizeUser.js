const sanitizeUser = (user) => {
    if (!user) {
        return null;
    }

    const doc = user.toObject ? user.toObject() : user;

    const {
        password,
        otp,
        otpExpiresAt,
        __v,
        ...safeUser
    } = doc;

    return safeUser;
};

export default sanitizeUser;
