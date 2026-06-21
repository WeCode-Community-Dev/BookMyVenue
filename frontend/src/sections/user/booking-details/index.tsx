import type { BookingStatus } from 'src/api/types/venue.type';

import dayjs from 'dayjs';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
    Box,
    Chip,
    Grid,
    Paper,
    Stack,
    Alert,
    Button,
    Dialog,
    Divider,
    Skeleton,
    Container,
    Typography,
    DialogTitle,
    Breadcrumbs,
    DialogActions,
    DialogContent,
    CircularProgress,
} from '@mui/material';

import { UserBookingApiService } from 'src/api/user-booking';

import { Iconify } from 'src/components/iconify';

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: 'default' | 'warning' | 'success' | 'error' | 'info'; icon: string; bg: string; text: string }> = {
    PENDING: { label: 'Pending Confirmation', color: 'warning', icon: 'mdi:clock-outline', bg: '#FFF8E1', text: '#F59E0B' },
    CONFIRMED: { label: 'Confirmed', color: 'success', icon: 'mdi:check-circle-outline', bg: '#F0FDF4', text: '#16A34A' },
    CANCELLED: { label: 'Cancelled', color: 'error', icon: 'mdi:close-circle-outline', bg: '#FEF2F2', text: '#DC2626' },
    COMPLETED: { label: 'Completed', color: 'info', icon: 'mdi:flag-checkered', bg: '#EFF6FF', text: '#2563EB' },
    REFUNDED: { label: 'Refunded', color: 'default', icon: 'mdi:cash-refund', bg: '#F9FAFB', text: '#6B7280' },
};

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: string }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" py={1.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
                {icon && <Iconify icon={icon} width={18} color="text.disabled" />}
                <Typography variant="body2" color="text.secondary">{label}</Typography>
            </Stack>
            <Typography variant="body2" fontWeight={600} textAlign="right" maxWidth={240}>{value}</Typography>
        </Stack>
    );
}

function BookingDetailsSkeleton() {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Skeleton variant="text" width={300} height={28} sx={{ mb: 3 }} />
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Skeleton variant="rounded" height={320} sx={{ borderRadius: 4, mb: 3 }} />
                    <Skeleton variant="rounded" height={200} sx={{ borderRadius: 4 }} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Skeleton variant="rounded" height={280} sx={{ borderRadius: 4 }} />
                </Grid>
            </Grid>
        </Container>
    );
}

export function BookingDetailsView() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { bookingId } = useParams<{ bookingId: string }>();
    const [cancelDialog, setCancelDialog] = useState(false);

    const { data: booking, isLoading, isError } = useQuery({
        queryKey: ['booking-details', bookingId],
        queryFn: () => UserBookingApiService.getBookingDetails(bookingId!),
        enabled: !!bookingId,
        retry: 1,
    });

    const cancelMutation = useMutation({
        mutationFn: () => UserBookingApiService.cancelBooking(bookingId!),
        onSuccess: () => {
            setCancelDialog(false);
            queryClient.invalidateQueries({ queryKey: ['booking-details', bookingId] });
            queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
        },
    });

    if (isLoading) return <BookingDetailsSkeleton />;

    if (isError || !booking) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <Iconify icon="mdi:alert-circle-outline" width={64} color="error.main" />
                <Typography variant="h5" fontWeight={700} mt={2} mb={1}>Booking Not Found</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    This booking may not exist or you don&apos;t have access to it.
                </Typography>
                <Button variant="contained" onClick={() => navigate('/my/bookings')} sx={{ borderRadius: 2.5 }}>
                    Back to My Bookings
                </Button>
            </Container>
        );
    }

    const statusCfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.PENDING;
    const bookingRef = (booking.bookingId ?? booking.id ?? '').slice(-8).toUpperCase();
    const nights = Math.max(1, dayjs(booking.endDate).diff(dayjs(booking.startDate), 'day'));
    const baseAmount = booking.totalAmount ? Math.round(booking.totalAmount / 1.1) : 0;
    const serviceFee = booking.totalAmount ? booking.totalAmount - baseAmount : 0;
    const canCancel = ['PENDING', 'CONFIRMED'].includes(booking.status);

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', pb: 8 }}>
            {/* Header Banner */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #0F1B40 0%, #1B0A3F 100%)',
                    pt: 5,
                    pb: 8,
                    mb: -4,
                }}
            >
                <Container maxWidth="lg">
                    <Breadcrumbs
                        separator={<Iconify icon="mdi:chevron-right" width={16} color="rgba(255,255,255,0.4)" />}
                        sx={{ mb: 2 }}
                    >
                        <Typography
                            variant="body2"
                            color="rgba(255,255,255,0.6)"
                            onClick={() => navigate('/my/bookings')}
                            sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}
                        >
                            My Bookings
                        </Typography>
                        <Typography variant="body2" color="white" fontWeight={600}>
                            Booking #{bookingRef}
                        </Typography>
                    </Breadcrumbs>

                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                        <Box>
                            <Typography variant="h4" color="white" fontWeight={800} mb={0.5}>
                                Booking Details
                            </Typography>
                            <Typography variant="body2" color="rgba(255,255,255,0.6)">
                                {booking.venue?.title || booking.venueName}
                            </Typography>
                        </Box>
                        <Chip
                            icon={<Iconify icon={statusCfg.icon} width={16} />}
                            label={statusCfg.label}
                            sx={{
                                bgcolor: statusCfg.bg,
                                color: statusCfg.text,
                                fontWeight: 700,
                                fontSize: 13,
                                height: 36,
                                px: 1,
                                '& .MuiChip-icon': { color: statusCfg.text },
                            }}
                        />
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={3}>
                    {/* Left column */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack spacing={3}>
                            {/* Venue Card */}
                            <Paper
                                elevation={0}
                                sx={{ borderRadius: 4, border: '1.5px solid', borderColor: 'divider', overflow: 'hidden' }}
                            >
                                <Box
                                    sx={{
                                        height: 200,
                                        backgroundImage: `url(${booking.venue?.images?.[0] || booking.venueThumbnail || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=70'})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                                <Box sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={700} mb={0.5}>
                                        {booking.venue?.title || booking.venueName}
                                    </Typography>
                                    <Stack direction="row" spacing={0.5} alignItems="center" mb={2}>
                                        <Iconify icon="mdi:map-marker" color="text.disabled" width={16} />
                                        <Typography variant="body2" color="text.secondary">
                                            {booking.venueCity}, {booking.venueState}
                                        </Typography>
                                    </Stack>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<Iconify icon="mdi:domain" />}
                                        onClick={() => navigate(`/venues/${booking.venueId}`)}
                                        sx={{ borderRadius: 2, fontWeight: 600 }}
                                    >
                                        View Venue
                                    </Button>
                                </Box>
                            </Paper>

                            {/* Booking Info */}
                            <Paper
                                elevation={0}
                                sx={{ borderRadius: 4, border: '1.5px solid', borderColor: 'divider', p: 3 }}
                            >
                                <Typography variant="h6" fontWeight={700} mb={2}>
                                    Booking Information
                                </Typography>

                                <Divider />
                                <InfoRow
                                    label="Booking Reference"
                                    value={`#${bookingRef}`}
                                    icon="mdi:identifier"
                                />
                                <Divider />
                                <InfoRow
                                    label="Check-in"
                                    value={dayjs(booking.startDate).format('dddd, DD MMMM YYYY')}
                                    icon="mdi:calendar-arrow-right"
                                />
                                <Divider />
                                <InfoRow
                                    label="Check-out"
                                    value={dayjs(booking.endDate).format('dddd, DD MMMM YYYY')}
                                    icon="mdi:calendar-arrow-left"
                                />
                                <Divider />
                                <InfoRow
                                    label="Duration"
                                    value={`${nights} day${nights !== 1 ? 's' : ''}`}
                                    icon="mdi:weather-night"
                                />
                                <Divider />
                                <InfoRow
                                    label="Guests"
                                    value={`${booking.guestsCount} people`}
                                    icon="mdi:account-group-outline"
                                />
                                <Divider />
                                <InfoRow
                                    label="Booked On"
                                    value={dayjs(booking.createdAt).format('DD MMM YYYY, hh:mm A')}
                                    icon="mdi:clock-outline"
                                />

                                {booking.specialRequests && (
                                    <>
                                        <Divider />
                                        <Box py={1.5}>
                                            <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                                                <Iconify icon="mdi:note-text-outline" width={18} color="text.disabled" />
                                                <Typography variant="body2" color="text.secondary">Special Requests</Typography>
                                            </Stack>
                                            <Box
                                                sx={{
                                                    bgcolor: 'primary.lighter',
                                                    borderRadius: 2,
                                                    p: 1.5,
                                                    mt: 0.5,
                                                }}
                                            >
                                                <Typography variant="body2" color="primary.dark">
                                                    {booking.specialRequests}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </>
                                )}
                            </Paper>

                            {/* Cancellation Policy */}
                            {canCancel && (
                                <Alert
                                    severity="info"
                                    icon={<Iconify icon="mdi:information-outline" />}
                                    sx={{ borderRadius: 3 }}
                                >
                                    Free cancellation available up to 48 hours before check-in. Cancellation fees may apply after that.
                                </Alert>
                            )}
                        </Stack>
                    </Grid>

                    {/* Right column */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={3} sx={{ position: 'sticky', top: 100 }}>
                            {/* Payment Summary */}
                            <Paper
                                elevation={0}
                                sx={{ borderRadius: 4, border: '1.5px solid', borderColor: 'divider', p: 3 }}
                            >
                                <Typography variant="h6" fontWeight={700} mb={2.5}>
                                    Payment Summary
                                </Typography>

                                <Stack spacing={1.5}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            Base amount ({nights} day{nights !== 1 ? 's' : ''})
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            ₹{baseAmount.toLocaleString('en-IN')}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">Service fee (10%)</Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            ₹{serviceFee.toLocaleString('en-IN')}
                                        </Typography>
                                    </Stack>
                                    <Divider />
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle2" fontWeight={800}>Total Paid</Typography>
                                        <Typography variant="h6" fontWeight={800} color="primary.main">
                                            ₹{(booking.totalAmount ?? 0).toLocaleString('en-IN')}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Paper>

                            {/* Status Card */}
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 4,
                                    border: '1.5px solid',
                                    borderColor: 'divider',
                                    p: 3,
                                    bgcolor: statusCfg.bg,
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                                    <Iconify icon={statusCfg.icon} width={22} color={statusCfg.text} />
                                    <Typography variant="subtitle2" fontWeight={700} color={statusCfg.text}>
                                        {statusCfg.label}
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    {booking.status === 'PENDING' && 'Your booking is awaiting confirmation from the venue host.'}
                                    {booking.status === 'CONFIRMED' && 'Your booking is confirmed. Enjoy your event!'}
                                    {booking.status === 'CANCELLED' && 'This booking has been cancelled.'}
                                    {booking.status === 'COMPLETED' && 'This booking has been completed. Thank you!'}
                                    {booking.status === 'REFUNDED' && 'A refund has been processed for this booking.'}
                                </Typography>
                            </Paper>

                            {/* Actions */}
                            <Stack spacing={1.5}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<Iconify icon="mdi:arrow-left" />}
                                    onClick={() => navigate('/my/bookings')}
                                    sx={{ borderRadius: 2.5, fontWeight: 600 }}
                                >
                                    Back to Bookings
                                </Button>

                                {canCancel && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        fullWidth
                                        startIcon={<Iconify icon="mdi:close-circle-outline" />}
                                        onClick={() => setCancelDialog(true)}
                                        sx={{ borderRadius: 2.5, fontWeight: 600 }}
                                    >
                                        Cancel Booking
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            {/* Cancel Confirmation Dialog */}
            <Dialog
                open={cancelDialog}
                onClose={() => setCancelDialog(false)}
                PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
            >
                <DialogTitle>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Iconify icon="mdi:alert-circle-outline" color="error.main" width={24} />
                        Cancel Booking
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        Are you sure you want to cancel booking <strong>#{bookingRef}</strong>?
                        This action cannot be undone. Cancellation fees may apply.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3, gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setCancelDialog(false)}
                        sx={{ borderRadius: 2.5, fontWeight: 600 }}
                    >
                        Keep Booking
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => cancelMutation.mutate()}
                        disabled={cancelMutation.isPending}
                        startIcon={cancelMutation.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
                        sx={{ borderRadius: 2.5, fontWeight: 700 }}
                    >
                        {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
