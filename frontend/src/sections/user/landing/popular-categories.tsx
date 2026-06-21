import { useNavigate } from 'react-router-dom';

import { Box, Grid, Paper, Stack, Container, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

const CATEGORIES = [
    {
        label: 'Banquet Halls',
        icon: 'mdi:silverware-fork-knife',
        type: 'BANQUET_HALL',
        color: '#FF6B6B',
        bg: '#FFF0F0',
        count: '2.4K venues',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=70',
    },
    {
        label: 'Conference Rooms',
        icon: 'mdi:presentation',
        type: 'CONFERENCE_ROOM',
        color: '#4ECDC4',
        bg: '#F0FFFE',
        count: '1.8K venues',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=70',
    },
    {
        label: 'Event Spaces',
        icon: 'mdi:party-popper',
        type: 'EVENT_SPACE',
        color: '#8E33FF',
        bg: '#F5F0FF',
        count: '3.1K venues',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=70',
    },
    {
        label: 'Restaurants',
        icon: 'mdi:food',
        type: 'RESTAURANT',
        color: '#FF8C00',
        bg: '#FFF8F0',
        count: '2.7K venues',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=70',
    },
    {
        label: 'Hotels & Resorts',
        icon: 'mdi:hotel',
        type: 'HOTEL',
        color: '#1877F2',
        bg: '#F0F5FF',
        count: '1.5K venues',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c4a49a5c?w=400&q=70',
    },
    {
        label: 'Auditoriums',
        icon: 'mdi:theater',
        type: 'AUDITORIUM',
        color: '#E91E63',
        bg: '#FFF0F5',
        count: '890 venues',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=70',
    },
    {
        label: 'Party Halls',
        icon: 'mdi:balloon',
        type: 'PARTY_HALL',
        color: '#00BCD4',
        bg: '#F0FBFF',
        count: '1.2K venues',
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=70',
    },
    {
        label: 'Meeting Rooms',
        icon: 'mdi:account-group',
        type: 'MEETING_ROOM',
        color: '#4CAF50',
        bg: '#F0FFF4',
        count: '2.0K venues',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=70',
    },
];

export function PopularCategories() {
    const navigate = useNavigate();

    return (
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.default' }}>
            <Container maxWidth="xl">
                <Stack spacing={1} mb={5} alignItems="center" textAlign="center">
                    <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={2}>
                        Browse by Category
                    </Typography>
                    <Typography variant="h3" fontWeight={800} letterSpacing="-0.5px">
                        What are you looking for?
                    </Typography>
                    <Typography variant="body1" color="text.secondary" maxWidth={480}>
                        Explore our wide range of venue categories to find the perfect space for any occasion
                    </Typography>
                </Stack>

                <Grid container spacing={2.5}>
                    {CATEGORIES.map((cat) => (
                        <Grid key={cat.type} size={{ xs: 6, sm: 4, md: 3 }}>
                            <Paper
                                onClick={() => navigate(`/search?venueType=${cat.type}`)}
                                elevation={0}
                                sx={{
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    border: '1.5px solid',
                                    borderColor: 'divider',
                                    transition: 'all 0.25s ease',
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                        boxShadow: `0 16px 40px ${cat.color}25`,
                                        borderColor: cat.color,
                                    },
                                }}
                            >
                                {/* Image */}
                                <Box
                                    sx={{
                                        height: 130,
                                        backgroundImage: `url(${cat.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: `linear-gradient(to bottom, transparent 30%, ${cat.color}CC 100%)`,
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 10,
                                            left: 12,
                                            width: 36,
                                            height: 36,
                                            borderRadius: 2,
                                            bgcolor: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Iconify icon={cat.icon} width={20} color={cat.color} />
                                    </Box>
                                </Box>

                                {/* Info */}
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                        {cat.label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {cat.count}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
