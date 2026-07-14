import dayjs from 'dayjs';
import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

import {
    Box,
    Grid,
    Step,
    Alert,
    Paper,
    Stack,
    Button,
    Rating,
    Divider,
    Stepper,
    Skeleton,
    Container,
    StepLabel,
    TextField,
    Typography,
    CircularProgress,
} from '@mui/material';

import { VenuePublicApiService } from 'src/api/venue-public';
import { UserBookingApiService } from 'src/api/user-booking';

import { Iconify } from 'src/components/iconify';

const STEPS = ['Select Dates', 'Guest Details', 'Review & Pay'];

export function BookingView() {
    const navigate = useNavigate();
    const { venueId } = useParams<{ venueId: string }>();
    const [searchParams] = useSearchParams();

    const [activeStep, setActiveStep] = useState(0);
    const [startDate, setStartDate] = useState(searchParams.get('startDate') ?? '');
    const [endDate, setEndDate] = useState(searchParams.get('endDate') ?? '');
    const [guestsCount, setGuestsCount] = useState(Number(searchParams.get('guests') ?? 10));
    const [specialRequests, setSpecialRequests] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState<{ id: string } | null>(null);

    const today = dayjs().format('YYYY-MM-DD');

    const { data: venue, isLoading: venueLoading } = useQuery({
        queryKey: ['venue-details', venueId],
        queryFn: () => VenuePublicApiService.getVenueDetails(venueId!),
        enabled: !!venueId,
    });

    const nights = startDate && endDate ? Math.max(1, dayjs(endDate).diff(dayjs(startDate), 'day')) : 0;
    const baseAmount = nights * (venue?.pricePerDay ?? 0);
    const serviceFee = Math.round(baseAmount * 0.1);
    const total = baseAmount + serviceFee;

    const createBookingMutation = useMutation({
        mutationFn: () =>
            UserBookingApiService.createBooking({
                venueId: venueId!,
                startDate,
                endDate,
                guestsCount,
                specialRequests: specialRequests || undefined,
            }),
        onSuccess: (data) => {
            setBookingSuccess({ id: data.bookingId ?? data.id ?? '' });
            setActiveStep(3);
        },
    });

    const canProceedStep0 = startDate && endDate && dayjs(endDate).isAfter(dayjs(startDate));
    const canProceedStep1 = guestsCount > 0;

    const handleNext = useCallback(() => {
        if (activeStep === STEPS.length - 1) {
            createBookingMutation.mutate();
        } else {
            setActiveStep((s) => s + 1);
        }
    }, [activeStep, createBookingMutation]);

    const handleBack = () => setActiveStep((s) => s - 1);

    if (venueLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Skeleton variant="rounded" height={400} sx={{ borderRadius: 4 }} />
            </Container>
        );
    }

    if (!venue) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5">Venue not found</Typography>
                <Button onClick={() => navigate('/search')} sx={{ mt: 2 }}>Back to Search</Button>
            </Container>
        );
    }

    // Success Screen
    if (activeStep === 3 && bookingSuccess) {
        return (
            <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 5,
                        p: { xs: 4, md: 6 },
                        textAlign: 'center',
                        border: '1.5px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box
                        sx={{
                            width: 88,
                            height: 88,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3,
                            boxShadow: '0 8px 32px rgba(34,197,94,0.35)',
                        }}
                    >
                        <Iconify icon="mdi:check-circle" color="white" width={44} />
                    </Box>

                    <Typography variant="h4" fontWeight={800} mb={1}>
                        Booking Confirmed!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={0.5}>
                        Your booking ID is
                    </Typography>
                    <Box
                        sx={{
                            display: 'inline-block',
                            bgcolor: 'primary.lighter',
                            color: 'primary.dark',
                            borderRadius: 2,
                            px: 2,
                            py: 0.75,
                            fontWeight: 800,
                            fontSize: 15,
                            mb: 3,
                            letterSpacing: 0.5,
                        }}
                    >
                        #{bookingSuccess.id.slice(-8).toUpperCase()}
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Stack spacing={1.5} mb={4} textAlign="left" sx={{ bgcolor: 'grey.50', borderRadius: 3, p: 2.5 }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Venue</Typography>
                            <Typography variant="body2" fontWeight={600}>{venue.title}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Check-in</Typography>
                            <Typography variant="body2" fontWeight={600}>{dayjs(startDate).format('DD MMM YYYY')}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Check-out</Typography>
                            <Typography variant="body2" fontWeight={600}>{dayjs(endDate).format('DD MMM YYYY')}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Guests</Typography>
                            <Typography variant="body2" fontWeight={600}>{guestsCount}</Typography>
                        </Stack>
                        <Divider />
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle2" fontWeight={800}>Total Paid</Typography>
                            <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                                ₹{total.toLocaleString('en-IN')}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack spacing={2}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => navigate('/my/bookings')}
                            sx={{
                                borderRadius: 3,
                                fontWeight: 700,
                                py: 1.5,
                                background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                            }}
                        >
                            View My Bookings
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate('/')}
                            sx={{ borderRadius: 3, fontWeight: 600 }}
                        >
                            Back to Home
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                <Button
                    startIcon={<Iconify icon="mdi:arrow-left" />}
                    onClick={() => navigate(`/venues/${venueId}`)}
                    sx={{ color: 'text.secondary', fontWeight: 600 }}
                >
                    Back
                </Button>
                <Typography variant="h5" fontWeight={800}>
                    Book Your Venue
                </Typography>
            </Stack>

            {/* Stepper */}
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
                {STEPS.map((label) => (
                    <Step key={label}>
                        <StepLabel
                            sx={{
                                '& .MuiStepLabel-label': { fontWeight: 600, fontSize: 13 },
                                '& .Mui-active': { color: 'primary.main' },
                                '& .Mui-completed': { color: 'success.main' },
                            }}
                        >
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Grid container spacing={4}>
                {/* Left: Form */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            p: { xs: 3, md: 4 },
                            border: '1.5px solid',
                            borderColor: 'divider',
                        }}
                    >
                        {/* Step 0: Date Selection */}
                        {activeStep === 0 && (
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="h6" fontWeight={800} mb={0.5}>Select Your Dates</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Choose your check-in and check-out dates
                                    </Typography>
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Check-in Date"
                                            type="date"
                                            fullWidth
                                            value={startDate}
                                            onChange={(e) => {
                                                setStartDate(e.target.value);
                                                if (endDate && e.target.value >= endDate) setEndDate('');
                                            }}
                                            inputProps={{ min: today }}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Check-out Date"
                                            type="date"
                                            fullWidth
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            inputProps={{ min: startDate || today }}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                        />
                                    </Grid>
                                </Grid>

                                <TextField
                                    label="Number of Guests"
                                    type="number"
                                    value={guestsCount}
                                    onChange={(e) => setGuestsCount(Math.min(Number(e.target.value), venue.capacity))}
                                    inputProps={{ min: 1, max: venue.capacity }}
                                    helperText={`Maximum capacity: ${venue.capacity} guests`}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                />

                                {nights > 0 && (
                                    <Alert severity="success" icon={<Iconify icon="mdi:calendar-check" />} sx={{ borderRadius: 2.5 }}>
                                        {nights} day{nights !== 1 ? 's' : ''} selected · {dayjs(startDate).format('DD MMM')} → {dayjs(endDate).format('DD MMM YYYY')}
                                    </Alert>
                                )}
                            </Stack>
                        )}

                        {/* Step 1: Guest Details */}
                        {activeStep === 1 && (
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="h6" fontWeight={800} mb={0.5}>Guest Information</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tell the host about your event
                                    </Typography>
                                </Box>

                                <TextField
                                    label="Special Requests (optional)"
                                    multiline
                                    rows={5}
                                    fullWidth
                                    value={specialRequests}
                                    onChange={(e) => setSpecialRequests(e.target.value)}
                                    placeholder="Any special requirements, event type, decorations, catering needs, etc."
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                />

                                <Alert severity="info" sx={{ borderRadius: 2.5 }}>
                                    The host will review your request and confirm availability within 2-4 hours.
                                </Alert>
                            </Stack>
                        )}

                        {/* Step 2: Review & Pay */}
                        {activeStep === 2 && (
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="h6" fontWeight={800} mb={0.5}>Review Your Booking</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Please verify the details before confirming
                                    </Typography>
                                </Box>

                                <Stack spacing={2} sx={{ bgcolor: 'grey.50', borderRadius: 3, p: 2.5 }}>
                                    {[
                                        { label: 'Venue', value: venue.title },
                                        { label: 'Location', value: `${venue.city ?? venue.address?.city}, ${venue.state ?? venue.address?.state}` },
                                        { label: 'Check-in', value: dayjs(startDate).format('dddd, DD MMM YYYY') },
                                        { label: 'Check-out', value: dayjs(endDate).format('dddd, DD MMM YYYY') },
                                        { label: 'Duration', value: `${nights} day${nights !== 1 ? 's' : ''}` },
                                        { label: 'Guests', value: `${guestsCount} people` },
                                    ].map((item) => (
                                        <Stack key={item.label} direction="row" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                                            <Typography variant="body2" fontWeight={600}>{item.value}</Typography>
                                        </Stack>
                                    ))}
                                </Stack>

                                {specialRequests && (
                                    <Box sx={{ bgcolor: 'primary.lighter', borderRadius: 2.5, p: 2 }}>
                                        <Typography variant="caption" color="primary.dark" fontWeight={700} display="block" mb={0.5}>
                                            Special Requests
                                        </Typography>
                                        <Typography variant="body2">{specialRequests}</Typography>
                                    </Box>
                                )}

                                {createBookingMutation.isError && (
                                    <Alert severity="error" sx={{ borderRadius: 2.5 }}>
                                        {/* Booking failed. Please try again. */}
                                        {createBookingMutation.error.message}
                                    </Alert>
                                )}
                            </Stack>
                        )}

                        {/* Navigation Buttons */}
                        <Stack direction="row" spacing={2} mt={4}>
                            {activeStep > 0 && (
                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                    sx={{ borderRadius: 2.5, fontWeight: 600, flex: 1 }}
                                >
                                    Back
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={
                                    (activeStep === 0 && !canProceedStep0) ||
                                    (activeStep === 1 && !canProceedStep1) ||
                                    createBookingMutation.isPending
                                }
                                sx={{
                                    flex: 1,
                                    borderRadius: 2.5,
                                    fontWeight: 700,
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                    '&:disabled': { opacity: 0.6 },
                                }}
                            >
                                {createBookingMutation.isPending ? (
                                    <CircularProgress size={22} color="inherit" />
                                ) : activeStep === STEPS.length - 1 ? (
                                    'Confirm Booking'
                                ) : (
                                    'Continue'
                                )}
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Right: Summary Card */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            p: 3,
                            border: '1.5px solid',
                            borderColor: 'divider',
                            position: 'sticky',
                            top: 100,
                        }}
                    >
                        {/* Venue Image */}
                        <Box
                            sx={{
                                height: 160,
                                borderRadius: 3,
                                overflow: 'hidden',
                                mb: 2.5,
                                backgroundImage: `url(${venue.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=70'})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />

                        <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
                            {venue.title}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5} mb={2}>
                            <Iconify icon="mdi:map-marker" color="text.disabled" width={14} />
                            <Typography variant="body2" color="text.secondary">{venue.city ?? venue.address?.city}, {venue.state ?? venue.address?.state}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                            <Rating value={venue.averageRating ?? 0} readOnly size="small" precision={0.1} />
                            <Typography variant="body2" fontWeight={600}>{(venue.averageRating ?? 0).toFixed(1)}</Typography>
                            <Typography variant="body2" color="text.secondary">({venue.reviewCount ?? 0})</Typography>
                        </Stack>

                        <Divider sx={{ mb: 2.5 }} />

                        {/* Price Breakdown */}
                        <Stack spacing={1.5}>
                            <Typography variant="subtitle2" fontWeight={700} mb={0.5}>Price Breakdown</Typography>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                    ₹{venue.pricePerDay.toLocaleString('en-IN')} × {nights || '—'} day{nights !== 1 ? 's' : ''}
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {nights > 0 ? `₹${baseAmount.toLocaleString('en-IN')}` : '—'}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">Service fee (10%)</Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {nights > 0 ? `₹${serviceFee.toLocaleString('en-IN')}` : '—'}
                                </Typography>
                            </Stack>
                            <Divider />
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle2" fontWeight={800}>Total</Typography>
                                <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                                    {nights > 0 ? `₹${total.toLocaleString('en-IN')}` : '—'}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
