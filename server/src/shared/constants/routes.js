export const ROUTES = {
    AUTH: {
        LOGOUT: '/logout'
    },
    ADMIN: {
        USERS: '/users',
        BLOCK_USER: '/users/block/:userId',
        UNBLOCK_USER: '/users/unblock/:userId'
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
        }
    },
    USER: {
        VENUE: {
            GET_ALL: '/venues',
            GET_BY_ID: '/venue/:venueId'
        }
    }
}