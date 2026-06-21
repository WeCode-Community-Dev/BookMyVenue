import { Box, Grid, Paper, Stack, Avatar, Rating, Container, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

const TESTIMONIALS = [
    {
        name: 'Priya Sharma',
        role: 'Wedding Planner',
        avatar: 'https://i.pravatar.cc/100?img=1',
        rating: 5,
        text: 'BookMyVenue made planning my clients\' weddings so much easier. The platform has an incredible selection of venues and the booking process is seamless. Highly recommended!',
        venue: 'The Grand Ballroom, Mumbai',
        event: 'Wedding Reception',
    },
    {
        name: 'Rahul Mehta',
        role: 'Corporate Events Manager',
        avatar: 'https://i.pravatar.cc/100?img=11',
        rating: 5,
        text: 'We use BookMyVenue for all our corporate events. The ability to filter by capacity and amenities saves us hours. The venues are exactly as described — no surprises!',
        venue: 'The Conference Hub, Delhi',
        event: 'Annual Conference',
    },
    {
        name: 'Sneha Patel',
        role: 'Birthday Party Host',
        avatar: 'https://i.pravatar.cc/100?img=5',
        rating: 5,
        text: 'Booked the Sky Garden Terrace for my 30th birthday and it was absolutely magical! The team was responsive, the venue was stunning, and the experience was unforgettable.',
        venue: 'Sky Garden Terrace, Bangalore',
        event: 'Birthday Party',
    },
    {
        name: 'Arjun Nair',
        role: 'Startup Founder',
        avatar: 'https://i.pravatar.cc/100?img=15',
        rating: 4,
        text: 'Used BookMyVenue for our product launch event. Got a great space at a competitive price. The instant booking confirmation was a huge plus for our tight timeline.',
        venue: 'InnoSpace Hub, Chennai',
        event: 'Product Launch',
    },
    {
        name: 'Kavya Reddy',
        role: 'Event Coordinator',
        avatar: 'https://i.pravatar.cc/100?img=9',
        rating: 5,
        text: 'The platform is intuitive and the venue listings are detailed and accurate. I\'ve booked 12+ venues through BookMyVenue and never had an issue. Excellent service!',
        venue: 'Multiple Venues',
        event: 'Various Events',
    },
    {
        name: 'Vikram Singh',
        role: 'Restaurant Owner',
        avatar: 'https://i.pravatar.cc/100?img=21',
        rating: 5,
        text: 'Listed my restaurant on BookMyVenue and bookings increased by 40%. The platform is easy to manage and the support team is always helpful. Game changer for my business!',
        venue: 'La Bella Cucina, Pune',
        event: 'Private Dining',
    },
];

interface TestimonialCardProps {
    testimonial: typeof TESTIMONIALS[number];
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3.5,
                borderRadius: 4,
                border: '1.5px solid',
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.25s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
                    borderColor: 'primary.main',
                },
            }}
        >
            {/* Quote Icon */}
            <Box sx={{ color: 'primary.main', mb: 2, opacity: 0.6 }}>
                <Iconify icon="mdi:format-quote-open" width={36} />
            </Box>

            {/* Review Text */}
            <Typography
                variant="body2"
                color="text.secondary"
                lineHeight={1.8}
                sx={{ flex: 1, mb: 3, fontStyle: 'italic' }}
            >
                &ldquo;{testimonial.text}&rdquo;
            </Typography>

            {/* Rating */}
            <Rating value={testimonial.rating} readOnly size="small" sx={{ mb: 2 }} />

            {/* Venue Tag */}
            <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    bgcolor: 'primary.lighter',
                    color: 'primary.dark',
                    borderRadius: 1.5,
                    px: 1.5,
                    py: 0.5,
                    mb: 2.5,
                    width: 'fit-content',
                }}
            >
                <Iconify icon="mdi:map-marker" width={14} />
                <Typography variant="caption" fontWeight={600}>{testimonial.venue}</Typography>
            </Box>

            {/* Author */}
            <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar src={testimonial.avatar} sx={{ width: 44, height: 44 }} />
                <Box>
                    <Typography variant="subtitle2" fontWeight={700}>{testimonial.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{testimonial.role}</Typography>
                </Box>
            </Stack>
        </Paper>
    );
}

export function Testimonials() {
    return (
        <Box
            sx={{
                py: { xs: 8, md: 12 },
                background: 'linear-gradient(135deg, #F0F5FF 0%, #F5F0FF 50%, #FFF0F5 100%)',
            }}
        >
            <Container maxWidth="xl">
                <Stack spacing={1} mb={7} alignItems="center" textAlign="center">
                    <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={2}>
                        Testimonials
                    </Typography>
                    <Typography variant="h3" fontWeight={800} letterSpacing="-0.5px">
                        What Our Users Say
                    </Typography>
                    <Typography variant="body1" color="text.secondary" maxWidth={480}>
                        Join thousands of happy hosts and guests who have found their perfect venue on BookMyVenue
                    </Typography>
                </Stack>

                <Grid container spacing={3}>
                    {TESTIMONIALS.map((t) => (
                        <Grid key={t.name} size={{ xs: 12, sm: 6, md: 4 }}>
                            <TestimonialCard testimonial={t} />
                        </Grid>
                    ))}
                </Grid>

                {/* Trust Indicators */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={4}
                    justifyContent="center"
                    alignItems="center"
                    mt={8}
                    flexWrap="wrap"
                >
                    {[
                        { icon: 'mdi:shield-check', label: 'Verified Venues', color: '#22C55E' },
                        { icon: 'mdi:lock-check', label: 'Secure Payments', color: '#1877F2' },
                        { icon: 'mdi:headset', label: '24/7 Support', color: '#8E33FF' },
                        { icon: 'mdi:star-circle', label: '4.8/5 Rating', color: '#FF6B6B' },
                    ].map((item) => (
                        <Stack key={item.label} direction="row" spacing={1} alignItems="center">
                            <Iconify icon={item.icon} width={22} color={item.color} />
                            <Typography variant="body2" fontWeight={600}>
                                {item.label}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
}
