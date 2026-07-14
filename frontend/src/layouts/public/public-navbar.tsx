import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
    Box,
    List,
    Menu,
    Stack,
    AppBar,
    Avatar,
    Button,
    Drawer,
    Divider,
    Toolbar,
    ListItem,
    MenuItem,
    Container,
    IconButton,
    Typography,
    ListItemText,
    ListItemButton,
    useScrollTrigger,
} from '@mui/material';

import { useAuth } from 'src/context/auth/use-auth';
import { NotificationsPopover } from 'src/layouts/components/notifications-popover';

import { Iconify } from 'src/components/iconify';

const NAV_LINKS = [
    { label: 'Explore Venues', href: '/search' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'For Hosts', href: '/#for-hosts' },
];

interface Props {
    transparent?: boolean;
}

export function PublicNavbar({ transparent = false }: Props) {

    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 60 });
    const elevated = !transparent || scrolled;

    const handleUserMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleUserMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleUserMenuClose();
        logout();
        navigate('/');
    };

    const userInitial = user?.name?.charAt(0).toUpperCase() ?? 'U';

    return (
        <>
            <AppBar
                position="fixed"
                elevation={elevated ? 2 : 0}
                sx={{
                    bgcolor: elevated ? 'background.paper' : 'transparent',
                    color: elevated ? 'text.primary' : 'white',
                    transition: 'all 0.3s ease',
                    backdropFilter: elevated ? 'blur(12px)' : 'none',
                    borderBottom: elevated ? '1px solid' : 'none',
                    borderColor: 'divider',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
                        {/* Logo */}
                        <Box
                            component={Link}
                            to="/"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                textDecoration: 'none',
                                color: 'inherit',
                                mr: 4,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <Iconify icon="mdi:map-marker-multiple" color="white" width={20} />
                            </Box>
                            <Typography
                                variant="h6"
                                fontWeight={800}
                                sx={{
                                    background: elevated
                                        ? 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)'
                                        : 'white',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: { xs: 'none', sm: 'block' },
                                    letterSpacing: '-0.5px',
                                }}
                            >
                                BookMyVenue
                            </Typography>
                        </Box>

                        {/* Desktop Nav Links */}
                        <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' }, flex: 1 }}>
                            {NAV_LINKS.map((link) => (
                                <Button
                                    key={link.label}
                                    component={Link}
                                    to={link.href}
                                    sx={{
                                        color: 'inherit',
                                        fontWeight: 500,
                                        borderRadius: 2,
                                        px: 2,
                                        opacity: 0.85,
                                        '&:hover': { opacity: 1, bgcolor: 'action.hover' },
                                    }}
                                >
                                    {link.label}
                                </Button>
                            ))}
                        </Stack>

                        <Box sx={{ flex: 1, display: { md: 'none' } }} />

                        {/* Desktop Auth Actions */}
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {isAuthenticated && user ? (
                                <>
                                    <Button
                                        component={Link}
                                        to="/my/bookings"
                                        startIcon={<Iconify icon="mdi:calendar-check" />}
                                        sx={{ color: 'inherit', fontWeight: 500 }}
                                    >
                                        My Bookings
                                    </Button>
                                    <NotificationsPopover sx={{ color: 'inherit' }} />
                                    <IconButton onClick={handleUserMenuOpen} sx={{ p: 0.5 }}>
                                        <Avatar
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                                fontSize: 14,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {userInitial}
                                        </Avatar>
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleUserMenuClose}
                                        PaperProps={{
                                            sx: { mt: 1.5, minWidth: 200, borderRadius: 2, boxShadow: 6 },
                                        }}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    >
                                        <Box sx={{ px: 2, py: 1.5 }}>
                                            <Typography variant="subtitle2" fontWeight={700}>{user.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                                        </Box>
                                        <Divider />
                                        <MenuItem onClick={() => { handleUserMenuClose(); navigate('/my/profile'); }}>
                                            <Iconify icon="mdi:account-outline" sx={{ mr: 1.5 }} /> Profile
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleUserMenuClose(); navigate('/my/bookings'); }}>
                                            <Iconify icon="mdi:calendar-check-outline" sx={{ mr: 1.5 }} /> My Bookings
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleUserMenuClose(); navigate('/my/favorites'); }}>
                                            <Iconify icon="mdi:heart-outline" sx={{ mr: 1.5 }} /> Favorites
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                            <Iconify icon="mdi:logout" sx={{ mr: 1.5 }} /> Sign Out
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <>
                                    <Button
                                        component={Link}
                                        to="/sign-in"
                                        variant="text"
                                        sx={{
                                            color: 'inherit',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/sign-up"
                                        variant="contained"
                                        sx={{
                                            borderRadius: 2,
                                            fontWeight: 700,
                                            px: 3,
                                            background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                            boxShadow: 'none',
                                            '&:hover': { boxShadow: '0 4px 20px rgba(24,119,242,0.4)' },
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        </Stack>

                        {/* Mobile notifications */}
                        {isAuthenticated && user && (
                            <NotificationsPopover sx={{ display: { md: 'none' }, color: 'inherit' }} />
                        )}

                        {/* Mobile hamburger */}
                        <IconButton
                            sx={{ display: { md: 'none' }, color: 'inherit' }}
                            onClick={() => setMobileOpen(true)}
                        >
                            <Iconify icon="mdi:menu" width={28} />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                PaperProps={{ sx: { width: 280, borderRadius: '16px 0 0 16px' } }}
            >
                <Box sx={{ p: 2.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight={800} color="primary">
                            BookMyVenue
                        </Typography>
                        <IconButton onClick={() => setMobileOpen(false)}>
                            <Iconify icon="mdi:close" />
                        </IconButton>
                    </Stack>

                    {isAuthenticated && user && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 2,
                                bgcolor: 'action.hover',
                                borderRadius: 2,
                                mb: 2,
                            }}
                        >
                            <Avatar sx={{ background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)', width: 40, height: 40 }}>
                                {userInitial}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" fontWeight={700}>{user.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                            </Box>
                        </Box>
                    )}

                    <List disablePadding>
                        {NAV_LINKS.map((link) => (
                            <ListItem key={link.label} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    sx={{ borderRadius: 1.5, mb: 0.5 }}
                                >
                                    <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 500 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}

                        {isAuthenticated && user ? (
                            <>
                                <Divider sx={{ my: 1 }} />
                                {[
                                    { label: 'My Bookings', href: '/my/bookings', icon: 'mdi:calendar-check-outline' },
                                    { label: 'Favorites', href: '/my/favorites', icon: 'mdi:heart-outline' },
                                    { label: 'Profile', href: '/my/profile', icon: 'mdi:account-outline' },
                                ].map((item) => (
                                    <ListItem key={item.label} disablePadding>
                                        <ListItemButton
                                            component={Link}
                                            to={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            sx={{ borderRadius: 1.5, mb: 0.5 }}
                                        >
                                            <Iconify icon={item.icon} sx={{ mr: 1.5, color: 'text.secondary' }} />
                                            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500 }} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                                <Divider sx={{ my: 1 }} />
                                <ListItem disablePadding>
                                    <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1.5, color: 'error.main' }}>
                                        <Iconify icon="mdi:logout" sx={{ mr: 1.5 }} />
                                        <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 600 }} />
                                    </ListItemButton>
                                </ListItem>
                            </>
                        ) : (
                            <>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                                    <Button
                                        component={Link}
                                        to="/sign-in"
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => setMobileOpen(false)}
                                        sx={{ borderRadius: 2, fontWeight: 600 }}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/sign-up"
                                        variant="contained"
                                        fullWidth
                                        onClick={() => setMobileOpen(false)}
                                        sx={{
                                            borderRadius: 2,
                                            fontWeight: 700,
                                            background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </Box>
                            </>
                        )}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}
