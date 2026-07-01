'use client'
import React, { useState } from 'react'
import { Slider } from "@/components/ui/slider"
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { IconAirConditioning, IconMoneybag, IconParking, IconPlayBasketball, IconStar, IconStarFilled, IconToolsKitchen2, IconUsersGroup, IconWash, IconWashDry, IconWifi } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { VenueLister } from '@/components/venueLister'

function page() {
    const [price, setPrice] = useState<number[]>([5])
    const [capacity, setCapacity] = useState<number[]>([5])
    const [rating, setRating] = useState<number>(0)

    return (
        <div className=' w-full px-2 md:max-w-7xl mx-auto md:flex md:flex-col lg:flex-row  md:justify-between my-10 md:gap-4'>
            <div className='w-full lg:w-[33%] bg-background p-2 h-fit rounded-lg border border-border mb-5'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-heading text-xl font-medium'>Filters</h1>
                <Button variant='outline' size='sm' >Reset Filters</Button>
                </div>
                
                <div className='my-5 flex flex-col gap-6'>
                    <div className='flex flex-col gap-3'>
                        <h3 className='text-foreground flex justify-between'><span className='flex items-center gap-2'><IconMoneybag /> Price Category</span> <Badge>Hourly Basis</Badge></h3> 
                        <h6 className='text-foreground text-right'>Selected Price: ${price[0]}</h6>
                        <Slider
                            value={price}
                            onValueChange={setPrice}
                            max={5000}
                            min={200}
                            step={1}
                            className="mx-auto w-full"
                        />

                    </div>
                    <div className='flex flex-col gap-3'>
                        <h3 className='text-foreground flex justify-between'><span className='flex items-center gap-2'><IconUsersGroup /> Max Capacity</span></h3>  
                        <h6 className='text-foreground text-right'>Selected Capacity: {capacity[0]}</h6>
                        <Slider
                            value={capacity}
                            onValueChange={setCapacity}
                            max={5000}
                            min={200}
                            step={1}
                            className="mx-auto w-full"
                        />

                    </div>
                    <div>
                        <h3 className='text-foreground flex items-center gap-2'><IconStar /> Ratings</h3>
                        <h6 className='text-foreground text-right'>Selected Rating: {rating} star{rating !== 1 ? 's' : ''}</h6>

                        <div className='flex items-center gap-2'>
                            {Array.from({ length: 5 }, (_, index) => {
                                const starValue = index + 1
                                return (
                                    <button
                                        key={starValue}
                                        type='button'
                                        onClick={() => setRating(starValue)}
                                        aria-label={`${starValue} star`}
                                        className={`text-2xl ${rating >= starValue ? 'text-amber-400' : ''}`}
                                    >
                                        <IconStarFilled />
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <h3 className='text-foreground flex justify-between'><span className='flex items-center gap-2'><IconUsersGroup /> Instant Booker</span><Badge>check currenlty available</Badge></h3>  
                        <div className='flex items-center gap-2 w-full'>
                            <Button variant='outline' size='sm' className='w-[47%]'>Today</Button>
                            <Button variant='outline' size='sm' className='w-[47%]'>Tomorrow</Button>
                        </div>

                    </div>
                    <div className='flex flex-col gap-3'>
                        <h3 className='text-foreground flex justify-between'><span className='flex items-center gap-2'><IconUsersGroup />Amenities</span><Badge>check currenlty available</Badge></h3>  
                        <div className='flex items-center gap-2 overflow-x-scroll no-scrollbar w-full'>
                            <div className='w-[600px] dark:bg-secondary/60 rounded-3xl border border-border flex items-center gap-2 px-2 py-4 cursor-pointer group'>
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
                    <div className='w-full dark:bg-secondary/60 rounded-3xl border border-border flex items-center gap-2 px-2 py-4 cursor-pointer group'>
                        <IconWash size={25} className='group-hover:scale-110 transition-all duration-300 group-hover:text-destructive' />
                        WashRoom Facility
                    </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className='w-full lg:w-[73%] bg-background p-2 rounded-lg border border-border'>
                <VenueLister isfiltered={true} list={[
            {
              id: 1,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 2,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 3,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 4,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 5,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            }

          ]} />
            </div>
        </div>
    )
}

export default page