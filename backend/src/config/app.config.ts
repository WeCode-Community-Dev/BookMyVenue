import 'dotenv/config'


export const APP_CONFIG = {
    BASE_URL: process.env.BASE_URL!
}

export const PAYMENT_CONFIG = {
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID!,
    RAZORPAY_SECRET: process.env.RAZORPAY_SECRET!,
}