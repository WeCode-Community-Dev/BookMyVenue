import { useNavigate } from 'react-router-dom';

import { Box, Grid, Paper, Stack, Button, Container, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

const HOST_BENEFITS = [
    { icon: 'mdi:cash-multiple', label: 'Earn Extra Income', desc: 'List your venue and start earning from day one' },
    { icon: 'mdi:account-multiple', label: 'Reach More Clients', desc: '50K+ event planners actively searching for venues' },
    { icon: 'mdi:calendar-month', label: 'Flexible Availability', desc: 'You control your calendar and pricing' },
    { icon: 'mdi:headset', label: 'Dedicated Support', desc: 'Our host success team is always here to help' },
];

export function HostCta() {
    const navigate = useNavigate();

    return (
        <Box
            id="for-hosts"
            sx={{
                py: { xs: 8, md: 12 },
                bgcolor: 'background.default',
            }}
        >
            <Container maxWidth="lg">
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 6,
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #0F1B40 0%, #1B0A3F 50%, #0F1B40 100%)',
                        position: 'relative',
                    }}
                >
                    {/* Decorative Elements */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -60,
                            right: -60,
                            width: 300,
                            height: 300,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(142,51,255,0.3) 0%, transparent 70%)',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -80,
                            left: -40,
                            width: 250,
                            height: 250,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(24,119,242,0.25) 0%, transparent 70%)',
                        }}
                    />

                    <Grid container>
                        {/* Left Content */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ p: { xs: 4, md: 6, lg: 8 }, position: 'relative', zIndex: 1 }}>
                                <Stack spacing={4}>
                                    <Box>
                                        <Typography
                                            variant="overline"
                                            sx={{
                                                color: 'rgba(255,255,255,0.6)',
                                                letterSpacing: 3,
                                                fontWeight: 700,
                                            }}
                                        >
                                            For Venue Owners
                                        </Typography>
                                        <Typography
                                            variant="h3"
                                            color="white"
                                            fontWeight={800}
                                            letterSpacing="-0.5px"
                                            mt={1}
                                        >
                                            Turn Your Space Into
                                            <Box
                                                component="span"
                                                sx={{
                                                    background: 'linear-gradient(135deg, #60A5FA 0%, #C084FC 100%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    display: 'block',
                                                }}
                                            >
                                                A Revenue Machine
                                            </Box>
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: 'rgba(255,255,255,0.7)', mt: 2, lineHeight: 1.8 }}
                                        >
                                            Join 5,000+ venue owners earning consistent income by listing their spaces on
                                            BookMyVenue. Setup takes less than 10 minutes.
                                        </Typography>
                                    </Box>

                                    <Stack spacing={2.5}>
                                        {HOST_BENEFITS.map((benefit) => (
                                            <Stack key={benefit.label} direction="row" spacing={2} alignItems="flex-start">
                                                <Box
                                                    sx={{
                                                        width: 44,
                                                        height: 44,
                                                        borderRadius: 2.5,
                                                        bgcolor: 'rgba(255,255,255,0.1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                        border: '1px solid rgba(255,255,255,0.15)',
                                                    }}
                                                >
                                                    <Iconify icon={benefit.icon} color="rgba(255,255,255,0.9)" width={22} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" color="white" fontWeight={700}>
                                                        {benefit.label}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)' }}>
                                                        {benefit.desc}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        ))}
                                    </Stack>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={() => navigate('/sign-up?role=owner')}
                                            startIcon={<Iconify icon="mdi:rocket-launch" />}
                                            sx={{
                                                borderRadius: 2.5,
                                                fontWeight: 700,
                                                px: 4,
                                                background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                                boxShadow: '0 4px 20px rgba(24,119,242,0.4)',
                                                '&:hover': { boxShadow: '0 8px 30px rgba(24,119,242,0.5)' },
                                            }}
                                        >
                                            List Your Venue
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            onClick={() => navigate('/about')}
                                            sx={{
                                                borderRadius: 2.5,
                                                fontWeight: 600,
                                                px: 4,
                                                borderColor: 'rgba(255,255,255,0.3)',
                                                color: 'white',
                                                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)' },
                                            }}
                                        >
                                            Learn More
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Grid>

                        {/* Right Image */}
                        <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Box
                                sx={{
                                    height: '100%',
                                    minHeight: 500,
                                    backgroundImage: `url(https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=800&q=75)`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to right, #0F1B40 0%, transparent 30%)',
                                    },
                                }}
                            >
                                {/* Earnings Badge */}
                                <Paper
                                    elevation={8}
                                    sx={{
                                        position: 'absolute',
                                        bottom: 40,
                                        left: 40,
                                        p: 2.5,
                                        borderRadius: 3,
                                        bgcolor: 'rgba(255,255,255,0.95)',
                                        backdropFilter: 'blur(12px)',
                                        zIndex: 2,
                                    }}
                                >
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 2,
                                                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Iconify icon="mdi:trending-up" color="white" width={26} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight={800} color="success.main">
                                                +₹1.2L
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Average monthly earnings
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
}
