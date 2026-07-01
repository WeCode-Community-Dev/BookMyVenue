export const ROUTES = {
    AUTH: {
        LOGOUT: '/logout'
    },
    ADMIN: {
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
        }

    },
    OWNER: {
        VENUE: {
            CREATE: '/venue',
            EDIT: '/venue/:venueId',
            GET_BY_ID: '/venue/:venueId/:ownerId',
            GET_ALL: '/venues',
            DELETE: '/venue/:venueId/:ownerId',
            UPDATE_STATUS: '/venue/:venueId/:ownerId/status'
        },
        PROFILE: {
            GET: '/profile',
            UPDATE: '/profile'
        },
        BOOKING: {

            GET_ALL: '/bookings',
            GET_BY_ID: '/bookings/:bookingId'
        },
        DASHBOARD: '/dashboard'
    },
    USER: {
        VENUE: {
            GET_ALL: '/venues',
            GET_BY_ID: '/venue/:venueId'
        },
        PROFILE:{
            PROFILE: "/profile",
            REQUEST_EMAIL_CHANGE_OTP: "/profile/email/request-otp",
            VERIFY_EMAIL_CHANGE_OTP: "/profile/email/verify-otp",
            RESEND_EMAIL_CHANGE_OTP: "/profile/email/resend-otp",
            PROFILE_IMAGE:"/profile/image",
           
        },
        WISHLIST: {
            WISHLIST: "/wishlist/:venueId",
            GET: "/wishlist",
           
        },
        ACCOUNT:{
            UPDATE_STATUS:"/account/status"
        },
    }
}