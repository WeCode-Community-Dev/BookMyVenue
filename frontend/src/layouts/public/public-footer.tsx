import { Link } from 'react-router-dom';

import {
    Box,
    Grid,
    Stack,
    Divider,
    Container,
    IconButton,
    Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

const FOOTER_LINKS = {
    Explore: [
        { label: 'Banquet Halls', href: '/search?venueType=BANQUET_HALL' },
        { label: 'Conference Rooms', href: '/search?venueType=CONFERENCE_ROOM' },
        { label: 'Event Spaces', href: '/search?venueType=EVENT_SPACE' },
        { label: 'Restaurants', href: '/search?venueType=RESTAURANT' },
        { label: 'Hotels & Resorts', href: '/search?venueType=HOTEL' },
    ],
    Company: [
        { label: 'About Us', href: '/about' },
        { label: 'How It Works', href: '/#how-it-works' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
    ],
    Support: [
        { label: 'Help Center', href: '/faq' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Cancellation Policy', href: '/cancellation-policy' },
        { label: 'Safety Information', href: '/safety' },
    ],
    Hosts: [
        { label: 'List Your Venue', href: '/sign-up?role=owner' },
        { label: 'Host Resources', href: '/host-resources' },
        { label: 'Community', href: '/community' },
    ],
};

const SOCIAL_LINKS = [
    { icon: 'mdi:facebook', href: '#', label: 'Facebook' },
    { icon: 'mdi:twitter', href: '#', label: 'Twitter' },
    { icon: 'mdi:instagram', href: '#', label: 'Instagram' },
    { icon: 'mdi:linkedin', href: '#', label: 'LinkedIn' },
    { icon: 'mdi:youtube', href: '#', label: 'YouTube' },
];

export function PublicFooter() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'grey.900',
                color: 'grey.400',
                pt: { xs: 6, md: 10 },
                pb: 4,
            }}
        >
            <Container maxWidth="xl">
                {/* Top Section */}
                <Grid container spacing={4} mb={6}>
                    {/* Brand */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Stack spacing={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Iconify icon="mdi:map-marker-multiple" color="white" width={22} />
                                </Box>
                                <Typography variant="h6" fontWeight={800} color="white">
                                    BookMyVenue
                                </Typography>
                            </Box>

                            <Typography variant="body2" lineHeight={1.8} maxWidth={280}>
                                Discover and book the perfect venue for your next event. From intimate gatherings to grand celebrations.
                            </Typography>

                            <Stack direction="row" spacing={1}>
                                {SOCIAL_LINKS.map((s) => (
                                    <IconButton
                                        key={s.label}
                                        component="a"
                                        href={s.href}
                                        target="_blank"
                                        aria-label={s.label}
                                        size="small"
                                        sx={{
                                            color: 'grey.400',
                                            bgcolor: 'grey.800',
                                            '&:hover': { bgcolor: 'primary.main', color: 'white' },
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <Iconify icon={s.icon} width={18} />
                                    </IconButton>
                                ))}
                            </Stack>

                            <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Iconify icon="mdi:email-outline" width={16} />
                                    <Typography variant="body2">hello@bookmyvenue.in</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Iconify icon="mdi:phone-outline" width={16} />
                                    <Typography variant="body2">+91 98765 43210</Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Links */}
                    {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                        <Grid key={title} size={{ xs: 6, sm: 3, md: 2.25 }}>
                            <Typography variant="subtitle2" color="white" fontWeight={700} mb={2.5}>
                                {title}
                            </Typography>
                            <Stack spacing={1.5}>
                                {links.map((link) => (
                                    <Typography
                                        key={link.label}
                                        component={Link}
                                        to={link.href}
                                        variant="body2"
                                        sx={{
                                            color: 'grey.400',
                                            textDecoration: 'none',
                                            '&:hover': { color: 'white' },
                                            transition: 'color 0.2s',
                                        }}
                                    >
                                        {link.label}
                                    </Typography>
                                ))}
                            </Stack>
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ borderColor: 'grey.800', mb: 4 }} />

                {/* Bottom Row */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'center', sm: 'center' }}
                    spacing={2}
                >
                    <Typography variant="caption" color="grey.500">
                        © {new Date().getFullYear()} BookMyVenue. All rights reserved.
                    </Typography>

                    <Stack direction="row" spacing={3}>
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                            <Typography
                                key={item}
                                component="a"
                                href="#"
                                variant="caption"
                                sx={{
                                    color: 'grey.500',
                                    textDecoration: 'none',
                                    '&:hover': { color: 'white' },
                                    transition: 'color 0.2s',
                                }}
                            >
                                {item}
                            </Typography>
                        ))}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
