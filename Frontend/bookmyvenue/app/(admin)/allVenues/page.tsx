'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconUserCancel, IconUserDown, IconUsers, IconSearch, IconUser, IconBuilding, IconTicket, IconX, IconStarFilled } from '@tabler/icons-react'
import React, { useState } from 'react'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Filters } from '@/components/filters'
import { Card, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import { VenueLister } from '@/components/venueLister'
function page() {
    const [searchQuery, setSearchQuery] = useState('')
    const [rating, setRating] = useState<number>(0)
    return (
        <div className='w-full md:max-w-7xl mx-auto p-2 my-5'>
            <div className='mb-6 w-[60%] mx-auto h-32 flex flex-col items-center justify-center'>
                <div className='flex flex-col gap-3 w-full items-center'>
                    <InputGroup>
                        <InputGroupInput placeholder="Search..." className='h-52' />
                        <InputGroupAddon>
                            <IconBuilding />
                        </InputGroupAddon>
                    </InputGroup>
                    
                </div>
              
            </div>
            <div>
                <div className='flex items-center justify-between my-5'>
                    <h3 className='flex items-center gap-2 font-medium text-xl'><IconBuilding />All The Venues Listed</h3>
                    <Badge>144 venues</Badge>
                </div>
                <Filters />
                <div className='flex items-center justify-between my-5'>
                    <div className='flex gap-2  '>
                        <Badge variant='outline' className='cursor-pointer'><IconBuilding />All</Badge>
                        <Badge variant='outline' className='cursor-pointer'><IconTicket />Approved</Badge>
                        <Badge variant='outline' className='cursor-pointer'><IconX />Waiting</Badge>
                    </div>
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

                <VenueLister isAdminView={true} list={[
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