import type { ReactNode } from 'react';

import { Box } from '@mui/material';

import { PublicNavbar } from './public-navbar';
import { PublicFooter } from './public-footer';

interface PublicLayoutProps {
    children: ReactNode;
    transparentNavbar?: boolean;
    hideFooter?: boolean;
}

export function PublicLayout({ children, transparentNavbar = false, hideFooter = false }: PublicLayoutProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <PublicNavbar transparent={transparentNavbar} />

            <Box component="main" sx={{ flex: 1, ...(transparentNavbar ? {} : { pt: { xs: '64px', md: '72px' } }) }}>
                {children}
            </Box>

            {!hideFooter && <PublicFooter />}
        </Box>
    );
}
