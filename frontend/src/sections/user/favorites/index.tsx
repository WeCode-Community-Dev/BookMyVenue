import type { SavedVenue } from 'src/api/types/venue.type';

import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
    Box,
    Card,
    Grid,
    Stack,
    Button,
    Rating,
    Tooltip,
    Skeleton,
    Container,
    IconButton,
    Typography,
    CardContent,
    CardActionArea,
} from '@mui/material';

import { UserFavoritesApiService } from 'src/api/user-favorites';

import { Iconify } from 'src/components/iconify';

function FavoriteCard({ savedVenue, onUnsave }: { savedVenue: SavedVenue; onUnsave: (id: string) => void }) {
    const navigate = useNavigate();
    const { venue } = savedVenue;

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
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.1)',
                    borderColor: 'primary.main',
                },
            }}
        >
            <CardActionArea onClick={() => navigate(`/venues/${venue.id}`)}>
                <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <Box
                        component="img"
                        src={venue.thumbnail || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=70'}
                        alt={venue.title}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Tooltip title="Remove from favorites">
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); onUnsave(venue.id); }}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(255,255,255,0.92)',
                                color: 'error.main',
                                '&:hover': { bgcolor: 'white', transform: 'scale(1.1)' },
                                transition: 'all 0.2s',
                            }}
                        >
                            <Iconify icon="mdi:heart" width={18} />
                        </IconButton>
                    </Tooltip>
                </Box>
                <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="subtitle1" fontWeight={700} noWrap gutterBottom>
                        {venue.title}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5} mb={1.5}>
                        <Iconify icon="mdi:map-marker" color="text.disabled" width={14} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {venue.city}, {venue.state}
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <Rating value={venue.averageRating} readOnly size="small" precision={0.1} />
                        <Typography variant="body2" fontWeight={600}>{venue.averageRating?.toFixed(1) ?? '0.0'}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight={800} color="primary.main">
                            ₹{venue.pricePerDay.toLocaleString('en-IN')}
                            <Typography component="span" variant="caption" color="text.secondary" fontWeight={400}> /day</Typography>
                        </Typography>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={(e) => { e.stopPropagation(); navigate(`/booking/${venue.id}`); }}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 700,
                                fontSize: 12,
                                py: 0.5,
                                background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                boxShadow: 'none',
                            }}
                        >
                            Book
                        </Button>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

function FavoriteCardSkeleton() {
    return (
        <Card sx={{ borderRadius: 4, border: '1.5px solid', borderColor: 'divider' }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent sx={{ p: 2.5 }}>
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="60%" />
            </CardContent>
        </Card>
    );
}

export function FavoritesView() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['saved-venues'],
        queryFn: () => UserFavoritesApiService.getSavedVenues(1, 24),
        retry: false,
    });

    const unsaveMutation = useMutation({
        mutationFn: (venueId: string) => UserFavoritesApiService.unsaveVenue(venueId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-venues'] }),
    });

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', pb: 8 }}>
            {/* Header */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                    pt: 5,
                    pb: 8,
                    mb: -4,
                }}
            >
                <Container maxWidth="lg">
                    <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                        <Iconify icon="mdi:heart" color="rgba(255,255,255,0.9)" width={28} />
                        <Typography variant="h4" color="white" fontWeight={800}>
                            My Favorites
                        </Typography>
                    </Stack>
                    <Typography variant="body1" color="rgba(255,255,255,0.75)">
                        Venues you&apos;ve saved for later
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {isLoading ? (
                    <Grid container spacing={3}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                                <FavoriteCardSkeleton />
                            </Grid>
                        ))}
                    </Grid>
                ) : data?.data.length === 0 ? (
                    <Box textAlign="center" py={10}>
                        <Box
                            sx={{
                                width: 88,
                                height: 88,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #FFE4E6 0%, #FCE7F3 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3,
                            }}
                        >
                            <Iconify icon="mdi:heart-broken-outline" width={44} color="error.light" />
                        </Box>
                        <Typography variant="h5" fontWeight={700} mb={1}>
                            No saved venues yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={4} maxWidth={360} mx="auto">
                            Tap the heart icon on any venue to save it here for easy access later.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/search')}
                            startIcon={<Iconify icon="mdi:magnify" />}
                            sx={{
                                borderRadius: 3,
                                fontWeight: 700,
                                px: 4,
                                background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                            }}
                        >
                            Discover Venues
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6" fontWeight={700}>
                                {data?.total ?? 0} saved venue{(data?.total ?? 0) !== 1 ? 's' : ''}
                            </Typography>
                        </Stack>
                        <Grid container spacing={3}>
                            {data?.data.map((savedVenue) => (
                                <Grid key={savedVenue.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FavoriteCard
                                        savedVenue={savedVenue}
                                        onUnsave={(id) => unsaveMutation.mutate(id)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}
            </Container>
        </Box>
    );
}
