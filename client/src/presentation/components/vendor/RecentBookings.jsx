import React from 'react'
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from '@/components/ui/table'

const RecentBookings = () => {
  return (
    <div className='mt-8 bg-white shadow rounded-lg p-6'>
        <h2 className='text-lg font-semibold mb-4'>RecentBookings</h2>
        <Table >
            <TableHeader>
                <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Status</TableHead>

                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>John</TableCell>
                    <TableCell>Grand Hall</TableCell>
                    <TableCell>Confirmed</TableCell>
                    
                </TableRow>
            </TableBody>
        </Table>
    </div>
  )
}

export default RecentBookings