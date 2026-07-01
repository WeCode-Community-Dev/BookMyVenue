import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Image from 'next/image'

const CarousalData = [
    {
        id: 1,
        imgURl: "/1.png",
    },
    {
        id: 2,
        imgURl: "/2.png",
    },
    {
        id: 3,
        imgURl: "/3.png",
    },
]

interface TopRatedVenuesProps {
  CarousalData: string[]
}

function TopRatedVenues({ CarousalData }: TopRatedVenuesProps) {
  return (
    <Carousel className="w-full md:max-w-7xl mx-auto ">
      <CarouselContent>
        {CarousalData.map((venue, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className='p-0'>
                <CardContent className="p-0">
                  <Image src={venue} alt="Venue" width={200} height={200} className='w-full h-48 md:h-64 lg:h-80'/>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className='flex items-center gap-2 my-2 w-full justify-center'>
        {
          CarousalData.map((venue ,index) => (
            <div key={index} className='rounded-full h-3 w-3 bg-muted/30 brightness-50 dark:brightness-100 dark:bg-muted'>
            </div>
          ))
        }
      </div>
    </Carousel>
  )
}

export { TopRatedVenues }