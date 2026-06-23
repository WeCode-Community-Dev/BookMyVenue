import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

import { AdminApiService } from 'src/api/admin';
import { DashboardApiService } from 'src/api/dashboard';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
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

const STATUS_COLOR: Record<string, 'warning' | 'success' | 'error' | 'default'> = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'error',
    SUSPENDED: 'error',
};

const STATUS_BAR_COLOR: Record<string, string> = {
    APPROVED: '#22C55E',
    PENDING: '#F59E0B',
    REJECTED: '#EF4444',
    SUSPENDED: '#9CA3AF',
};

// ─── Main component ────────────────────────────────────────────────────────────

export function AdminDashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin-dashboard'],
        queryFn: DashboardApiService.getAdminDashboard,
        retry: false,
    });

    const approveMutation = useMutation({
        mutationFn: (id: string) => AdminApiService.approveVenue(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] }),
    });

    const rejectMutation = useMutation({
        mutationFn: (id: string) => AdminApiService.rejectVenue(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] }),
    });

    const isActing = approveMutation.isPending || rejectMutation.isPending;

    const pendingCount = data?.approvalPendingVenues?.length ?? 0;
    const approvedCount = data?.venueStatusSummary?.find((s) => s.status === 'APPROVED')?.count ?? 0;

    return (
        <DashboardContent>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={800}>Admin Dashboard</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Platform overview — {dayjs().format('dddd, D MMMM YYYY')}
                    </Typography>
                </Box>
            </Stack>

            {/* Stat cards */}
            {isLoading ? (
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container spacing={3} mb={4}>
                        {[
                            {
                                label: 'Total Users',
                                value: data?.totalUsers ?? 0,
                                icon: 'mdi:account-group',
                                color: 'info',
                                sub: `${data?.totalOwners ?? 0} venue owners`,
                            },
                            {
                                label: 'Total Venues',
                                value: data?.totalVenues ?? 0,
                                icon: 'mdi:domain',
                                color: 'primary',
                                sub: `${approvedCount} approved`,
                            },
                            {
                                label: 'Pending Approval',
                                value: pendingCount,
                                icon: 'mdi:clock-outline',
                                color: 'warning',
                                sub: 'Awaiting review',
                            },
                            {
                                label: 'Venue Owners',
                                value: data?.totalOwners ?? 0,
                                icon: 'mdi:account-tie',
                                color: 'success',
                                sub: 'Registered owners',
                            },
                        ].map((s) => (
                            <Grid key={s.label} size={{ xs: 12, sm: 6, lg: 3 }}>
                                <StatCard {...s} />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3}>
                        {/* Pending Venues */}
                        <Grid size={{ xs: 12, lg: 7 }}>
                            <Card elevation={0} sx={{ border: '1.5px solid', borderColor: 'divider', borderRadius: 3 }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" px={3} pt={3} pb={2}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700}>Pending Approval</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Venues waiting for review
                                        </Typography>
                                    </Box>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => navigate('/admin/venues')}
                                        sx={{ borderRadius: 2, fontWeight: 600 }}
                                    >
                                        View All
                                    </Button>
                                </Stack>
                                <Divider />

                                {(data?.approvalPendingVenues?.length ?? 0) === 0 ? (
                                    <Box textAlign="center" py={6}>
                                        <Iconify icon="mdi:check-circle-outline" width={40} color="success.main" />
                                        <Typography variant="body2" color="text.secondary" mt={1}>
                                            No pending venues
                                        </Typography>
                                    </Box>
                                ) : (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Venue</TableCell>
                                                    <TableCell>Type</TableCell>
                                                    <TableCell>Capacity</TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data?.approvalPendingVenues.map((venue) => (
                                                    <TableRow key={venue.id} hover>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight={600} noWrap maxWidth={160}>
                                                                {venue.title}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.disabled" noWrap>
                                                                {venue.addressLine1}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {venue.venueType?.replace(/_/g, ' ')}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">{venue.capacity}</Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="success"
                                                                    disabled={isActing}
                                                                    onClick={() => approveMutation.mutate(venue.id)}
                                                                    sx={{ borderRadius: 1.5, minWidth: 72, fontWeight: 700, fontSize: 11 }}
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    color="error"
                                                                    disabled={isActing}
                                                                    onClick={() => rejectMutation.mutate(venue.id)}
                                                                    sx={{ borderRadius: 1.5, minWidth: 64, fontWeight: 700, fontSize: 11 }}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Card>
                        </Grid>

                        {/* Right column */}
                        <Grid size={{ xs: 12, lg: 5 }}>
                            {/* Venue status breakdown */}
                            <Card elevation={0} sx={{ border: '1.5px solid', borderColor: 'divider', borderRadius: 3 }}>
                                <Box px={3} pt={3} pb={2}>
                                    <Typography variant="h6" fontWeight={700}>Venue Status Breakdown</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Distribution across all venues
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box p={3}>
                                    {(data?.venueStatusSummary?.length ?? 0) === 0 ? (
                                        <Typography variant="body2" color="text.secondary">No data</Typography>
                                    ) : (
                                        <Stack spacing={2.5}>
                                            {data?.venueStatusSummary.map((item) => (
                                                <Box key={item.status}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.75}>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Label color={STATUS_COLOR[item.status] ?? 'default'}>
                                                                {item.status}
                                                            </Label>
                                                        </Stack>
                                                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                                            {item.count} / {data?.totalVenues ?? 0}
                                                        </Typography>
                                                    </Stack>
                                                    <Box sx={{ height: 8, bgcolor: 'grey.100', borderRadius: 4, overflow: 'hidden' }}>
                                                        <Box
                                                            sx={{
                                                                height: '100%',
                                                                width: `${data?.totalVenues ? (item.count / data.totalVenues) * 100 : 0}%`,
                                                                bgcolor: STATUS_BAR_COLOR[item.status] ?? '#9CA3AF',
                                                                borderRadius: 4,
                                                                transition: 'width 0.6s ease',
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Stack>
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </>
            )}
        </DashboardContent>
    );
}
