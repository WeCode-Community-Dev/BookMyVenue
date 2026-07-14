import type {
    PropsWithChildren,
} from 'react';

import {
    useMemo,
    useState,
    useEffect,
} from 'react';

import { Box, LinearProgress, linearProgressClasses } from '@mui/material';

import { tokenStorage } from 'src/lib/token';
import { UserApiService } from 'src/api/user';

import {
    AuthContext,
} from './auth-context';

import type {
    AuthUser,
    UserRole,
    AuthState,
    AuthTokens,
} from './auth.types';

export function AuthProvider({
    children,
}: PropsWithChildren) {
    const [state, setState] =
        useState<AuthState>({
            isLoading: true,
            isAuthenticated: false,
            user: null,
            tokens: null,
        });

    const login = (
        user: AuthUser,
        tokens: AuthTokens,
    ) => {
        tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);

        setState({
            isLoading: false,
            isAuthenticated: true,
            user,
            tokens,
        });
    };

    const logout = () => {
        tokenStorage.clear();

        setState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            tokens: null,
        });
    };

    const hasRole = (
        ...roles: UserRole[]
    ) => !!state.user &&
        roles.includes(
            state.user.role,
        );

    const value = useMemo(
        () => ({
            ...state,
            login,
            logout,
            hasRole,
        }),
        [state],
    );

    const Loading = () => (
        <Box
            sx={{
                display: 'flex',
                flex: '1 1 auto',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}
        >
            <LinearProgress
                sx={{
                    width: 1,
                    maxWidth: 320,
                    bgcolor: 'rgba(0, 0, 0, 0.12)',

                    [`& .${linearProgressClasses.bar}`]: {
                        bgcolor: '#000',
                    },
                }}
            />
        </Box>
    );

    useEffect(() => {

        UserApiService.me()
            .then((user) => {
                setState({
                    isLoading: false,
                    isAuthenticated: true,
                    user,
                    tokens: null,
                });
            })
            .catch(() => {
                setState({
                    isLoading: false,
                    isAuthenticated: false,
                    user: null,
                    tokens: null,
                });
            });
    }, []);

    return (
        <AuthContext.Provider
            value={value}
        >
            {
                state.isLoading ? <Loading /> : children
            }
        </AuthContext.Provider>
    );
}