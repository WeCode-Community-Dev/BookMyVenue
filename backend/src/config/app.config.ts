import 'dotenv/config'
import { cleanEnv, port, str } from 'envalid'


cleanEnv(process.env, {
    PORT: port(),
    BASE_URL: str(),
    RAZORPAY_KEY_ID: str(),
    RAZORPAY_SECRET: str(),
    NOVU_SECRET_KEY: str(),
    DATABASE_URL: str()
})


export const APP_CONFIG = {
    BASE_URL: process.env.BASE_URL!
}

export const PAYMENT_CONFIG = {
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID!,
    RAZORPAY_SECRET: process.env.RAZORPAY_SECRET!,
}

export const NOTIFICATION_CONFIG = {
    NOVU_SECRET_KEY: process.env.NOVU_SECRET_KEY!
}

export const DB_CONFIG = {
    DATABASE_URL: process.env.DATABASE_URL!
}