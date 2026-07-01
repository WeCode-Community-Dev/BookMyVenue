'use client'
import { CalenderView } from '@/components/calenderView'
import { Offline } from '@/components/offline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { IconCash, IconPlus, IconStar, IconUser } from '@tabler/icons-react'
import React from 'react'

function page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const EventDates = [new Date("2026-06-20"), new Date("2026-06-21"), new Date("2026-06-22")]

  return (
    <div className='w-full max-w-7xl mx-auto px-2 my-6'>
      <div className='flex items-center justify-between border-b border-primary/50 w-full'>
        <div>
          <h1 className='text-xl font-heading font-medium'>Booking Details</h1>
          <p className='text-muted-foreground font-sans font-light italic mb-3'>Here you can view the details of your booking and manage it.</p>
        </div>
        <Badge variant='outline' className='mb-4 border border-primary text-primary'><IconStar /> 4 ratings</Badge>
      </div>

      <div className='w-full flex items-start gap-10 my-10 flex-col md:flex-row'>
        <div className='w-full md:w-1/2 lg:w-1/3'>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border w-full"
            captionLayout="dropdown"
            modifiers={{
              booked: EventDates
            }}
            modifiersClassNames={{
              booked: "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-2 after:h-2 after:bg-primary after:rounded-full"
            }}


          />
          <Offline />
        </div>
        <div className='w-full md:w-1/2 lg:w-2/3 mx-auto'>
          <div className='w-full flex justify-between items-center font-heading font-bold'>
            BOOKING DETAILS
            
          </div>

          <p className='text-muted-foreground font-sans text-sm italic mb-3'>Here you can view the details of your booking and manage it.</p>
          <div className=' h-96 no-scrollbar overflow-y-auto'>
            <div className='my-5 '>
              <h3 className='flex items-center gap-2 font-heading font-xl font-bold'><IconUser /> Guest Details</h3>
              <div className='w-full  my-3'>
                <div className='w-full flex items-center justify-between px-2 py-1 '>
                  <h4 className='font-sans'>Name</h4>
                  <h3 className='font-sans'>John Doe</h3>
                </div>
              </div>
              <div className='w-full  my-3'>
                <div className='w-full flex items-center justify-between px-2 py-1 '>
                  <h4 className='font-sans'>Email</h4>
                  <h3 className='font-sans'>john.doe@example.com</h3>
                </div>
              </div>
              <div className='w-full  my-3'>
                <div className='w-full flex items-center justify-between px-2 py-1 '>
                  <h4 className='font-sans'>Contact Number</h4>
                  <h3 className='font-sans'>123-456-7890</h3>
                </div>
              </div>
              <div className='w-full  my-3'>
                <div className='w-full flex items-center justify-between px-2 py-1 '>
                  <h4 className='font-sans'>Booked Time</h4>
                  <h3 className='font-sans'>10:00 AM to 12:00 PM</h3>
                </div>
              </div>
              <div className='w-full  my-3'>
                <div className='w-full  px-2 py-1 '>
                  <h4 className='font-sans'>Booking Notes</h4>
                  <h3 className='font-sans text-muted-foreground italic'>Need catering services and some live action performances</h3>
                </div>
              </div>
            </div>

            <div className='my-5 border border-border rounded-lg px-2 py-2 bg-muted dark:bg-secondary/30'>
              <h3 className='flex items-center gap-2 font-heading font-xl'><IconCash /> Payment Details</h3>
              <div className='w-full  my-3'>
                <div className='w-full flex items-center justify-between px-2 py-1 '>
                  <h4 className='font-sans'>Hourly Rent</h4>
                  <h3 className='font-mono'>$50</h3>
                </div>
              </div>
              <div className='w-full  my-3'>
                <div className='w-full flex items-center justify-between px-2 py-1 '>
                  <h4 className='font-sans'>Platform Fee</h4>
                  <h3 className='font-mono'>$10</h3>
                </div>
              </div>
              <div className='w-full  my-3 '>
                <div className='w-full flex items-center justify-between px-2 py-1 '>
                  <h4 className='font-sans'>Rent for X hours</h4>
                  <h3 className='font-mono'>12000</h3>
                </div>
              </div>
              <div className='w-full  my-3 border-t border-primary'>
                <div className='w-full flex items-center justify-between px-2 py-1 '>
                  <h4 className='font-heading font-bold text-md'>Total Amount</h4>
                  <h3 className='font-mono text-primary font-bold'>12000</h3>
                </div>
              </div>

            </div>

            <div className='my-5 w-full h-96 flex justify-center items-center'>
              <div className='items-center'>
                <h3 className='font-heading font-bold text-primary text-center text-xl '>No Bookings Yet</h3>
                <p className='font-sans text-muted-foreground italic'>Bookings Havent been booked so far for today</p>
                <Offline />
              </div>

            </div>



          </div>


        </div>


      </div>


    </div>
  )
}

export default page