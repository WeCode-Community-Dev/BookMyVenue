export const ROUTES = {
    AUTH: {
        LOGOUT: '/logout'
    },
    ADMIN: {
        USERS: '/users',
        BLOCK_USER: '/users/block/:userId',
        UNBLOCK_USER: '/users/unblock/:userId'
    },
    VENDOR: {
        VENUE: {
            CREATE: '/venue',
            EDIT: '/venue/:venueId',
            GET_BY_ID: '/venue/:venueId/:vendorId',
            GET_ALL: '/venues',
            DELETE: '/venue/:venueId/:vendorId',
            UPDATE_STATUS: '/venue/:venueId/:vendorId/status'
        }
    },
    USER: {
        VENUE: {
            GET_ALL: '/venues',
            GET_BY_ID: '/venue/:venueId'
        }
    }
}