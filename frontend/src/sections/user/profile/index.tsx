import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    Grid,
    List,
    Alert,
    Paper,
    Stack,
    Avatar,
    Button,
    Divider,
    ListItem,
    Container,
    TextField,
    Typography,
    ListItemIcon,
    ListItemText,
    ListItemButton,
} from '@mui/material';

import { useAuth } from 'src/context/auth/use-auth';

import { Iconify } from 'src/components/iconify';

const QUICK_LINKS = [
    { icon: 'mdi:calendar-check-outline', label: 'My Bookings', href: '/my/bookings', color: '#1877F2' },
    { icon: 'mdi:heart-outline', label: 'Saved Venues', href: '/my/favorites', color: '#E91E63' },
    { icon: 'mdi:magnify', label: 'Explore Venues', href: '/search', color: '#8E33FF' },
    { icon: 'mdi:headset', label: 'Help & Support', href: '/faq', color: '#22C55E' },
];

export function ProfileView() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(user?.name ?? '');
    const [saveSuccess, setSaveSuccess] = useState(false);

    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] ?? '';
    const lastName = nameParts.slice(1).join(' ') ?? '';

    const handleSave = () => {
        setEditMode(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const userInitial = (user?.name ?? 'U').charAt(0).toUpperCase();

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', pb: 8 }}>
            {/* Header Banner */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                    pt: 5,
                    pb: 10,
                    mb: -6,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                            'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)',
                    }}
                />
                <Container maxWidth="lg">
                    <Typography variant="h4" color="white" fontWeight={800}>
                        My Profile
                    </Typography>
                    <Typography variant="body1" color="rgba(255,255,255,0.7)" mt={0.5}>
                        Manage your account information and preferences
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={3}>
                    {/* Left: Profile Card */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 4,
                                border: '1.5px solid',
                                borderColor: 'divider',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Avatar Section */}
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 4,
                                    px: 3,
                                    background: 'linear-gradient(180deg, rgba(24,119,242,0.06) 0%, transparent 100%)',
                                }}
                            >
                                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                                    <Avatar
                                        sx={{
                                            width: 90,
                                            height: 90,
                                            fontSize: 36,
                                            fontWeight: 800,
                                            background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                            mx: 'auto',
                                            boxShadow: '0 8px 24px rgba(24,119,242,0.35)',
                                        }}
                                    >
                                        {userInitial}
                                    </Avatar>
                                </Box>
                                <Typography variant="h6" fontWeight={800}>{user?.name}</Typography>
                                <Typography variant="body2" color="text.secondary" mb={2}>{user?.email}</Typography>
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        bgcolor: 'primary.lighter',
                                        color: 'primary.dark',
                                        borderRadius: 2,
                                        px: 1.5,
                                        py: 0.5,
                                    }}
                                >
                                    <Iconify icon="mdi:account-check" width={14} />
                                    <Typography variant="caption" fontWeight={700}>Verified Account</Typography>
                                </Box>
                            </Box>

                            <Divider />

                            {/* Quick Links */}
                            <List disablePadding>
                                {QUICK_LINKS.map((link) => (
                                    <ListItem key={link.label} disablePadding>
                                        <ListItemButton
                                            onClick={() => navigate(link.href)}
                                            sx={{ py: 1.5, px: 2.5, '&:hover': { bgcolor: 'action.hover' } }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <Box
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: 1.5,
                                                        bgcolor: `${link.color}15`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Iconify icon={link.icon} width={18} color={link.color} />
                                                </Box>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={link.label}
                                                primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                                            />
                                            <Iconify icon="mdi:chevron-right" color="text.disabled" width={18} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>

                            <Divider />

                            <Box sx={{ p: 2 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Iconify icon="mdi:logout" />}
                                    onClick={handleLogout}
                                    sx={{ borderRadius: 2.5, fontWeight: 600 }}
                                >
                                    Sign Out
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right: Profile Details */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack spacing={3}>
                            {/* Personal Information */}
                            <Paper
                                elevation={0}
                                sx={{ borderRadius: 4, border: '1.5px solid', borderColor: 'divider', p: 3.5 }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={800}>Personal Information</Typography>
                                        <Typography variant="body2" color="text.secondary">Update your personal details</Typography>
                                    </Box>
                                    <Button
                                        variant={editMode ? 'outlined' : 'contained'}
                                        size="small"
                                        startIcon={<Iconify icon={editMode ? 'mdi:close' : 'mdi:pencil-outline'} />}
                                        onClick={() => setEditMode(!editMode)}
                                        sx={{
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            ...(editMode ? {} : {
                                                background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                                border: 'none',
                                            }),
                                        }}
                                    >
                                        {editMode ? 'Cancel' : 'Edit'}
                                    </Button>
                                </Stack>

                                {saveSuccess && (
                                    <Alert severity="success" sx={{ borderRadius: 2.5, mb: 3 }}>
                                        Profile updated successfully!
                                    </Alert>
                                )}

                                <Grid container spacing={2.5}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="First Name"
                                            value={firstName}
                                            disabled={!editMode}
                                            onChange={(e) => setName(`${e.target.value} ${lastName}`)}
                                            fullWidth
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Last Name"
                                            value={lastName}
                                            disabled={!editMode}
                                            onChange={(e) => setName(`${firstName} ${e.target.value}`)}
                                            fullWidth
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            label="Email Address"
                                            value={user?.email ?? ''}
                                            disabled
                                            fullWidth
                                            helperText="Email cannot be changed"
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            label="Phone Number"
                                            value=""
                                            disabled={!editMode}
                                            fullWidth
                                            placeholder="Add your phone number"
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                        />
                                    </Grid>
                                </Grid>

                                {editMode && (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            mt: 3,
                                            borderRadius: 2.5,
                                            fontWeight: 700,
                                            px: 4,
                                            background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                        }}
                                        onClick={handleSave}
                                    >
                                        Save Changes
                                    </Button>
                                )}
                            </Paper>

                            {/* Security */}
                            <Paper
                                elevation={0}
                                sx={{ borderRadius: 4, border: '1.5px solid', borderColor: 'divider', p: 3.5 }}
                            >
                                <Typography variant="h6" fontWeight={800} mb={0.5}>Security</Typography>
                                <Typography variant="body2" color="text.secondary" mb={3}>
                                    Manage your password and account security
                                </Typography>

                                <Stack spacing={2}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" py={1.5}
                                        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Iconify icon="mdi:lock-outline" width={20} color="text.secondary" />
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>Password</Typography>
                                                <Typography variant="caption" color="text.secondary">Last changed 3 months ago</Typography>
                                            </Box>
                                        </Stack>
                                        <Button size="small" sx={{ borderRadius: 2, fontWeight: 600 }}>Change</Button>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" py={1.5}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Iconify icon="mdi:shield-check-outline" width={20} color="success.main" />
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>Two-Factor Auth</Typography>
                                                <Typography variant="caption" color="text.secondary">Add extra layer of security</Typography>
                                            </Box>
                                        </Stack>
                                        <Button size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 600 }}>Enable</Button>
                                    </Stack>
                                </Stack>
                            </Paper>

                            {/* Danger Zone */}
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 4,
                                    border: '1.5px solid',
                                    borderColor: 'error.light',
                                    p: 3.5,
                                    bgcolor: 'error.lighter',
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                                    <Iconify icon="mdi:alert-circle-outline" color="error.main" width={22} />
                                    <Typography variant="h6" fontWeight={800} color="error.main">Danger Zone</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" mb={2.5}>
                                    Once you delete your account, all your data will be permanently removed. This action cannot be undone.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Iconify icon="mdi:delete-outline" />}
                                    sx={{ borderRadius: 2.5, fontWeight: 600 }}
                                >
                                    Delete Account
                                </Button>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
