import type { VenueCard } from 'src/api/types/venue.type';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    Box,
    Card,
    Chip,
    Stack,
    Rating,
    Tooltip,
    Skeleton,
    IconButton,
    Typography,
    CardContent,
    CardActionArea,
} from '@mui/material';

import { useAuth } from 'src/context/auth/use-auth';
import { VenuePublicApiService } from 'src/api/venue-public';

import { Iconify } from 'src/components/iconify';

interface VenueSearchCardProps {
    venue: VenueCard;
}

export function VenueSearchCard({ venue }: VenueSearchCardProps) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const [saved, setSaved] = useState(venue.isSaved ?? false);

    const saveMutation = useMutation({
        mutationFn: () =>
            saved
                ? VenuePublicApiService.unsaveVenue(venue.id)
                : VenuePublicApiService.saveVenue(venue.id),
        onSuccess: () => {
            setSaved((prev) => !prev);
            queryClient.invalidateQueries({ queryKey: ['saved-venues'] });
        },
    });

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/sign-in');
            return;
        }
        saveMutation.mutate();
    };

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
                        src={venue.thumbnail || venue.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=70'}
                        alt={venue.title}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.4s ease',
                            '&:hover': { transform: 'scale(1.06)' },
                        }}
                    />

                    {/* Type Badge */}
                    <Chip
                        label={VENUE_TYPE_LABELS[venue.venueType] ?? venue.venueType.replace(/_/g, ' ')}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            bgcolor: 'rgba(0,0,0,0.55)',
                            color: 'white',
                            fontWeight: 600,
                            backdropFilter: 'blur(6px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            fontSize: 10,
                        }}
                    />

                    {/* Save Button */}
                    <Tooltip title={saved ? 'Remove from favorites' : 'Save to favorites'}>
                        <IconButton
                            size="small"
                            onClick={handleSave}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(255,255,255,0.92)',
                                backdropFilter: 'blur(6px)',
                                '&:hover': { bgcolor: 'white' },
                            }}
                        >
                            <Iconify
                                icon={saved ? 'mdi:heart' : 'mdi:heart-outline'}
                                color={saved ? '#FF4757' : 'text.secondary'}
                                width={18}
                            />
                        </IconButton>
                    </Tooltip>
                </Box>

                <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="subtitle1" fontWeight={700} noWrap gutterBottom>
                        {venue.title}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={0.5} mb={1.5}>
                        <Iconify icon="mdi:map-marker" color="text.disabled" width={15} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {venue.city}, {venue.state}
                        </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <Rating value={venue.averageRating ?? 0} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {(venue.averageRating ?? 0).toFixed(1)}
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                            ({venue.reviewCount ?? 0} reviews)
                        </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h6" fontWeight={800} color="primary.main" display="inline">
                                ₹{venue.pricePerDay.toLocaleString('en-IN')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {' '}/day
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Iconify icon="mdi:account-group-outline" width={15} color="text.disabled" />
                            <Typography variant="caption" color="text.secondary">
                                Up to {venue.capacity}
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export function VenueSearchCardSkeleton() {
    return (
        <Card sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent sx={{ p: 2.5 }}>
                <Skeleton variant="text" width="75%" height={24} />
                <Skeleton variant="text" width="55%" />
                <Skeleton variant="text" width="45%" />
                <Stack direction="row" justifyContent="space-between" mt={1}>
                    <Skeleton variant="text" width="35%" />
                    <Skeleton variant="text" width="25%" />
                </Stack>
            </CardContent>
        </Card>
    );
}
