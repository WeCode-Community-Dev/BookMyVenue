import { IconAnalyze } from '@tabler/icons-react'
import React from 'react'
import { RevenueGraph } from './revenueGraph'

function RevenueStats() {
    const activityData = [
        { month: 'Jan', value: 40 },
        { month: 'Mar', value: 72 },
        { month: 'May', value: 60 },
        { month: 'Jul', value: 84 },
        { month: 'Sep', value: 68 },
        { month: 'Nov', value: 92 },
    ]
    const maxActivityValue = Math.max(...activityData.map((item) => item.value))
    const graphPoints = activityData
        .map((item, index) => {
            const x = 50 + index * 90
            const y = 120 - (item.value / maxActivityValue) * 100
            return `${x},${y}`
        })
        .join(' ')

    return (
        <div className='w-full md:max-w-7xl mx-auto flex flex-col gap-2'>
            <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <IconAnalyze className="text-primary" /> Transaction History
                </h2>
                <p className="text-sm text-muted-foreground">Monitor your venue's revenue and transactions</p>
            </div>
            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                <div className='rounded-3xl border border-border  p-5 shadow-sm'>
                    <p className='text-sm font-medium text-muted-foreground'>This Month</p>
                    <p className='mt-3 text-3xl font-semibold text-foreground'>$28.4K</p>
                    <p className='mt-2 text-xs text-muted-foreground'>Revenue this month</p>
                </div>
                <div className='rounded-3xl border border-border  p-5 shadow-sm'>
                    <p className='text-sm font-medium text-muted-foreground'>This Year</p>
                    <p className='mt-3 text-3xl font-semibold text-foreground'>$196.8K</p>
                    <p className='mt-2 text-xs text-muted-foreground'>Revenue this year</p>
                </div>
                <div className='rounded-3xl border border-border  p-5 shadow-sm'>
                    <p className='text-sm font-medium text-muted-foreground'>Total Bookings</p>
                    <p className='mt-3 text-3xl font-semibold text-foreground'>412</p>
                    <p className='mt-2 text-xs text-muted-foreground'>Bookings completed</p>
                </div>
                <div className='rounded-3xl border border-border  p-5 shadow-sm'>
                    <p className='text-sm font-medium text-muted-foreground'>Repeat Guests</p>
                    <p className='mt-3 text-3xl font-semibold text-foreground'>78%</p>
                    <p className='mt-2 text-xs text-muted-foreground'>Returning customers</p>
                </div>
            </div>

            <div className='rounded-3xl border border-border    px-3 py-2 shadow-sm'>
                <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between my-5'>
                    <div>
                        <p className='text-sm font-medium text-muted-foreground'>Booking activity</p>
                        <h3 className='text-xl font-semibold text-foreground'>Transactions by month</h3>
                    </div>
                    <div className='rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground'>Latest update: 2 hours ago</div>
                </div>

                <RevenueGraph />
            </div>
        </div>

    )
}

export { RevenueStats }