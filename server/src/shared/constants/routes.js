export const ROUTES = {
    AUTH: {
        LOGOUT: '/logout'
    },
    ADMIN: {

    },
    OWNER: {
        VENUE: {
            CREATE: '/venue',
            EDIT: '/venue/:venueId',
            GET_BY_ID: '/venue/:venueId/:ownerId',
            GET_ALL: '/venues',
            DELETE: '/venue/:venueId/:ownerId',
            UPDATE_STATUS: '/venue/:venueId/:ownerId/status'
        }
    },
    USER: {
        VENUE: {
            GET_ALL: '/venues',
            GET_BY_ID: '/venue/:venueId'
        },
        PROFILE:{
            GET_PROFILE: "/profile",
            UPDATE_PROFILE: "/profile",
            REQUEST_EMAIL_CHANGE_OTP: "/profile/email/request-otp",
            VERIFY_EMAIL_CHANGE_OTP: "/profile/email/verify-otp",
            RESEND_EMAIL_CHANGE_OTP: "/profile/email/resend-otp",
            UPDATE_PROFILE_IMAGE:"/profile/image",
            REMOVE_PROFILE_IMAGE:"/profile/image",
        },
        WISHLIST: {
            ADD: "/wishlist/:venueId",
            GET: "/wishlist",
            REMOVE: "/wishlist/:venueId"
        },
        ACCOUNT:{
            UPDATE_STATUS:"/account/status"
        },
    }
}