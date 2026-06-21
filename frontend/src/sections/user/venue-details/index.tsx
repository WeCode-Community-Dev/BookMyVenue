import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';

import {
    Box,
    Chip,
    Grid,
    Stack,
    Button,
    Divider,
    Skeleton,
    Container,
    Typography,
    Breadcrumbs,
} from '@mui/material';

import { VenuePublicApiService } from 'src/api/venue-public';

import { Iconify } from 'src/components/iconify';

import { VenueReviews } from './venue-reviews';
import { VenueAmenities } from './venue-amenities';
import { VenueBookingCard } from './venue-booking-card';
import { VenueImageGallery } from './venue-image-gallery';

const VENUE_TYPE_LABELS: Record<string, string> = {
    BANQUET_HALL: 'Banquet Hall',
    CONFERENCE_ROOM: 'Conference Room',
    MEETING_ROOM: 'Meeting Room',
    CAFE: 'Café',
    RESTAURANT: 'Restaurant',
    HOTEL: 'Hotel',
    RESORT: 'Resort',
    PARTY_HALL: 'Party Hall',
    EVENT_SPACE: 'Event Space',
    AUDITORIUM: 'Auditorium',
    OTHER: 'Other',
};

export function VenueDetailsView() {
    const { venueId } = useParams<{ venueId: string }>();
    const navigate = useNavigate();

    const { data: venue, isLoading, isError } = useQuery({
        queryKey: ['venue-details', venueId],
        queryFn: () => VenuePublicApiService.getVenueDetails(venueId!),
        enabled: !!venueId,
        retry: 1,
    });

    if (isLoading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Skeleton variant="rounded" height={500} sx={{ borderRadius: 4, mb: 4 }} />
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Skeleton variant="text" width="60%" height={48} />
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="80%" sx={{ mt: 3 }} />
                        <Skeleton variant="text" width="90%" />
                        <Skeleton variant="text" width="70%" />
                    </Grid>
                </Grid>
            </Container>
        );
    }

    if (isError || !venue) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <Iconify icon="mdi:alert-circle-outline" width={64} color="error.main" />
                <Typography variant="h5" fontWeight={700} mt={2} mb={1}>
                    Venue Not Found
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    This venue may not exist or is temporarily unavailable.
                </Typography>
                <Button variant="contained" onClick={() => navigate('/search')} sx={{ borderRadius: 2.5 }}>
                    Browse All Venues
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ pb: 8 }}>
            {/* Breadcrumbs */}
            <Container maxWidth="xl" sx={{ py: 2 }}>
                <Breadcrumbs separator={<Iconify icon="mdi:chevron-right" width={16} />}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        onClick={() => navigate('/')}
                        sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                    >
                        Home
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        onClick={() => navigate('/search')}
                        sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                    >
                        Venues
                    </Typography>
                    <Typography variant="body2" color="text.primary" fontWeight={600} noWrap maxWidth={200}>
                        {venue.title}
                    </Typography>
                </Breadcrumbs>
            </Container>

            {/* Gallery */}
            <Container maxWidth="xl" sx={{ mb: 4 }}>
                <VenueImageGallery images={venue.images} title={venue.title} />
            </Container>

            <Container maxWidth="xl">
                <Grid container spacing={5}>
                    {/* Left Column */}
                    <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                        <Stack spacing={5}>
                            {/* Title & Key Info */}
                            <Box>
                                <Stack direction="row" spacing={1} mb={1.5} flexWrap="wrap" gap={0.5}>
                                    <Chip
                                        label={VENUE_TYPE_LABELS[venue.venueType] ?? venue.venueType.replace(/_/g, ' ')}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                    {venue.status === 'APPROVED' && (
                                        <Chip
                                            icon={<Iconify icon="mdi:shield-check" width={14} />}
                                            label="Verified"
                                            size="small"
                                            sx={{ bgcolor: 'success.lighter', color: 'success.dark', border: 'none' }}
                                        />
                                    )}
                                </Stack>

                                <Typography variant="h3" fontWeight={800} mb={1.5} letterSpacing="-0.5px">
                                    {venue.title}
                                </Typography>

                                <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Iconify icon="mdi:map-marker" color="primary.main" width={18} />
                                        <Typography variant="body1" fontWeight={500}>
                                            {venue.city ?? venue.address?.city}, {venue.state ?? venue.address?.state}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Iconify icon="mdi:star" color="warning.main" width={18} />
                                        <Typography variant="body1" fontWeight={700}>{(venue.averageRating ?? 0).toFixed(1)}</Typography>
                                        <Typography variant="body2" color="text.secondary">({venue.reviewCount ?? 0} reviews)</Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Iconify icon="mdi:account-group" color="text.secondary" width={18} />
                                        <Typography variant="body1" color="text.secondary">Up to {venue.capacity} guests</Typography>
                                    </Stack>
                                </Stack>
                            </Box>

                            <Divider />

                            {/* Host Info */}
                            {venue.owner && (
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 800,
                                        fontSize: 18,
                                        flexShrink: 0,
                                    }}
                                >
                                    {venue.owner.firstName.charAt(0)}
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={700}>
                                        Hosted by {venue.owner.firstName} {venue.owner.lastName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {venue.owner.email}
                                    </Typography>
                                </Box>
                            </Stack>
                            )}

                            <Divider />

                            {/* Key Stats */}
                            <Grid container spacing={2}>
                                {[
                                    { icon: 'mdi:account-group', label: 'Max Capacity', value: `${venue.capacity} guests` },
                                    { icon: 'mdi:cash', label: 'Price Per Day', value: `₹${venue.pricePerDay.toLocaleString('en-IN')}` },
                                    { icon: 'mdi:map-marker', label: 'Location', value: `${venue.city ?? venue.address?.city}, ${venue.state ?? venue.address?.state}` },
                                    { icon: 'mdi:domain', label: 'Venue Type', value: VENUE_TYPE_LABELS[venue.venueType] ?? venue.venueType },
                                ].map((stat) => (
                                    <Grid key={stat.label} size={{ xs: 6, sm: 3 }}>
                                        <Box
                                            sx={{
                                                textAlign: 'center',
                                                p: 2,
                                                borderRadius: 3,
                                                bgcolor: 'grey.50',
                                                border: '1.5px solid',
                                                borderColor: 'divider',
                                            }}
                                        >
                                            <Iconify icon={stat.icon} width={24} color="primary.main" />
                                            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                                {stat.label}
                                            </Typography>
                                            <Typography variant="body2" fontWeight={700} mt={0.5}>
                                                {stat.value}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>

                            <Divider />

                            {/* Description */}
                            <Box>
                                <Typography variant="h5" fontWeight={800} mb={2}>
                                    About this venue
                                </Typography>
                                <Typography variant="body1" color="text.secondary" lineHeight={1.9}>
                                    {venue.description}
                                </Typography>
                            </Box>

                            <Divider />

                            {/* Address */}
                            <Box>
                                <Typography variant="h5" fontWeight={800} mb={2}>
                                    Location
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="flex-start">
                                    <Iconify icon="mdi:map-marker" color="primary.main" width={22} sx={{ mt: 0.3, flexShrink: 0 }} />
                                    <Typography variant="body1" color="text.secondary">
                                        {venue.addressLine1 ?? venue.address?.addressLine1}
                                        {(venue.address?.addressLine2) && `, ${venue.address.addressLine2}`}
                                        {', '}{venue.city ?? venue.address?.city}, {venue.state ?? venue.address?.state} - {venue.postalCode ?? venue.address?.postalCode}
                                    </Typography>
                                </Stack>

                                {/* Map Placeholder */}
                                <Box
                                    sx={{
                                        mt: 2,
                                        height: 200,
                                        borderRadius: 3,
                                        bgcolor: 'grey.100',
                                        border: '1.5px solid',
                                        borderColor: 'divider',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1,
                                        color: 'text.secondary',
                                        overflow: 'hidden',
                                        backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?center=${venue.city ?? venue.address?.city},${venue.state ?? venue.address?.state}&zoom=14&size=800x200&style=feature:all|element:geometry|color:0xf5f5f5)`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <Iconify icon="mdi:map-outline" width={32} />
                                    <Typography variant="body2">{venue.city ?? venue.address?.city}, {venue.state ?? venue.address?.state}</Typography>
                                </Box>
                            </Box>

                            <Divider />

                            {/* Amenities */}
                            <VenueAmenities amenities={venue.amenities} />

                            {venue.amenities.length > 0 && <Divider />}

                            {/* Reviews */}
                            <VenueReviews
                                venueId={venue.id}
                                averageRating={venue.averageRating ?? 0}
                                reviewCount={venue.reviewCount ?? 0}
                            />
                        </Stack>
                    </Grid>

                    {/* Right Column - Booking Card */}
                    <Grid size={{ xs: 12, md: 5, lg: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <VenueBookingCard venue={venue} />
                    </Grid>
                </Grid>

                {/* Mobile Sticky Bottom Bar */}
                <Box
                    sx={{
                        display: { xs: 'flex', md: 'none' },
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 2,
                        bgcolor: 'background.paper',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
                        zIndex: 50,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography variant="h6" fontWeight={800} color="primary.main">
                            ₹{venue.pricePerDay.toLocaleString('en-IN')}
                            <Typography component="span" variant="body2" color="text.secondary" fontWeight={400}> /day</Typography>
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Iconify icon="mdi:star" color="warning.main" width={14} />
                            <Typography variant="caption" fontWeight={700}>{(venue.averageRating ?? 0).toFixed(1)}</Typography>
                        </Stack>
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate(`/booking/${venue.id}`)}
                        sx={{
                            borderRadius: 3,
                            fontWeight: 700,
                            px: 4,
                            background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                        }}
                    >
                        Book Now
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
