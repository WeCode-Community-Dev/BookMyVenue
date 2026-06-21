import type { BookingStatus, BookingSummary } from 'src/api/types/venue.type';

import dayjs from 'dayjs';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
    Box,
    Tab,
    Chip,
    Grid,
    Tabs,
    Paper,
    Stack,
    Button,
    Dialog,
    Divider,
    Skeleton,
    Container,
    Typography,
    DialogTitle,
    DialogActions,
    DialogContent,
} from '@mui/material';

import { UserBookingApiService } from 'src/api/user-booking';

import { Iconify } from 'src/components/iconify';

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: 'default' | 'warning' | 'success' | 'error' | 'info'; icon: string }> = {
    PENDING: { label: 'Pending', color: 'warning', icon: 'mdi:clock-outline' },
    CONFIRMED: { label: 'Confirmed', color: 'success', icon: 'mdi:check-circle-outline' },
    CANCELLED: { label: 'Cancelled', color: 'error', icon: 'mdi:close-circle-outline' },
    COMPLETED: { label: 'Completed', color: 'info', icon: 'mdi:flag-checkered' },
    REFUNDED: { label: 'Refunded', color: 'default', icon: 'mdi:cash-refund' },
};

interface BookingCardProps {
    booking: BookingSummary;
    onCancel: (id: string) => void;
}

function BookingCard({ booking, onCancel }: BookingCardProps) {
    const navigate = useNavigate();
    const statusCfg = STATUS_CONFIG[booking.status];
    const nights = Math.max(1, dayjs(booking.endDate).diff(dayjs(booking.startDate), 'day'));

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                border: '1.5px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
            }}
        >
            <Grid container>
                {/* Venue Image */}
                <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                    <Box
                        sx={{
                            height: { xs: 160, sm: '100%' },
                            minHeight: { sm: 160 },
                            backgroundImage: `url(${booking.venue?.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=70'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                </Grid>

                {/* Details */}
                <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                    <Box sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                            <Box flex={1} mr={2}>
                                <Typography variant="h6" fontWeight={700} noWrap>
                                    {booking.venue?.title || booking.venueName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Booking #{(booking.id ?? '').slice(-8).toUpperCase()}
                                </Typography>
                            </Box>
                            <Chip
                                icon={<Iconify icon={statusCfg?.icon} width={14} />}
                                label={statusCfg?.label}
                                color={statusCfg?.color}
                                size="small"
                                sx={{ fontWeight: 700, flexShrink: 0 }}
                            />
                        </Stack>

                        <Grid container spacing={2} mb={2}>
                            {[
                                { icon: 'mdi:calendar-arrow-right', label: 'Check-in', value: dayjs(booking.startDate).format('DD MMM YYYY') },
                                { icon: 'mdi:calendar-arrow-left', label: 'Check-out', value: dayjs(booking.endDate).format('DD MMM YYYY') },
                                { icon: 'mdi:weather-night', label: 'Duration', value: `${nights} day${nights !== 1 ? 's' : ''}` },
                                { icon: 'mdi:cash', label: 'Total Amount', value: `₹${booking.totalAmount.toLocaleString('en-IN')}` },
                            ].map((item) => (
                                <Grid key={item.label} size={{ xs: 6, md: 3 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Iconify icon={item?.icon} color="text.disabled" width={16} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">{item.label}</Typography>
                                            <Typography variant="body2" fontWeight={600}>{item.value}</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>

                        <Divider sx={{ mb: 2 }} />

                        <Stack direction="row" spacing={1.5} flexWrap="wrap" gap={0.5}>
                            <Link to={`/my/bookings/${booking.id}`}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Iconify icon="mdi:eye-outline" />}
                                    sx={{ borderRadius: 2, fontWeight: 600 }}
                                >
                                    View Details
                                </Button>
                            </Link>
                            <Link to={`/venues/${booking.venue.id}`}>
                                <Button
                                    size="small"
                                    variant="text"
                                    startIcon={<Iconify icon="mdi:domain" />}
                                    sx={{ borderRadius: 2, fontWeight: 600 }}
                                >
                                    View Venue
                                </Button>
                            </Link>
                            {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                                <Button
                                    size="small"
                                    variant="text"
                                    color="error"
                                    startIcon={<Iconify icon="mdi:close-circle-outline" />}
                                    onClick={() => onCancel(booking.id)}
                                    sx={{ borderRadius: 2, fontWeight: 600 }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}

function BookingCardSkeleton() {
    return (
        <Paper elevation={0} sx={{ borderRadius: 4, border: '1.5px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Grid container>
                <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                    <Skeleton variant="rectangular" height={200} />
                </Grid>
                <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                    <Box sx={{ p: 3 }}>
                        <Skeleton variant="text" width="50%" height={32} />
                        <Skeleton variant="text" width="30%" />
                        <Skeleton variant="rectangular" height={60} sx={{ mt: 2, borderRadius: 2 }} />
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}

const TAB_STATUSES = [
    { label: 'All Bookings', value: undefined as BookingStatus | undefined },
    // { label: 'Upcoming', value: 'CONFIRMED' as BookingStatus },
    // { label: 'Pending', value: 'PENDING' as BookingStatus },
    // { label: 'Completed', value: 'COMPLETED' as BookingStatus },
    // { label: 'Cancelled', value: 'CANCELLED' as BookingStatus },
];

export function MyBookingsView() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [tabIndex, setTabIndex] = useState(0);
    const [cancelDialogId, setCancelDialogId] = useState<string | null>(null);

    const selectedStatus = TAB_STATUSES[tabIndex].value;

    const { data, isLoading } = useQuery({
        queryKey: ['my-bookings', selectedStatus],
        queryFn: () => UserBookingApiService.getMyBookings(1, 20, selectedStatus),
        retry: false,
    });

    const cancelMutation = useMutation({
        mutationFn: (id: string) => UserBookingApiService.cancelBooking(id),
        onSuccess: () => {
            setCancelDialogId(null);
            queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
        },
    });

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
                    <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                        <Iconify icon="mdi:calendar-check" color="rgba(255,255,255,0.7)" width={28} />
                        <Typography variant="h4" color="white" fontWeight={800}>
                            My Bookings
                        </Typography>
                    </Stack>
                    <Typography variant="body1" color="rgba(255,255,255,0.6)">
                        Manage all your venue bookings in one place
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Tabs */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: '1.5px solid',
                        borderColor: 'divider',
                        mb: 3,
                        overflow: 'hidden',
                    }}
                >
                    <Tabs
                        value={tabIndex}
                        onChange={(_, v) => setTabIndex(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            px: 1,
                            '& .MuiTab-root': { fontWeight: 600, minHeight: 52 },
                            '& .Mui-selected': { color: 'primary.main' },
                        }}
                    >
                        {TAB_STATUSES.map((t) => (
                            <Tab key={t.label} label={t.label} />
                        ))}
                    </Tabs>
                </Paper>

                {/* Booking List */}
                <Stack spacing={2.5}>
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => <BookingCardSkeleton key={i} />)
                    ) : (data?.data?.length ?? 0) === 0 ? (
                        <Box textAlign="center" py={10}>
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    bgcolor: 'grey.100',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3,
                                }}
                            >
                                <Iconify icon="mdi:calendar-blank-outline" width={40} color="text.disabled" />
                            </Box>
                            <Typography variant="h6" fontWeight={700} mb={1}>
                                No bookings yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                {tabIndex === 0
                                    ? "You haven't made any bookings. Start exploring venues!"
                                    : `No ${TAB_STATUSES[tabIndex].label.toLowerCase()} bookings.`}
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/search')}
                                startIcon={<Iconify icon="mdi:magnify" />}
                                sx={{
                                    borderRadius: 2.5,
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                }}
                            >
                                Explore Venues
                            </Button>
                        </Box>
                    ) : (
                        (data?.data ?? []).map((booking) => (
                            <BookingCard key={booking.id} booking={booking} onCancel={(id) => setCancelDialogId(id)} />
                        ))
                    )}
                </Stack>
            </Container>

            {/* Cancel Confirmation Dialog */}
            <Dialog
                open={!!cancelDialogId}
                onClose={() => setCancelDialogId(null)}
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
                        Are you sure you want to cancel this booking? This action cannot be undone.
                        Cancellation fees may apply depending on the venue policy.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3, gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setCancelDialogId(null)}
                        sx={{ borderRadius: 2.5, fontWeight: 600 }}
                    >
                        Keep Booking
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => cancelMutation.mutate(cancelDialogId!)}
                        disabled={cancelMutation.isPending}
                        sx={{ borderRadius: 2.5, fontWeight: 700 }}
                    >
                        Cancel Booking
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
