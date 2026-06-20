import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import LoadingButton from '@mui/lab/LoadingButton';
import {
    Box,
    Grid,
    Card,
    Chip,
    Stack,
    Avatar,
    Divider,
    Typography,
    CardHeader,
    CardContent,
} from '@mui/material';

import { BookingApiService } from 'src/api/booking';
import { DashboardContent } from 'src/layouts/dashboard';


export function BookingDetails() {
    const { bookingId } = useParams();

    const { data, isLoading } = useQuery({
        queryKey: ['booking', bookingId],
        queryFn: () =>
            BookingApiService.getBookingDetailsForOwner(
                bookingId!
            ),
    });

    if (isLoading || !data) {
        return null;
    }


    return (
        <DashboardContent>
            <Grid
                container
                spacing={3}
            >
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardHeader
                            title={<Box sx={{ display: 'flex' }}>
                                <Typography sx={{ mr: 4 }} variant='h5'>Booking</Typography>
                                <Typography color='blue' variant='h6'>
                                    #{data?.id.toUpperCase()}
                                </Typography>
                            </Box>}
                            action={
                                <Chip
                                    label={data?.status || 'Booked'}
                                    color="success"
                                />
                            }
                        />
                        <CardContent>
                            <Stack spacing={4}>
                                <VenueInfo data={data} />
                                <Divider />
                                <BookingInfo data={data} />
                                <Divider />
                                <CustomerInfo data={data} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={3}>
                        <Card>
                            <CardHeader title="Actions" />
                            <CardContent>
                                <Stack spacing={2}>
                                    <LoadingButton
                                        fullWidth
                                        variant="contained"
                                    >
                                        Confirm Booking
                                    </LoadingButton>

                                    <LoadingButton
                                        fullWidth
                                        color="error"
                                        variant="outlined"
                                    >
                                        Cancel Booking
                                    </LoadingButton>
                                </Stack>
                            </CardContent>
                        </Card>
                        <PaymentInfo data={data} />
                    </Stack>
                </Grid>
            </Grid>
        </DashboardContent>
    );
}

function PaymentInfo({ data }: { data: any }) {

    return (
        <Card>
            <CardHeader title="Payment Summary" />
            <CardContent>
                <Stack spacing={2}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                    >
                        <Typography>
                            Venue Fee
                        </Typography>

                        <Typography>
                            ₹
                            {
                                data?.totalAmount
                            }
                        </Typography>
                    </Stack>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                    >
                        <Typography>
                            Platform Fee
                        </Typography>

                        <Typography>
                            ₹
                            {
                                data?.platformFee
                            }
                        </Typography>
                    </Stack>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                    >
                        <Typography>
                            Tax
                        </Typography>

                        <Typography>
                            ₹
                            {
                                data?.taxAmount
                            }
                        </Typography>
                    </Stack>

                    <Divider />

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                    >
                        <Typography variant="subtitle1">
                            Total {data.totalAmount}
                        </Typography>

                        <Typography variant="subtitle1">
                            ₹
                            {
                                data?.grandTotal
                            }
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}

function VenueInfo({ data }: { data: any }) {

    return (
        <Box>
            <Typography
                variant="h6"
                gutterBottom
            >
                Venue Information
            </Typography>
            <Stack
                direction="row"
                spacing={2}
            >
                <Avatar
                    variant="rounded"
                    src={
                        data?.imageUrl || 'https://thumbs.dreamstime.com/b/wedding-ceremony-aisle-seating-white-chairs-rows-create-nice-venue-bride-to-walk-down-62613380.jpg'
                    }
                    sx={{
                        width: 120,
                        height: 120,
                    }}
                />
                <Box>
                    <Typography variant="subtitle1">
                        {data?.venue.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {data?.venue.address || 'some address near some place, some district and some state'}
                    </Typography>
                </Box>
            </Stack>
        </Box>
    )
}

function BookingInfo({ data }: { data: any }) {

    return (
        <Box>
            <Typography
                variant="h6"
                gutterBottom
            >
                Booking Information
            </Typography>

            <Stack spacing={1}>
                <Typography>
                    Start Date:
                    {' '}
                    {
                        new Date(data?.startDate).toDateString()
                    }
                </Typography>

                <Typography>
                    End Date:
                    {' '}
                    {
                        new Date(data?.endDate).toDateString()
                    }
                </Typography>
            </Stack>
        </Box>
    )
}


function CustomerInfo({ data }: { data: any }) {

    return (
        <Box>
            <Typography
                variant="h6"
                gutterBottom
            >
                Customer Information
            </Typography>
            <Stack spacing={1}>
                <Typography>
                    Customer Name:{data?.user.firstName} {data?.user.lastName}
                </Typography>
                <Typography>
                    Customer Email:   {data?.user.email}
                </Typography>
                <Typography>
                    Customer Phone  {data?.user.phone}
                </Typography>
            </Stack>
        </Box>
    )
}