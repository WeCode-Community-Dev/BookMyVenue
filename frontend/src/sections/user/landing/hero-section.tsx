import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    Chip,
    Paper,
    Stack,
    Button,
    useTheme,
    Container,
    Typography,
    OutlinedInput,
    useMediaQuery,
    InputAdornment,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

const TRENDING_SEARCHES = ['Banquet Hall', 'Conference Room', 'Mumbai', 'Bangalore', 'Delhi'];

const STATS = [
    { value: '10K+', label: 'Venues Listed' },
    { value: '50K+', label: 'Events Hosted' },
    { value: '100+', label: 'Cities Covered' },
    { value: '4.8★', label: 'Average Rating' },
];

export function HeroSection() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [location, setLocation] = useState('');
    const [guests, setGuests] = useState('');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location) params.set('query', location);
        if (guests) params.set('minCapacity', guests);
        navigate(`/search?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: { xs: '92vh', md: '88vh' },
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
            }}
        >
            {/* Background Image */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: 'scale(1.05)',
                    filter: 'brightness(0.45)',
                }}
            />

            {/* Gradient Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.85) 100%)',
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 12, md: 8 } }}>
                <Stack spacing={{ xs: 4, md: 5 }} alignItems="center" textAlign="center">
                    {/* Badge */}
                    <Chip
                        icon={<Iconify icon="mdi:star-circle" />}
                        label="India's #1 Venue Discovery Platform"
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.15)',
                            color: 'white',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            fontWeight: 600,
                            fontSize: 13,
                            px: 1,
                            '& .MuiChip-icon': { color: '#FFD700' },
                        }}
                    />

                    {/* Headline */}
                    <Box>
                        <Typography
                            variant="h1"
                            color="white"
                            fontWeight={800}
                            sx={{
                                fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4.2rem' },
                                lineHeight: 1.1,
                                letterSpacing: '-1.5px',
                                mb: 2,
                            }}
                        >
                            Find Your Perfect
                            <Box
                                component="span"
                                sx={{
                                    background: 'linear-gradient(135deg, #60A5FA 0%, #C084FC 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'block',
                                }}
                            >
                                Venue
                            </Box>
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255,255,255,0.8)',
                                fontWeight: 400,
                                fontSize: { xs: '1rem', md: '1.25rem' },
                                maxWidth: 600,
                                mx: 'auto',
                            }}
                        >
                            From intimate gatherings to grand celebrations — discover, book, and celebrate
                        </Typography>
                    </Box>

                    {/* Search Bar */}
                    <Paper
                        elevation={24}
                        sx={{
                            width: '100%',
                            maxWidth: 780,
                            borderRadius: { xs: 4, md: 6 },
                            p: { xs: 2, md: 2.5 },
                            bgcolor: 'rgba(255,255,255,0.97)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 1.5, sm: 1 }}
                            alignItems="stretch"
                        >
                            {/* Location Input */}
                            <OutlinedInput
                                placeholder="City, area, or venue name..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onKeyDown={handleKeyDown}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Iconify icon="mdi:map-marker-outline" color="primary.main" width={22} />
                                    </InputAdornment>
                                }
                                sx={{
                                    flex: 1,
                                    borderRadius: 3,
                                    '& .MuiOutlinedInput-notchedOutline': { border: '1.5px solid', borderColor: 'divider' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: 2 },
                                    fontSize: { xs: 15, md: 16 },
                                }}
                            />

                            {/* Guests Input */}
                            <OutlinedInput
                                placeholder="Guests"
                                value={guests}
                                type="number"
                                inputProps={{ min: 1 }}
                                onChange={(e) => setGuests(e.target.value)}
                                onKeyDown={handleKeyDown}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Iconify icon="mdi:account-group-outline" color="primary.main" width={22} />
                                    </InputAdornment>
                                }
                                sx={{
                                    width: { xs: '100%', sm: 160 },
                                    borderRadius: 3,
                                    '& .MuiOutlinedInput-notchedOutline': { border: '1.5px solid', borderColor: 'divider' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: 2 },
                                }}
                            />

                            {/* Search Button */}
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleSearch}
                                startIcon={!isMobile && <Iconify icon="mdi:magnify" />}
                                sx={{
                                    borderRadius: 3,
                                    px: { xs: 3, md: 4 },
                                    fontWeight: 700,
                                    fontSize: 16,
                                    background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                    boxShadow: '0 4px 20px rgba(24,119,242,0.35)',
                                    whiteSpace: 'nowrap',
                                    minHeight: 52,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #1565C0 0%, #6A1B9A 100%)',
                                        boxShadow: '0 6px 24px rgba(24,119,242,0.45)',
                                    },
                                }}
                            >
                                {isMobile ? 'Search Venues' : 'Search'}
                            </Button>
                        </Stack>
                    </Paper>

                    {/* Trending Searches */}
                    <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
                        <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ alignSelf: 'center' }}>
                            Trending:
                        </Typography>
                        {TRENDING_SEARCHES.map((term) => (
                            <Chip
                                key={term}
                                label={term}
                                onClick={() => navigate(`/search?query=${term}`)}
                                size="small"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(6px)',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                                }}
                            />
                        ))}
                    </Stack>

                    {/* Stats */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: { xs: 2, md: 5 },
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            mt: 2,
                        }}
                    >
                        {STATS.map((stat) => (
                            <Box key={stat.label} textAlign="center">
                                <Typography
                                    variant="h5"
                                    color="white"
                                    fontWeight={800}
                                    sx={{ fontSize: { xs: '1.3rem', md: '1.8rem' } }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography variant="caption" color="rgba(255,255,255,0.65)" sx={{ fontSize: 12 }}>
                                    {stat.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Stack>
            </Container>

            {/* Bottom Wave */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 80,
                    background: 'linear-gradient(to top, white 0%, transparent 100%)',
                }}
            />
        </Box>
    );
}
