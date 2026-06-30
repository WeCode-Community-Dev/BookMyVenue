import { Card } from '@/components/ui/card'
import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { IconAirConditioning, IconBox, IconBrandOffice, IconBrandWhatsapp, IconClock, IconFileDescription, IconMail, IconMapPin, IconMoneybagMove, IconParking, IconPhoneCall, IconPlayBasketball, IconPlayCard, IconRuler, IconStar, IconStarFilled, IconTimeDuration0, IconToolsKitchen2, IconUsersGroup, IconWifi, IconWriting } from '@tabler/icons-react'
import { Gallery } from '@/components/gallery'

const items = [
    'birthday', 'wedding', 'conference', 'meetup', 'workshop'
]

function page() {
    return (
        <div className='flex flex-col gap-6 w-full md:max-w-7xl mx-auto px-2'>
            <div className='w-full md:max-w-7xl mx-auto relative  h-96 flex items-center rounded-3xl px-2 max-w-full'>
                <Image src={'https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png'} alt='Event cover' fill className='object-cover brightness-40 rounded-3xl w-full h-96 relative' />
                <div className='absolute md:top-8 left-4 flex items-center gap-4'>
                    <Card className="relative flex-none w-56 p-0 h-80 hidden md:inline-block shadow-2xl hover:scale-110 hover:translate-y-[-5px] transition-all duration-300" >
                        <img
                            src='https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png'
                            alt="Event cover"
                            className="relative z-20 aspect-video w-full object-cover brightness-75 h-80"
                        />
                        <Badge className='absolute right-1 bottom-2 z-20'>Al Saj Convention Center</Badge>
                    </Card>

                    <div>
                        <div className='border border-border rounded-3xl bg-foreground/80 backdrop-blur-sm px-3 md:inline-block'>
                            <h1 className='text-2xl font-heading font-bold capitalize text-pretty text-primary drop-shadow-lg tracking-tight'>Al Saj Convention Center</h1>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 ">
                            {items.map((cat, index) => (
                                <Badge key={index} variant="secondary" className='border border-primary'>
                                    {cat}
                                </Badge>
                            ))}
                        </div>

                    </div>
                </div>
                <div className='absolute md:top-5 md:right-3 bottom-5 '>
                    <div className="flex  flex-wrap gap-2 items-center justify-center bg-card rounded-full px-2 my-2">
                        <IconStarFilled className='text-primary' size={16} />
                        <p className="font-mono font-medium text-md">4.5 / <span className="font-bold text-lg">5</span></p>
                    </div>
                    <Button className=' md:h-14 md:w-44 brightness-100 hover:brightness-90 transition-all duration-300 hover:scale-90'>Book Now</Button>

                </div>
            </div>

            <Gallery />

            <div className='flex flex-col gap-2'>
                <div className='w-full px-2 '>
                    <h1 className='font-heading font-bold text-xl md:text-2xl my-2 '>Know More About Us</h1>
                    <div className='flex items-center w-full gap-2 border border-border rounded-3xl px-2 py-4 dark:bg-secondary/60'>
                        <div className='w-14 h-14 bg-primary rounded-full'></div>
                        <div className='flex flex-col'>
                            <h3 className='font-heading md:text-lg'>Ziyaudheen MS</h3>
                            <p className='font-sans flex items-center'><IconBrandOffice /> Event Planner, <span>Al Saj Group</span></p>
                        </div>
                        <Badge variant='outline' className='ml-auto border border-primary'><IconClock stroke={2} />3 years</Badge>
                    </div>
                </div>
                <div className='w-full px-2 '>
                    <div className='flex items-center w-full gap-2 border border-border rounded-3xl px-2 py-4 dark:bg-secondary/60'>
                        <div className='flex flex-col'>
                            <h3 className='font-heading flex flex-col  gap-1'><IconFileDescription size={25} />Al Saj Convention Group is an international provider of venues for all king of events in your life. Lets your valuable moments of life we made precious with us.</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className='my-5 px-2 '>
                <h3 className='font-heading font-bold text-xl md:text-2xl '>What This Place Offers</h3>
                <div className='my-2 flex flex-col gap-2 md:grid md:grid-cols-3'>
                    <div className='w-full dark:bg-secondary/60 rounded-3xl border border-border flex items-center gap-2 px-2 py-4 cursor-pointer group'>
                        <IconToolsKitchen2 size={25} className='group-hover:scale-110 transition-all duration-300 group-hover:text-destructive' />
                        Kitchen Facility
                    </div>
                    <div className='w-full dark:bg-secondary/60 rounded-3xl border border-border flex items-center gap-2 px-2 py-4 cursor-pointer group'>
                        <IconParking size={25} className='group-hover:scale-110 transition-all duration-300 group-hover:text-destructive' />
                        Parking Space
                    </div>
                    <div className='w-full dark:bg-secondary/60 rounded-3xl border border-border flex items-center gap-2 px-2 py-4 cursor-pointer group'>
                        <IconPlayBasketball size={25} className='group-hover:scale-110 transition-all duration-300 group-hover:text-destructive' />
                        Play Area
                    </div>
                    <div className='w-full dark:bg-secondary/60 rounded-3xl border border-border flex items-center gap-2 px-2 py-4 cursor-pointer group'>
                        <IconAirConditioning size={25} className='group-hover:scale-110 transition-all duration-300 group-hover:text-destructive' />
                        <p className='line-through'> Air Conditioning </p>
                    </div>
                    <div className='w-full dark:bg-secondary/60 rounded-3xl border border-border flex items-center gap-2 px-2 py-4 cursor-pointer group'>
                        <IconWifi size={25} className='group-hover:scale-110 transition-all duration-300 group-hover:text-destructive' />
                        Internet Facility
                    </div>
                </div>
            </div>

            <div className=' flex flex-col gap-2'>
                <div className='w-full px-2 '>
                    <h1 className='font-heading font-bold text-xl md:text-2xl my-2 flex items-center gap-2'><IconMoneybagMove /> Cancellation & Refund Policy</h1>
                    <div className='flex items-center w-full gap-2 border border-primary rounded-3xl px-2 py-4 dark:bg-secondary/60 text-primary'>
                        <div className='flex flex-col'>
                            <h3 className='font-heading md:text-lg'>The Booking Of Venue Can Be Cancelled</h3>
                            <p className='font-sans flex items-center gap-2'><IconClock /> Before 78 hours</p>
                        </div>
                    </div>
                </div>
                <div className='w-full px-2 '>
                    <div className='flex items-center w-full gap-2 border border-border rounded-3xl px-2 py-4 dark:bg-secondary/60'>
                        <div className=''>
                            <div className='flex items-center gap-2'>
                                <h3>Cancellation Fees</h3>
                                <p className='font-mono text-primary font-bold'>15%</p>
                            </div>
                            <p className='font-sans text-muted-foreground italic'>The given percentage of amount will be deducted from the final amount payed by the guest</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className=' flex flex-col gap-2'>
                <div className='w-full px-2 '>
                    <h1 className='font-heading font-bold text-xl md:text-2xl my-2 flex items-center gap-2'><IconMoneybagMove /> Cancellation & Refund Policy</h1>
                    <div className='flex items-center w-full gap-2 border border-border rounded-3xl px-2 py-4 dark:bg-secondary/60  bg-muted'>
                        <div className='flex flex-col line-through'>
                            <h3 className='font-heading md:text-lg'>No Cancellation Policy</h3>
                            <p className='font-sans flex items-center gap-2'><IconClock />Before 0 hours</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='my-5 px-2 '>
                <h3 className='font-heading font-bold text-xl md:text-2xl '>Hear What Our Customers Say</h3>
                <div className='my-2 flex gap-2 overflow-x-scroll no-scrollbar'>

                    <div className='flex-none flex flex-col w-full md:w-96 gap-2 border border-border rounded-3xl px-2 py-4 cursor-pointer dark:bg-secondary/60'>
                        <div className='flex items-center w-full gap-2 '>
                            <div className='w-8 h-8 bg-primary rounded-full'></div>
                            <div className='flex flex-col'>
                                <h3 className='font-heading md:text-lg'>Ziyaudheen MS</h3>
                            </div>
                            <Badge variant='outline' className='ml-auto border border-primary flex items-center gap-1'><IconStar stroke={2} className='' /><span className='mt-0.5'>3</span></Badge>
                        </div>
                        <p className='font-sans '>Really we had a great time with the venue , the service was good , we had a great time with the alsaj group's convetion center </p>

                    </div>
                    <div className='flex-none flex flex-col w-full md:w-96 gap-2 border border-border rounded-3xl px-2 py-4 cursor-pointer dark:bg-secondary/60'>
                        <div className='flex items-center w-full gap-2'>
                            <div className='w-8 h-8 bg-primary rounded-full'></div>
                            <div className='flex flex-col'>
                                <h3 className='font-heading md:text-lg'>Ziyaudheen MS</h3>
                            </div>
                            <Badge variant='outline' className='ml-auto border border-primary flex items-center gap-1'><IconStar stroke={2} className='' /><span className='mt-0.5'>3</span></Badge>
                        </div>
                        <p className='font-sans '>Really we had a great time with the venue , the service was good , we had a great time with the alsaj group's convetion center </p>

                    </div>
                    <div className='flex-none flex flex-col w-full md:w-96 gap-2 border border-border rounded-3xl px-2 py-4 cursor-pointer dark:bg-secondary/60'>
                        <div className='flex items-center w-full gap-2'>
                            <div className='w-8 h-8 bg-primary rounded-full'></div>
                            <div className='flex flex-col'>
                                <h3 className='font-heading md:text-lg'>Ziyaudheen MS</h3>
                            </div>
                            <Badge variant='outline' className='ml-auto border border-primary flex items-center gap-1'><IconStar stroke={2} className='' /><span className='mt-0.5'>3</span></Badge>
                        </div>
                        <p className='font-sans '>Really we had a great time with the venue , the service was good , we had a great time with the alsaj group's convetion center </p>

                    </div>
                </div>
            </div>

            <div className='my-5 px-2 '>
                <h3 className='font-heading font-bold text-xl md:text-2xl '>The Perfect Path To Reach Us</h3>
                <div className='my-2 flex gap-2 overflow-x-scroll no-scrollbar'>

                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.3804509517463!2d76.99033637449388!3d8.462333497602776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bbe2f2952c85%3A0xbdb037e7cd8a685!2sAL%20SAJ%20CONVENTION%20CENTER!5e0!3m2!1sen!2sin!4v1780123248212!5m2!1sen!2sin" width="600" height="450" className="border-0 w-full rounded-3xl" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>

                </div>
            </div>

            <div className='my-5 px-2  flex items-center justify-center '>
                <div className='bg-primary font-heading w-full text-center py-4 rounded-3xl md:w-64 text-background'>
                    Book Now
                </div>
            </div>
        </div>
    )
}

export default page