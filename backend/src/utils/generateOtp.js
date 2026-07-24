const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) 
    return { otp, expiresAt }
}

export default generateOtp;
