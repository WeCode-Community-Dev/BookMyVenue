import React from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { IconStar, IconStarFilled, IconCash, IconTrendingUp, IconCalendar, IconSquareRoundedCheckFilled } from '@tabler/icons-react';

import Link from 'next/link';
import { Reject } from './reject';

interface VenueListerProps {
    list: {
        id: number;
        image: string;
        name: string;
        rating: number;
        cats: string[];
        bookingsThisMonth?: number;
        revenueThisMonth?: number;
        revenueThisYear?: number;
    }[];
    isfiltered?: boolean;
    isOwnerView?: boolean;
    isAdminView?: boolean;
}


function VenueLister({ list, isfiltered, isOwnerView, isAdminView }: VenueListerProps) {
    if (!isAdminView) {
         return (
        <div className={`h-fit overflow-x-scroll no-scrollbar flex items-center gap-3 my-4 ${isfiltered ? 'flex-wrap justify-center lg:justify-around' : ''}`}>
            {
                list.map((item) => {
                    return (
                        <div key={item.id}>
                            <Card className={`relative flex-none  w-56 p-0 h-80 ${isfiltered ? 'w-full md:w-48 lg:w-56' : ''}  `} key={item.id}>
                                <img
                                    src={item.image}
                                    alt="Event cover"
                                    className="relative z-20 aspect-video w-full object-cover  h-80"
                                />

                            </Card>
                            <div className='py-2 px-2'>
                                <div className='flex items-center gap-2'>
                                    <IconStarFilled className='text-primary' size={16} />
                                    <p className="text-sm text-primary">{item.rating}</p>

                                </div>
                                <h3 className="font-heading font-medium md:text-lg">{item.name}</h3>
                                <div className="flex flex-wrap gap-2 mt-2 w-50">
                                    {item.cats.map((cat, index) => (
                                        <Badge key={index} variant="secondary">
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>

                                {isOwnerView && (
                                    <div className="mt-4 flex flex-col gap-3">
                                        <div className='bg-secondary/40 dark:bg-neutral-900/40 border border-border/60 rounded-xl p-3 flex flex-col gap-2.5 text-xs'>
                                            <div className='flex items-center justify-between border-b border-border/40 pb-2'>
                                                <span className='text-muted-foreground flex items-center gap-1.5 font-sans font-medium'>
                                                    <IconCash size={14} className="text-primary" /> Month Earnings
                                                </span>
                                                <span className='font-mono font-bold text-foreground text-sm'>
                                                    ₹{(item.revenueThisMonth ?? 100).toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                            <div className='flex items-center justify-between border-b border-border/40 pb-2'>
                                                <span className='text-muted-foreground flex items-center gap-1.5 font-sans font-medium'>
                                                    <IconTrendingUp size={14} className="text-green-500" /> Year Earnings
                                                </span>
                                                <span className='font-mono font-bold text-foreground text-sm'>
                                                    ₹{(item.revenueThisYear ?? 10000).toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                            <div className='flex items-center justify-between'>
                                                <span className='text-muted-foreground flex items-center gap-1.5 font-sans font-medium'>
                                                    <IconCalendar size={14} className="text-primary" /> Month Bookings
                                                </span>
                                                <span className='font-mono font-extrabold text-primary text-sm'>
                                                    {item.bookingsThisMonth ?? 10}
                                                </span>
                                            </div>
                                        </div>
                                        <Link href={`/Bookings/${item.id}`} className="w-full block">
                                            <Button className='w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 transition-all font-semibold py-4 h-10'>
                                                View Logs
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                            </div>

                        </div>
                    )
                })
            }

        </div>
    )
    }
    else{
         return (
        <div className={`grid w-full gap-4 my-4 ${isfiltered ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            {
                list.map((item) => {
                    return (
                        <div key={item.id}>
                            <Card className="relative w-full p-0 h-80">
                                <img
                                    src={item.image}
                                    alt="Event cover"
                                    className="relative z-20 aspect-video w-full object-cover h-80"
                                />

                            </Card>
                            <div className='py-2 px-2'>
                                <div className='flex items-center gap-2'>
                                    <IconStarFilled className='text-primary' size={16} />
                                    <p className="text-sm text-primary">{item.rating}</p>

                                </div>
                                <h3 className="font-heading font-medium md:text-lg">{item.name}</h3>
                                <div className="flex flex-wrap gap-2 mt-2 w-50">
                                    {item.cats.map((cat, index) => (
                                        <Badge key={index} variant="secondary">
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>

                                {isOwnerView && (
                                    <div className="mt-4 flex flex-col gap-3">
                                        <div className='bg-secondary/40 dark:bg-neutral-900/40 border border-border/60 rounded-xl p-3 flex flex-col gap-2.5 text-xs'>
                                            <div className='flex items-center justify-between border-b border-border/40 pb-2'>
                                                <span className='text-muted-foreground flex items-center gap-1.5 font-sans font-medium'>
                                                    <IconCash size={14} className="text-primary" /> Month Earnings
                                                </span>
                                                <span className='font-mono font-bold text-foreground text-sm'>
                                                    ₹{(item.revenueThisMonth ?? 100).toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                            <div className='flex items-center justify-between border-b border-border/40 pb-2'>
                                                <span className='text-muted-foreground flex items-center gap-1.5 font-sans font-medium'>
                                                    <IconTrendingUp size={14} className="text-green-500" /> Year Earnings
                                                </span>
                                                <span className='font-mono font-bold text-foreground text-sm'>
                                                    ₹{(item.revenueThisYear ?? 10000).toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                            <div className='flex items-center justify-between'>
                                                <span className='text-muted-foreground flex items-center gap-1.5 font-sans font-medium'>
                                                    <IconCalendar size={14} className="text-primary" /> Month Bookings
                                                </span>
                                                <span className='font-mono font-extrabold text-primary text-sm'>
                                                    {item.bookingsThisMonth ?? 10}
                                                </span>
                                            </div>
                                        </div>
                                        <Link href={`/Bookings/${item.id}`} className="w-full block">
                                            <Button className='w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 transition-all font-semibold py-4 h-10'>
                                                View Logs
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                            </div>
                            <div className='flex items-center gap-2'>
                                <Button className='bg-green-500'><IconSquareRoundedCheckFilled />Approve Venue</Button>
                                <Reject />
                            </div>

                        </div>
                    )
                })
            }

        </div>
    )
    }
   
}

export { VenueLister }