import { Box, Grid, Stack, Container, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

const STEPS = [
    {
        step: '01',
        icon: 'mdi:magnify',
        title: 'Search & Discover',
        description:
            'Browse thousands of verified venues. Filter by location, capacity, type, and price to find your ideal space.',
        color: '#1877F2',
        bg: 'linear-gradient(135deg, #E3F2FD 0%, #EDE7F6 100%)',
    },
    {
        step: '02',
        icon: 'mdi:calendar-check',
        title: 'Check Availability',
        description:
            'View real-time availability, detailed photos, amenities, and verified reviews before you decide.',
        color: '#8E33FF',
        bg: 'linear-gradient(135deg, #F3E5F5 0%, #E8EAF6 100%)',
    },
    {
        step: '03',
        icon: 'mdi:credit-card-check',
        title: 'Book & Pay Securely',
        description:
            'Book instantly or send a request. Pay securely with multiple payment options. Instant confirmation.',
        color: '#22C55E',
        bg: 'linear-gradient(135deg, #E8F5E9 0%, #F0FFF4 100%)',
    },
    {
        step: '04',
        icon: 'mdi:party-popper',
        title: 'Celebrate!',
        description:
            'Arrive and enjoy your event. Our support team is available 24/7 to assist you every step of the way.',
        color: '#FF6B6B',
        bg: 'linear-gradient(135deg, #FFF0F0 0%, #FFF8F0 100%)',
    },
];

export function HowItWorks() {
    return (
        <Box id="how-it-works" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <Stack spacing={1} mb={8} alignItems="center" textAlign="center">
                    <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={2}>
                        Simple Process
                    </Typography>
                    <Typography variant="h3" fontWeight={800} letterSpacing="-0.5px">
                        How BookMyVenue Works
                    </Typography>
                    <Typography variant="body1" color="text.secondary" maxWidth={480}>
                        Booking a venue has never been this easy. Four simple steps to your perfect event.
                    </Typography>
                </Stack>

                <Grid container spacing={4} alignItems="stretch">
                    {STEPS.map((step, index) => (
                        <Grid key={step.step} size={{ xs: 12, sm: 6, md: 3 }}>
                            <Box
                                sx={{
                                    height: '100%',
                                    p: 3.5,
                                    borderRadius: 4,
                                    background: step.bg,
                                    border: '1.5px solid transparent',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: `0 20px 50px ${step.color}20`,
                                        borderColor: step.color,
                                    },
                                }}
                            >
                                {/* Step Number (bg text) */}
                                <Typography
                                    sx={{
                                        position: 'absolute',
                                        top: -10,
                                        right: -5,
                                        fontSize: 80,
                                        fontWeight: 900,
                                        color: step.color,
                                        opacity: 0.07,
                                        lineHeight: 1,
                                        userSelect: 'none',
                                    }}
                                >
                                    {step.step}
                                </Typography>

                                {/* Connector Arrow (desktop) */}
                                {index < STEPS.length - 1 && (
                                    <Box
                                        sx={{
                                            display: { xs: 'none', md: 'flex' },
                                            position: 'absolute',
                                            top: '50%',
                                            right: -24,
                                            transform: 'translateY(-50%)',
                                            zIndex: 2,
                                            color: 'text.disabled',
                                        }}
                                    >
                                        <Iconify icon="mdi:chevron-right" width={20} />
                                    </Box>
                                )}

                                <Stack spacing={2.5}>
                                    {/* Icon */}
                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 3,
                                            bgcolor: step.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: `0 8px 24px ${step.color}35`,
                                        }}
                                    >
                                        <Iconify icon={step.icon} color="white" width={28} />
                                    </Box>

                                    {/* Step Badge */}
                                    <Typography
                                        variant="overline"
                                        fontWeight={700}
                                        sx={{ color: step.color, letterSpacing: 1.5 }}
                                    >
                                        Step {step.step}
                                    </Typography>

                                    <Typography variant="h6" fontWeight={700}>
                                        {step.title}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                                        {step.description}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
