export const ROUTES = {
    AUTH: {
        LOGOUT: '/logout'
    },
    ADMIN: {
        DASHBOARD:{
            GET_STATISTICS:'/dashboard/statistics'

        },
        USER:{
            GET_ALL:'/users',
            UPDATE_STATUS: '/users/:userId/status',
        },
        VENDOR:{
            GET_ALL:'/vendors',
            GET_BY_ID:'/vendors/:vendorId',
            APPROVE_VENDOR:"/vendors/:vendorId/approve",
            REJECT_VENDOR:"/vendors/:vendorId/reject",
            UPDATE_STATUS:'/vendors/:vendorId/status'
        },
        VENUE:{
            GET_ALL:'/venues',
            GET_BY_ID:'/venues/:venueId',
            APPROVE_VENUE:'/venues/:venueId/approve',
            REJECT_VENUE:'/venues/:venueId/reject',
            UPDATE_STATUS:'/venues/:venueId/status'
        },
        BOOKING:{
            GET_ALL:'/bookings',
            GET_BY_ID:'/bookings/:bookingId',
            GET_STATISTICS:'/bookings/statistics',
        },
        PAYMENT:{
            GET_ALL:'/payments',
            GET_BY_ID:'/payments/:paymentId',
            GET_STATISTICS:'/payments/statistics',
        },
        AUTH: {
            LOGIN: "/admin/login",
            REFRESH: '/admin/refresh',
            LOGOUT: '/admin/logout'
        },

    },
    OWNER: {
        AUTH: {
            LOGIN: "/vendor/login",
            REGISTER: "/vendor/register",
            VERIFY_OTP: "/vendor/verifyotp",
            GOOGLE: "/vendor/googlelogin",
            RESEND_OTP: "/vendor/resendotp",
            FORGOT_PASSWORD: '/vendor/forgotpassword',
            RESET_PASSWORD: '/vendor/resetpassword',
            // VERIFY_EMAIL: "/vendor/verifyemail",
            // VERIFY_OTP_RESET: '/vendor/verifyotpforforgotpassword',
            REFRESH: '/vendor/refresh',
            LOGOUT: '/vendor/logout'
        },
        VENUE: {
            CREATE: '/venue',
            EDIT: '/venue/:venueId',
            GET_BY_ID: '/venue/:venueId/:vendorId',
            GET_ALL: '/venues',
            DELETE: '/venue/:venueId/:vendorId',
            UPDATE_STATUS: '/venue/:venueId/:vendorId/status'
        },
        PROFILE: {
            GET: '/profile',
            UPDATE: '/profile',
            CHANGE_PASSWORD: '/change-password'
        },
        BOOKING: {

            GET_ALL: '/bookings',
            GET_BY_ID: '/bookings/:bookingId'
        },
        DASHBOARD: '/dashboard'
    },
    USER: {
        AUTH: {
            LOGIN: "/user/login",
            REGISTER: "/user/register",
            VERIFY_OTP: "/user/verifyotp",
            GOOGLE: "/user/googlelogin",
            RESEND_OTP: "/user/resendotp",
            FORGOT_PASSWORD: '/user/forgotpassword',
            RESET_PASSWORD: '/user/resetpassword',
            // VERIFY_EMAIL: "/user/verifyemail",
            // VERIFY_OTP_RESET: '/user/verifyotpforforgotpassword',
            REFRESH: '/user/refresh',
            LOGOUT: '/user/logout'
        },
        VENUE: {
            GET_ALL: "/venues",
            GET_BY_ID: "/venue/:venueId",
            TOP_VENUES: "/top-venues",
        },
        PROFILE: {
            PROFILE: "/profile",
            REQUEST_EMAIL_CHANGE_OTP: "/profile/email/request-otp",
            VERIFY_EMAIL_CHANGE_OTP: "/profile/email/verify-otp",
            RESEND_EMAIL_CHANGE_OTP: "/profile/email/resend-otp",
            PROFILE_IMAGE: "/profile/image",
            CHANGE_PASSWORD: "/profile/change-password"
        },
        WISHLIST: {
            WISHLIST: "/wishlist/:venueId",
            GET: "/wishlist",
        },
        ACCOUNT: {
            UPDATE_STATUS: "/account/status",
        },
       BOOKING: {
        RESERVE: "/booking/reserve",
        CONFIRM: "/booking/confirm",
        GET_ALL: "/booking",
        GET_BY_ID: "/booking/:bookingId"
    }

    }
   
}