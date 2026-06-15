import type {
    AuthUser,
    AuthTokens,
} from './auth.types';

const USER_KEY = 'bmv_user';
const TOKEN_KEY = 'bmv_tokens';

export const AuthStorage = {
    save(user: AuthUser, tokens: AuthTokens) {
        localStorage.setItem(
            USER_KEY,
            JSON.stringify(user),
        );

        localStorage.setItem(
            TOKEN_KEY,
            JSON.stringify(tokens),
        );
    },

    getUser(): AuthUser | null {
        const value =
            localStorage.getItem(USER_KEY);

        return value
            ? JSON.parse(value)
            : null;
    },

    getTokens(): AuthTokens | null {
        const value =
            localStorage.getItem(TOKEN_KEY);

        return value
            ? JSON.parse(value)
            : null;
    },

    clear() {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
    },
};