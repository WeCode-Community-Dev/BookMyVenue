import {
    createContext,
} from 'react';

import type {
    AuthContextValue,
} from './auth.types';

export const AuthContext =
    createContext<AuthContextValue | null>(
        null,
    );