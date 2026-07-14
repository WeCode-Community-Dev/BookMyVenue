import { Link } from "react-router-dom";

import { Tooltip } from "@mui/material";

import { BookingApiService } from "src/api/booking";
import { PaymentStatus } from "src/api/types/payment.type";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";
import { DataTable } from "src/components/data-table";


export function ListBookings() {


    return (
        <DataTable
            dataKey='bookings-for-owners-list'
            fetchData={BookingApiService.getAllBookingsForOwner}
            title='All Bookings'
            headings={[
                {
                    id: 'venue',
                    label: 'Venue',
                    component(data) {
                        return <>{data.venue.title}</>
                    },
                },
                {
                    id: 'startDate',
                    label: 'Start Date',
                    component(data) {
                        return <>{new Date(data.startDate).toLocaleDateString()}</>
                    },
                },
                {
                    id: 'endDate',
                    label: 'End Date',
                    component(data) {
                        return <>{new Date(data.endDate).toLocaleDateString()}</>
                    },
                },
                { id: 'guestsCount', label: 'Guest count' },
                { id: 'totalAmount', label: 'Total Amount' },
                {
                    id: 'status',
                    label: "Status",
                    component(data) {
                        return <Label color={(data.status === 'banned' && 'error') || 'success'}>
                            {data.status || 'NO status please add'}
                        </Label>
                    },
                },
                {
                    id: 'paymentStatus',
                    label: 'Payment Status',
                    component(data) {
                        const colorMap: Record<PaymentStatus, 'default' | 'info' | 'success' | 'warning' | 'error'> = {
                            [PaymentStatus.PENDING]: 'warning',
                            [PaymentStatus.INITIATED]: 'info',
                            [PaymentStatus.PAID]: 'success',
                            [PaymentStatus.FAILED]: 'error',
                            [PaymentStatus.REFUNDED]: 'default',
                        }

                        return (
                            <Label color={colorMap[data.paymentStatus as keyof typeof PaymentStatus] ?? 'default'}>
                                {data.paymentStatus ?? 'NO PAYMENT STATUS'}
                            </Label>
                        )
                    },
                },
                {
                    id: 'action',
                    label: 'Action',
                    component(data) {
                        return (
                            <Link to={`/owner/bookings/${data.id}`}>
                                <Tooltip title='View Booking'>
                                    <Iconify color='dodgerblue' icon='maki:arrow' />
                                </Tooltip>
                            </Link>
                        )
                    },
                },
            ]}
        />
    )
}