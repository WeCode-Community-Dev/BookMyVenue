import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import {
    Box,
    Card,
    Grid,
    Stack,
    Table,
    Button,
    Divider,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    Typography,
    CardContent,
    TableContainer,
    CircularProgress,
} from '@mui/material';

import { DashboardApiService } from 'src/api/dashboard';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
    label,
    value,
    icon,
    color,
    sub,
}: {
    label: string;
    value: string | number;
    icon: string;
    color: string;
    sub?: string;
}) {
    return (
        <Card elevation={0} sx={{ border: '1.5px solid', borderColor: 'divider', borderRadius: 3, height: '100%' }}>
            <CardContent>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={500} mb={1}>
                            {label}
                        </Typography>
                        <Typography variant="h4" fontWeight={800}>
                            {value}
                        </Typography>
                        {sub && (
                            <Typography variant="caption" color="text.disabled" mt={0.5} display="block">
                                {sub}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: `${color}.lighter`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <Iconify icon={icon} width={26} sx={{ color: `${color}.main` }} />
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function OwnerDashboard() {
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ['owner-dashboard'],
        queryFn: DashboardApiService.getOwnerDashboard,
        retry: false,
    });

    const avgRevenuePerBooking =
        data && data.bookingCount > 0
            ? Math.round(data.totalRevenue / data.bookingCount)
            : 0;

    return (
        <DashboardContent>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={800}>Owner Dashboard</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Welcome back — {dayjs().format('dddd, D MMMM YYYY')}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="mdi:plus" />}
                    onClick={() => navigate('/owner/venues/create')}
                    sx={{
                        borderRadius: 2.5,
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                    }}
                >
                    Add Venue
                </Button>
            </Stack>

            {isLoading ? (
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Stat cards */}
                    <Grid container spacing={3} mb={4}>
                        {[
                            {
                                label: 'My Venues',
                                value: data?.venueCount ?? 0,
                                icon: 'mdi:domain',
                                color: 'primary',
                                sub: 'Active listings',
                            },
                            {
                                label: 'Total Bookings',
                                value: data?.bookingCount ?? 0,
                                icon: 'mdi:calendar-check',
                                color: 'info',
                                sub: 'All time',
                            },
                            {
                                label: 'Total Revenue',
                                value: `₹${(data?.totalRevenue ?? 0).toLocaleString('en-IN')}`,
                                icon: 'mdi:cash-multiple',
                                color: 'success',
                                sub: 'All time earnings',
                            },
                            {
                                label: 'Avg. Per Booking',
                                value: `₹${avgRevenuePerBooking.toLocaleString('en-IN')}`,
                                icon: 'mdi:trending-up',
                                color: 'warning',
                                sub: 'Average booking value',
                            },
                        ].map((s) => (
                            <Grid key={s.label} size={{ xs: 12, sm: 6, lg: 3 }}>
                                <StatCard {...s} />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Recent Bookings */}
                    <Card elevation={0} sx={{ border: '1.5px solid', borderColor: 'divider', borderRadius: 3 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" px={3} pt={3} pb={2}>
                            <Box>
                                <Typography variant="h6" fontWeight={700}>Recent Bookings</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Latest activity across your venues
                                </Typography>
                            </Box>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => navigate('/owner/bookings')}
                                sx={{ borderRadius: 2, fontWeight: 600 }}
                            >
                                View All
                            </Button>
                        </Stack>
                        <Divider />

                        {(data?.recentBookings?.length ?? 0) === 0 ? (
                            <Box textAlign="center" py={8}>
                                <Iconify icon="mdi:calendar-blank-outline" width={48} color="text.disabled" />
                                <Typography variant="body2" color="text.secondary" mt={1.5}>
                                    No bookings yet
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    Bookings will appear here once guests start reserving
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Venue</TableCell>
                                            <TableCell>Check-in</TableCell>
                                            <TableCell>Check-out</TableCell>
                                            <TableCell>Duration</TableCell>
                                            <TableCell>Guests</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data?.recentBookings.map((booking) => {
                                            const nights = Math.max(
                                                1,
                                                dayjs(booking.endDate).diff(dayjs(booking.startDate), 'day'),
                                            );
                                            return (
                                                <TableRow key={booking.id} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={600} noWrap maxWidth={180}>
                                                            {booking.venueName}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {dayjs(booking.startDate).format('DD MMM YYYY')}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {dayjs(booking.endDate).format('DD MMM YYYY')}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {nights} day{nights !== 1 ? 's' : ''}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">{booking.guestsCount}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={700} color="primary.main">
                                                            ₹{(booking.amount ?? 0).toLocaleString('en-IN')}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            size="small"
                                                            variant="text"
                                                            onClick={() => navigate(`/owner/bookings/${booking.id}`)}
                                                            sx={{ borderRadius: 1.5, fontWeight: 600, fontSize: 12 }}
                                                        >
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Card>

                    {/* Quick links */}
                    <Grid container spacing={3} mt={0.5}>
                        {[
                            { label: 'My Venues', sub: 'Manage your listings', icon: 'mdi:domain', path: '/owner/venues', color: 'primary' },
                            { label: 'All Bookings', sub: 'View full booking history', icon: 'mdi:calendar-check', path: '/owner/bookings', color: 'info' },
                            { label: 'Create Venue', sub: 'List a new venue', icon: 'mdi:plus-circle', path: '/owner/venues/create', color: 'success' },
                        ].map((item) => (
                            <Grid key={item.label} size={{ xs: 12, sm: 4 }}>
                                <Card
                                    elevation={0}
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        border: '1.5px solid',
                                        borderColor: 'divider',
                                        borderRadius: 3,
                                        p: 2.5,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            borderColor: `${item.color}.main`,
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        },
                                    }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 2,
                                                bgcolor: `${item.color}.lighter`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Iconify icon={item.icon} width={22} sx={{ color: `${item.color}.main` }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={700}>{item.label}</Typography>
                                            <Typography variant="caption" color="text.secondary">{item.sub}</Typography>
                                        </Box>
                                        <Iconify icon="mdi:chevron-right" width={18} color="text.disabled" sx={{ ml: 'auto' }} />
                                    </Stack>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </DashboardContent>
    );
}
