import type { VenueReview } from 'src/api/types/venue.type';

import dayjs from 'dayjs';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
    Box,
    Stack,
    Avatar,
    Button,
    Rating,
    Divider,
    Skeleton,
    Typography,
} from '@mui/material';

import { VenuePublicApiService } from 'src/api/venue-public';

import { Iconify } from 'src/components/iconify';

dayjs.extend(relativeTime);

interface VenueReviewsProps {
    venueId: string;
    averageRating: number;
    reviewCount: number;
}

function ReviewCard({ review }: { review: VenueReview }) {
    const initials = `${review.user.firstName.charAt(0)}${review.user.lastName?.charAt(0) ?? ''}`.toUpperCase();

    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                    src={review.user.avatar}
                    sx={{
                        width: 44,
                        height: 44,
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                    }}
                >
                    {initials}
                </Avatar>
                <Box flex={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                            <Typography variant="subtitle2" fontWeight={700}>
                                {review.user.firstName} {review.user.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {dayjs(review.createdAt).fromNow()}
                            </Typography>
                        </Box>
                        <Rating value={review.rating} readOnly size="small" />
                    </Stack>
                    {review.comment && (
                        <Typography variant="body2" color="text.secondary" lineHeight={1.7} mt={1}>
                            {review.comment}
                        </Typography>
                    )}
                </Box>
            </Stack>
        </Box>
    );
}

function ReviewSkeleton() {
    return (
        <Stack direction="row" spacing={2}>
            <Skeleton variant="circular" width={44} height={44} />
            <Box flex={1}>
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="90%" />
            </Box>
        </Stack>
    );
}

export function VenueReviews({ venueId, averageRating, reviewCount }: VenueReviewsProps) {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['venue-reviews', venueId, page],
        queryFn: () => VenuePublicApiService.getVenueReviews(venueId, page),
        retry: false,
    });

    const RATING_BARS = [5, 4, 3, 2, 1];

    if (reviewCount === 0) return null;

    return (
        <Box>
            <Typography variant="h5" fontWeight={800} mb={3}>
                <Box component="span" sx={{ color: 'primary.main' }}>★</Box>
                {' '}{averageRating?.toFixed(1)} · {reviewCount} reviews
            </Typography>

            {/* Rating Breakdown */}
            <Stack spacing={1.5} mb={4} maxWidth={360}>
                {RATING_BARS.map((star) => (
                    <Stack key={star} direction="row" spacing={2} alignItems="center">
                        <Typography variant="caption" fontWeight={600} sx={{ width: 8 }}>{star}</Typography>
                        <Iconify icon="mdi:star" width={14} color="warning.main" />
                        <Box sx={{ flex: 1, height: 6, bgcolor: 'grey.200', borderRadius: 3, overflow: 'hidden' }}>
                            <Box
                                sx={{
                                    height: '100%',
                                    bgcolor: 'warning.main',
                                    borderRadius: 3,
                                    width: `${Math.random() * 60 + 20}%`,
                                }}
                            />
                        </Box>
                    </Stack>
                ))}
            </Stack>

            <Divider sx={{ mb: 4 }} />

            {/* Reviews */}
            <Stack spacing={3} divider={<Divider />}>
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => <ReviewSkeleton key={i} />)
                    : (data?.data ?? []).map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))
                }
            </Stack>

            {data && data.totalPages > 1 && (
                <Button
                    variant="outlined"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!data.hasNext}
                    sx={{ mt: 3, borderRadius: 2.5, fontWeight: 600 }}
                >
                    Load More Reviews
                </Button>
            )}
        </Box>
    );
}
