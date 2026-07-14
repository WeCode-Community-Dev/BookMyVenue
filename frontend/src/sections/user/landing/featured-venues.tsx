import type { VenueCard } from 'src/api/types/venue.type';

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import {
    Box,
    Card,
    Chip,
    Grid,
    Stack,
    Button,
    Rating,
    Skeleton,
    Container,
    Typography,
    CardContent,
    CardActionArea,
} from '@mui/material';

import { VenuePublicApiService } from 'src/api/venue-public';

import { Iconify } from 'src/components/iconify';

const MOCK_VENUES: VenueCard[] = [
    {
        id: '1', title: 'The Grand Ballroom', venueType: 'BANQUET_HALL',
        city: 'Mumbai', state: 'Maharashtra', country: 'India',
        capacity: 500, pricePerDay: 85000, averageRating: 4.9, reviewCount: 248,
        thumbnail: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=75',
        isSaved: false,
        description: 'Elegant ballroom for premium events',
    },
    {
        id: '2', title: 'Sky Garden Terrace', venueType: 'EVENT_SPACE',
        city: 'Bangalore', state: 'Karnataka', country: 'India',
        capacity: 200, pricePerDay: 42000, averageRating: 4.7, reviewCount: 185,
        thumbnail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=75',
        isSaved: true,
        description: 'Stunning rooftop with city views',
    },
    {
        id: '3', title: 'The Conference Hub', venueType: 'CONFERENCE_ROOM',
        city: 'Delhi', state: 'Delhi', country: 'India',
        capacity: 100, pricePerDay: 22000, averageRating: 4.8, reviewCount: 312,
        thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=75',
        isSaved: false,
        description: 'Modern conference room in the heart of Delhi',
    },
    {
        id: '4', title: 'Heritage Manor', venueType: 'HOTEL',
        city: 'Udaipur', state: 'Rajasthan', country: 'India',
        capacity: 300, pricePerDay: 120000, averageRating: 4.9, reviewCount: 97,
        thumbnail: 'https://images.unsplash.com/photo-1551882547-ff40c4a49a5c?w=600&q=75',
        isSaved: false,
        description: 'Royal heritage property by the lake',
    },
    {
        id: '5', title: 'La Bella Cucina', venueType: 'RESTAURANT',
        city: 'Pune', state: 'Maharashtra', country: 'India',
        capacity: 80, pricePerDay: 18000, averageRating: 4.6, reviewCount: 421,
        thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=75',
        isSaved: true,
        description: 'Exquisite restaurant for private dining',
    },
    {
        id: '6', title: 'The Party Loft', venueType: 'PARTY_HALL',
        city: 'Hyderabad', state: 'Telangana', country: 'India',
        capacity: 150, pricePerDay: 35000, averageRating: 4.7, reviewCount: 163,
        thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=75',
        isSaved: false,
        description: 'Vibrant party space with great amenities',
    },
];

function VenueCardSkeleton() {
    return (
        <Card sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <Skeleton variant="rectangular" height={220} />
            <CardContent>
                <Skeleton variant="text" width="70%" height={24} />
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="40%" />
            </CardContent>
        </Card>
    );
}

interface VenueCardItemProps {
    venue: VenueCard;
}

function VenueCardItem({ venue }: VenueCardItemProps) {
    const navigate = useNavigate();

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                overflow: 'hidden',
                border: '1.5px solid',
                borderColor: 'divider',
                transition: 'all 0.25s ease',
                '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                    borderColor: 'primary.main',
                },
            }}
        >
            <CardActionArea onClick={() => navigate(`/venues/${venue.id}`)}>
                {/* Image */}
                <Box sx={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                    <Box
                        component="img"
                        src={venue.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=75'}
                        alt={venue.title}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.4s ease',
                            '&:hover': { transform: 'scale(1.05)' },
                        }}
                    />
                    {/* Type Badge */}
                    <Chip
                        label={venue.venueType.replace(/_/g, ' ')}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            bgcolor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            fontWeight: 600,
                            backdropFilter: 'blur(6px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            fontSize: 10,
                        }}
                    />
                    {/* Heart */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255,255,255,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(6px)',
                        }}
                    >
                        <Iconify
                            icon={venue.isSaved ? 'mdi:heart' : 'mdi:heart-outline'}
                            color={venue.isSaved ? 'error.main' : 'text.secondary'}
                            width={18}
                        />
                    </Box>
                </Box>

                {/* Info */}
                <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="subtitle1" fontWeight={700} noWrap gutterBottom>
                        {venue.title}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5} mb={1}>
                        <Iconify icon="mdi:map-marker" color="text.secondary" width={16} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {venue.city}, {venue.state}
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                        <Rating value={venue.averageRating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                            {venue.averageRating?.toFixed(1) ?? '0.0'} ({venue.reviewCount ?? 0})
                        </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="caption" color="text.secondary">Starting from</Typography>
                            <Typography variant="h6" fontWeight={800} color="primary.main">
                                ₹{venue.pricePerDay.toLocaleString('en-IN')}
                                <Typography component="span" variant="body2" color="text.secondary" fontWeight={400}>
                                    {' '}/day
                                </Typography>
                            </Typography>
                        </Box>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Iconify icon="mdi:account-group" width={16} color="text.secondary" />
                            <Typography variant="body2" color="text.secondary">{venue.capacity}</Typography>
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export function FeaturedVenues() {
    const navigate = useNavigate();

    const { data: venues, isLoading } = useQuery({
        queryKey: ['featured-venues'],
        queryFn: () => VenuePublicApiService.getFeaturedVenues(),
        retry: false,
    });

    const displayVenues = venues?.data && venues.data.length > 0 ? venues.data : MOCK_VENUES;

    return (
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'grey.50' }}>
            <Container maxWidth="xl">
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-end' }} mb={5} spacing={2}>
                    <Box>
                        <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={2}>
                            Featured
                        </Typography>
                        <Typography variant="h3" fontWeight={800} letterSpacing="-0.5px">
                            Top Venues Near You
                        </Typography>
                        <Typography variant="body1" color="text.secondary" mt={1}>
                            Handpicked spaces for unforgettable events
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/search')}
                        endIcon={<Iconify icon="mdi:arrow-right" />}
                        sx={{ borderRadius: 2, fontWeight: 600, whiteSpace: 'nowrap' }}
                    >
                        View All Venues
                    </Button>
                </Stack>

                <Grid container spacing={3}>
                    {isLoading
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                                <VenueCardSkeleton />
                            </Grid>
                        ))
                        : displayVenues.slice(0, 6).map((venue) => (
                            <Grid key={venue.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                <VenueCardItem venue={venue} />
                            </Grid>
                        ))
                    }
                </Grid>
            </Container>
        </Box>
    );
}
