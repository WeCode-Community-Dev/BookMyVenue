import type { VenueDetails } from 'src/api/types/venue.type';

import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    Chip,
    Alert,
    Paper,
    Stack,
    Button,
    Rating,
    Slider,
    Divider,
    Typography,
} from '@mui/material';

import { useAuth } from 'src/context/auth/use-auth';

import { Iconify } from 'src/components/iconify';

interface VenueBookingCardProps {
    venue: VenueDetails;
}

export function VenueBookingCard({ venue }: VenueBookingCardProps) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [guests, setGuests] = useState(10);

    const nights =
        startDate && endDate
            ? Math.max(1, dayjs(endDate).diff(dayjs(startDate), 'day'))
            : 0;

    const baseAmount = nights * venue.pricePerDay;
    const serviceFee = Math.round(baseAmount * 0.1);
    const total = baseAmount + serviceFee;

    const handleBook = () => {
        if (!isAuthenticated) {
            navigate('/sign-in');
            return;
        }
        const params = new URLSearchParams();
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);
        params.set('guests', String(guests));
        navigate(`/booking/${venue.id}?${params.toString()}`);
    };

    const today = dayjs().format('YYYY-MM-DD');

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                border: '1.5px solid',
                borderColor: 'divider',
                p: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                position: 'sticky',
                top: 100,
            }}
        >
            {/* Price */}
            <Stack direction="row" alignItems="baseline" spacing={0.5} mb={0.5}>
                <Typography variant="h4" fontWeight={800} color="primary.main">
                    ₹{venue.pricePerDay.toLocaleString('en-IN')}
                </Typography>
                <Typography variant="body2" color="text.secondary">/day</Typography>
            </Stack>

            {/* Rating */}
            <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                <Rating value={venue.averageRating ?? 0} precision={0.1} readOnly size="small" />
                <Typography variant="body2" fontWeight={600}>{(venue.averageRating ?? 0).toFixed(1)}</Typography>
                <Typography variant="body2" color="text.secondary">· {venue.reviewCount ?? 0} reviews</Typography>
            </Stack>

            {/* Date Inputs */}
            <Stack spacing={1.5} mb={2}>
                <Box
                    sx={{
                        border: '1.5px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                        overflow: 'hidden',
                    }}
                >
                    <Stack direction="row">
                        <Box sx={{ flex: 1, p: 2, borderRight: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={0.5}>
                                CHECK-IN
                            </Typography>
                            <Box
                                component="input"
                                type="date"
                                value={startDate}
                                min={today}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    if (endDate && e.target.value >= endDate) setEndDate('');
                                }}
                                sx={{
                                    border: 'none',
                                    outline: 'none',
                                    width: '100%',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    bgcolor: 'transparent',
                                    color: 'text.primary',
                                    fontFamily: 'inherit',
                                }}
                            />
                        </Box>
                        <Box sx={{ flex: 1, p: 2 }}>
                            <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={0.5}>
                                CHECK-OUT
                            </Typography>
                            <Box
                                component="input"
                                type="date"
                                value={endDate}
                                min={startDate || today}
                                onChange={(e) => setEndDate(e.target.value)}
                                sx={{
                                    border: 'none',
                                    outline: 'none',
                                    width: '100%',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    bgcolor: 'transparent',
                                    color: 'text.primary',
                                    fontFamily: 'inherit',
                                }}
                            />
                        </Box>
                    </Stack>
                </Box>

                {/* Guests */}
                <Box
                    sx={{
                        border: '1.5px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                        p: 2,
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                            GUESTS
                        </Typography>
                        <Chip
                            icon={<Iconify icon="mdi:account-group" width={16} />}
                            label={`${guests} guests`}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    </Stack>
                    <Slider
                        value={guests}
                        onChange={(_, v) => setGuests(v as number)}
                        min={1}
                        max={venue.capacity}
                        step={1}
                        size="small"
                        sx={{ mx: 0.5 }}
                    />
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">1</Typography>
                        <Typography variant="caption" color="text.secondary">{venue.capacity} max</Typography>
                    </Stack>
                </Box>
            </Stack>

            {/* Book Button */}
            <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleBook}
                sx={{
                    borderRadius: 3,
                    fontWeight: 800,
                    py: 1.8,
                    fontSize: 16,
                    background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                    boxShadow: '0 4px 20px rgba(24,119,242,0.35)',
                    mb: 2,
                    '&:hover': {
                        background: 'linear-gradient(135deg, #1565C0 0%, #6A1B9A 100%)',
                        boxShadow: '0 8px 28px rgba(24,119,242,0.45)',
                    },
                }}
            >
                {isAuthenticated ? 'Reserve Now' : 'Sign In to Book'}
            </Button>

            {!isAuthenticated && (
                <Alert
                    severity="info"
                    sx={{ borderRadius: 2.5, mb: 2, fontSize: 12 }}
                >
                    Create a free account to book this venue
                </Alert>
            )}

            {/* Price Breakdown */}
            {nights > 0 && (
                <>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                                ₹{venue.pricePerDay.toLocaleString('en-IN')} × {nights} day{nights !== 1 ? 's' : ''}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                ₹{baseAmount.toLocaleString('en-IN')}
                            </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Service fee (10%)</Typography>
                            <Typography variant="body2" fontWeight={600}>₹{serviceFee.toLocaleString('en-IN')}</Typography>
                        </Stack>
                        <Divider />
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle2" fontWeight={800}>Total</Typography>
                            <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                                ₹{total.toLocaleString('en-IN')}
                            </Typography>
                        </Stack>
                    </Stack>
                </>
            )}

            {/* Trust Badges */}
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
                {[
                    { icon: 'mdi:shield-check', text: 'Verified venue' },
                    { icon: 'mdi:lock-check', text: 'Secure payment' },
                    { icon: 'mdi:calendar-remove', text: 'Free cancellation (48hr)' },
                ].map((item) => (
                    <Stack key={item.text} direction="row" spacing={1} alignItems="center">
                        <Iconify icon={item.icon} width={16} color="success.main" />
                        <Typography variant="caption" color="text.secondary">{item.text}</Typography>
                    </Stack>
                ))}
            </Stack>
        </Paper>
    );
}
