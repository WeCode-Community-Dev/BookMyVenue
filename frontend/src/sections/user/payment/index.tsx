import type { BookingDetails } from 'src/api/user-booking';

import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import LoadingButton from '@mui/lab/LoadingButton';
import {
    Box,
    Chip,
    Grid,
    Paper,
    Stack,
    Alert,
    Button,
    Divider,
    Skeleton,
    Container,
    TextField,
    Typography,
    Breadcrumbs,
    CircularProgress,
} from '@mui/material';

import { UserApiService } from 'src/api/user';
import { PaymentApiService } from 'src/api/payment';
import { useAuth } from 'src/context/auth/use-auth';
import { PaymentStatus } from 'src/api/types/payment.type';
import { UserBookingApiService } from 'src/api/user-booking';
import { loadRazorpayScript, openRazorpayCheckout } from 'src/lib/razorpay';

import { Iconify } from 'src/components/iconify';

const PAYMENT_STATUS_CONFIG: Record<
    PaymentStatus,
    { label: string; color: 'default' | 'warning' | 'success' | 'error' | 'info'; icon: string }
> = {
    PENDING: { label: 'Payment Pending', color: 'warning', icon: 'mdi:clock-outline' },
    INITIATED: { label: 'Payment Initiated', color: 'info', icon: 'mdi:credit-card-clock-outline' },
    PAID: { label: 'Paid', color: 'success', icon: 'mdi:check-circle-outline' },
    FAILED: { label: 'Payment Failed', color: 'error', icon: 'mdi:close-circle-outline' },
    REFUNDED: { label: 'Refunded', color: 'default', icon: 'mdi:cash-refund' },
};

function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) {
        return digits;
    }
    if (digits.startsWith('91') && digits.length === 12) {
        return `+${digits}`;
    }
    return value;
}

function PaymentSkeleton() {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Skeleton variant="text" width={280} height={32} sx={{ mb: 3 }} />
            <Skeleton variant="rounded" height={420} sx={{ borderRadius: 4 }} />
        </Container>
    );
}

function PaymentSuccessView({
    booking,
    paidAt,
    onViewBooking,
}: {
    booking: BookingDetails;
    paidAt?: string;
    onViewBooking: () => void;
}) {
    const bookingRef = (booking.id ?? '').slice(-8).toUpperCase();

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                border: '1.5px solid',
                borderColor: 'divider',
                p: { xs: 4, md: 6 },
                textAlign: 'center',
            }}
        >
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                }}
            >
                <Iconify icon="mdi:check-circle" color="white" width={44} />
            </Box>

            <Typography variant="h4" fontWeight={800} mb={1}>
                Payment Successful
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
                Your booking <strong>#{bookingRef}</strong> has been paid successfully.
            </Typography>

            <Stack spacing={1.5} sx={{ bgcolor: 'grey.50', borderRadius: 3, p: 2.5, mb: 4, textAlign: 'left' }}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Venue</Typography>
                    <Typography variant="body2" fontWeight={600}>{booking.venue?.title}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Amount Paid</Typography>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                        ₹{(booking.totalAmount ?? 0).toLocaleString('en-IN')}
                    </Typography>
                </Stack>
                {paidAt && (
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Paid On</Typography>
                        <Typography variant="body2" fontWeight={600}>
                            {dayjs(paidAt).format('DD MMM YYYY, hh:mm A')}
                        </Typography>
                    </Stack>
                )}
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button variant="contained" onClick={onViewBooking} sx={{ borderRadius: 2.5, fontWeight: 700 }}>
                    View Booking
                </Button>
                <Button component={Link} to="/my/bookings" variant="outlined" sx={{ borderRadius: 2.5, fontWeight: 600 }}>
                    My Bookings
                </Button>
            </Stack>
        </Paper>
    );
}

export function PaymentView() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { bookingId } = useParams<{ bookingId: string }>();

    const [phone, setPhone] = useState('');
    const [phoneTouched, setPhoneTouched] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [paidAt, setPaidAt] = useState<string | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const { data: booking, isLoading, isError } = useQuery({
        queryKey: ['booking-details', bookingId],
        queryFn: () => UserBookingApiService.getBookingDetails(bookingId!),
        enabled: !!bookingId,
        retry: 1,
    });

    const { data: profile } = useQuery({
        queryKey: ['user-profile-phone'],
        queryFn: UserApiService.me,
        retry: false,
    });

    useEffect(() => {
        const defaultPhone = booking?.user?.phone ?? profile?.phone;
        if (defaultPhone) {
            setPhone((prev) => prev || defaultPhone);
        }
    }, [booking?.user?.phone, profile?.phone]);

    const verifyMutation = useMutation({
        mutationFn: PaymentApiService.verifyPayment,
        onSuccess: (result) => {
            setPaidAt(result.paidAt);
            setIsCheckoutOpen(false);
            queryClient.invalidateQueries({ queryKey: ['booking-details', bookingId] });
            queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
        },
        onError: () => {
            setErrorMessage('Payment verification failed. If amount was deducted, contact support.');
            setIsCheckoutOpen(false);
        },
    });

    const handlePay = async () => {
        if (!bookingId || !booking) return;

        setPhoneTouched(true);
        setErrorMessage('');

        const trimmedPhone = phone.trim();
        if (!trimmedPhone || trimmedPhone.replace(/\D/g, '').length < 10) {
            setErrorMessage('Please enter a valid phone number.');
            return;
        }

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            setErrorMessage('Unable to load payment gateway. Please try again.');
            return;
        }

        try {
            setIsCheckoutOpen(true);
            const initiateResult = await PaymentApiService.initiatePayment({
                bookingId,
                customerPhone: formatPhone(trimmedPhone),
            });

            openRazorpayCheckout(initiateResult.checkoutData, {
                name: user?.name ?? `${booking.user?.firstName ?? ''} ${booking.user?.lastName ?? ''}`.trim(),
                email: booking.user?.email ?? user?.email,
                phone: formatPhone(trimmedPhone),
                description: `Booking for ${booking.venue?.title ?? 'venue'}`,
                onSuccess: (response) => {
                    verifyMutation.mutate({
                        providerOrderId: response.razorpay_order_id,
                        providerPaymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                    });
                },
                onDismiss: () => {
                    setIsCheckoutOpen(false);
                    queryClient.invalidateQueries({ queryKey: ['booking-details', bookingId] });
                },
            });
        } catch (err: unknown) {
            setIsCheckoutOpen(false);
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                ?? 'Failed to start payment. Please try again.';
            setErrorMessage(message);
        }
    };

    if (isLoading) {
        return <PaymentSkeleton />;
    }

    if (isError || !booking) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Iconify icon="mdi:alert-circle-outline" width={64} color="error.main" />
                <Typography variant="h5" fontWeight={700} mt={2} mb={1}>
                    Booking Not Found
                </Typography>
                <Button variant="contained" onClick={() => navigate('/my/bookings')} sx={{ mt: 2, borderRadius: 2.5 }}>
                    Back to My Bookings
                </Button>
            </Container>
        );
    }

    const paymentStatus = booking.paymentStatus ?? PaymentStatus.PENDING;
    const paymentCfg = PAYMENT_STATUS_CONFIG[paymentStatus];
    const bookingRef = (booking.id ?? '').slice(-8).toUpperCase();
    const nights = Math.max(1, dayjs(booking.endDate).diff(dayjs(booking.startDate), 'day'));
    const canPay =
        booking.status === 'BOOKED'
        && (paymentStatus === PaymentStatus.PENDING || paymentStatus === PaymentStatus.FAILED);
    const isPaid = paymentStatus === PaymentStatus.PAID || !!paidAt;
    const isRefunded = paymentStatus === PaymentStatus.REFUNDED;
    const isInitiated = paymentStatus === PaymentStatus.INITIATED;

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', pb: 8 }}>
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #0F1B40 0%, #1B0A3F 100%)',
                    pt: 5,
                    pb: 8,
                    mb: -4,
                }}
            >
                <Container maxWidth="md">
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
                        <Typography
                            variant="body2"
                            color="rgba(255,255,255,0.6)"
                            onClick={() => navigate(`/my/bookings/${bookingId}`)}
                            sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}
                        >
                            Booking #{bookingRef}
                        </Typography>
                        <Typography variant="body2" color="white" fontWeight={600}>
                            Payment
                        </Typography>
                    </Breadcrumbs>

                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                        <Box>
                            <Typography variant="h4" color="white" fontWeight={800} mb={0.5}>
                                {isPaid ? 'Payment Receipt' : 'Complete Payment'}
                            </Typography>
                            <Typography variant="body2" color="rgba(255,255,255,0.6)">
                                {booking.venue?.title}
                            </Typography>
                        </Box>
                        <Chip
                            icon={<Iconify icon={paymentCfg.icon} width={16} />}
                            label={paymentCfg.label}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.12)',
                                color: 'white',
                                fontWeight: 700,
                                '& .MuiChip-icon': { color: 'white' },
                            }}
                        />
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                {isPaid ? (
                    <PaymentSuccessView
                        booking={booking}
                        paidAt={paidAt ?? undefined}
                        onViewBooking={() => navigate(`/my/bookings/${bookingId}`)}
                    />
                ) : (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Paper
                                elevation={0}
                                sx={{ borderRadius: 4, border: '1.5px solid', borderColor: 'divider', p: 3 }}
                            >
                                <Typography variant="h6" fontWeight={700} mb={2}>
                                    Booking Summary
                                </Typography>

                                <Stack spacing={1.5} mb={3}>
                                    {[
                                        { label: 'Venue', value: booking.venue?.title ?? '—' },
                                        { label: 'Check-in', value: dayjs(booking.startDate).format('DD MMM YYYY') },
                                        { label: 'Check-out', value: dayjs(booking.endDate).format('DD MMM YYYY') },
                                        { label: 'Duration', value: `${nights} day${nights !== 1 ? 's' : ''}` },
                                        { label: 'Guests', value: String(booking.guestsCount) },
                                    ].map((row) => (
                                        <Stack key={row.label} direction="row" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">{row.label}</Typography>
                                            <Typography variant="body2" fontWeight={600}>{row.value}</Typography>
                                        </Stack>
                                    ))}
                                </Stack>

                                {isRefunded && (
                                    <Alert severity="info" sx={{ borderRadius: 2.5, mb: 2 }}>
                                        This payment has been refunded. No further action is required.
                                    </Alert>
                                )}

                                {isInitiated && (
                                    <Alert severity="warning" sx={{ borderRadius: 2.5, mb: 2 }}>
                                        A payment session was already started for this booking. If checkout was closed,
                                        please contact support or try again later.
                                    </Alert>
                                )}

                                {booking.status === 'CANCELLED' && (
                                    <Alert severity="error" sx={{ borderRadius: 2.5 }}>
                                        This booking is cancelled. Payment is not available.
                                    </Alert>
                                )}

                                {errorMessage && (
                                    <Alert severity="error" sx={{ borderRadius: 2.5, mb: 2 }}>
                                        {errorMessage}
                                    </Alert>
                                )}

                                {canPay && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
                                            Contact Number
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            placeholder="+919876543210"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            onBlur={() => setPhoneTouched(true)}
                                            error={phoneTouched && phone.replace(/\D/g, '').length < 10}
                                            helperText={
                                                phoneTouched && phone.replace(/\D/g, '').length < 10
                                                    ? 'Enter a valid 10-digit phone number'
                                                    : 'Used for payment confirmation via Razorpay'
                                            }
                                            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                        />

                                        <LoadingButton
                                            fullWidth
                                            size="large"
                                            variant="contained"
                                            loading={isCheckoutOpen || verifyMutation.isPending}
                                            onClick={handlePay}
                                            startIcon={<Iconify icon="mdi:credit-card-outline" />}
                                            sx={{
                                                borderRadius: 2.5,
                                                fontWeight: 700,
                                                py: 1.5,
                                                background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                            }}
                                        >
                                            {paymentStatus === PaymentStatus.FAILED ? 'Retry Payment' : 'Pay with Razorpay'}
                                        </LoadingButton>
                                    </>
                                )}
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 4,
                                    border: '1.5px solid',
                                    borderColor: 'divider',
                                    p: 3,
                                    position: 'sticky',
                                    top: 100,
                                }}
                            >
                                <Typography variant="h6" fontWeight={700} mb={2}>
                                    Amount to Pay
                                </Typography>

                                <Typography variant="h3" fontWeight={800} color="primary.main" mb={2}>
                                    ₹{(booking.totalAmount ?? 0).toLocaleString('en-IN')}
                                </Typography>

                                <Stack spacing={1} mb={3}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Iconify icon="mdi:shield-check" width={18} color="success.main" />
                                        <Typography variant="body2" color="text.secondary">
                                            Secured by Razorpay
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Iconify icon="mdi:lock-check" width={18} color="success.main" />
                                        <Typography variant="body2" color="text.secondary">
                                            256-bit encrypted checkout
                                        </Typography>
                                    </Stack>
                                </Stack>

                                <Divider sx={{ mb: 2 }} />

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => navigate(`/my/bookings/${bookingId}`)}
                                    sx={{ borderRadius: 2.5, fontWeight: 600 }}
                                >
                                    Back to Booking
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                {verifyMutation.isPending && (
                    <Box
                        sx={{
                            position: 'fixed',
                            inset: 0,
                            bgcolor: 'rgba(0,0,0,0.45)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                        }}
                    >
                        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                            <CircularProgress sx={{ mb: 2 }} />
                            <Typography variant="body1" fontWeight={600}>
                                Verifying payment...
                            </Typography>
                        </Paper>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
