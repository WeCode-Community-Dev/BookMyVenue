import { Cancel } from '@/components/cancel'
import { Review } from '@/components/review'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconBuilding, IconCalendar, IconCash, IconCheck, IconEmailStamp, IconHistory, IconLocation, IconMail, IconPhone } from '@tabler/icons-react'
import React from 'react'

function page() {
  return (
    <div className='w-full px-2 md:max-w-7xl mx-auto my-10 flex flex-col gap-5'>
        <div className='w-full h-64 flex items-end justify-center bg-secondary rounded-2xl border border-border relative'>
            <div className='w-48 h-48 rounded-full bg-border absolute -bottom-16 border border-border p-2'>
                 <div className='w-44 h-44 rounded-full bg-primary mx-auto border border-border'>


            </div>
            </div>
        </div>
        <div className='w-full border border-border rounded-xl p-2 dark:bg-secondary/30'>
                <h1 className='font-heading text-2xl font-bold'>John Doe</h1>

            <div className='my-5'>
                <h5 className=' text-foreground flex items-center gap-2'><IconMail /> <span className='font-medium'>Email:</span> john.doe@example.com</h5>
                <h5 className='text-foreground flex items-center gap-2'><IconPhone /> <span className='font-medium'>Phone:</span> (123) 456-7890</h5>
            </div>

            
        </div>
        <div className='w-full border border-border rounded-xl p-2 dark:bg-secondary/30'>
                <h1 className='font-heading text-2xl font-bold flex items-center gap-2'><IconHistory />History & Booking Management</h1>

            <div className='flex flex-col gap-2 my-5 h-96 overflow-y-scroll no-scrollbar'>
                <div className='w-full border border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2'>
                    <div className='flex items-center gap-2'>
                    <div className='w-16 h-16 bg-primary rounded-xl'>

                    </div>
                    <div className='flex flex-col gap-1'>
                        <Badge variant='outline'>Birthday</Badge>
                        <div className='mx-2'>
                        <h3 className='flex items-center'>Al Saj Arena, nemom, tvm, kerala</h3>
                        <p className='flex items-center'><IconCalendar /> 25th may, 2025</p>
                        </div>
                    </div>
                    </div>
                    <div className='flex gap-2 justify-end w-full'>
                        <Button className='bg-primary'><IconCash />Cancel & Refund</Button>
                        <Button className='bg-green-500'><IconCheck />Confirmation Ticket</Button>
                    </div>
                </div>
                <div className='w-full border border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2'>
                    <div className='flex items-center gap-2'>
                    <div className='w-16 h-16 bg-primary rounded-xl'>

                    </div>
                    <div className='flex flex-col gap-1'>
                        <Badge variant='outline'>Birthday</Badge>
                        <div className='mx-2'>
                        <h3 className='flex items-center'>Al Saj Arena, nemom, tvm, kerala</h3>
                        <p className='flex items-center'><IconCalendar /> 25th may, 2025</p>
                        </div>
                    </div>
                    </div>
                    <div className='flex gap-2 justify-end w-full'>
                        <Button className='bg-primary'><IconCash />Cancel & Refund</Button>
                        <Button className='bg-green-500'><IconCheck />Confirmation Ticket</Button>
                    </div>
                </div>
                <div className='w-full border border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2'>
                    <div className='flex items-center gap-2'>
                    <div className='w-20 h-16 bg-primary rounded-xl'>

                    </div>
                    <div className='flex flex-col gap-1'>
                        <Badge variant='outline'>Birthday</Badge>
                        <div className='mx-2'>
                        <h3 className='flex items-center'>Al Saj Arena, nemom, tvm, kerala</h3>
                        <p className='flex items-center'><IconCalendar /> 25th may, 2025</p>
                        </div>
                    </div>
                    </div>
                    <div className='flex gap-2 justify-end w-full'>
                        <Button className='bg-primary'><IconCash />Cancel & Refund</Button>
                        <Button className='bg-green-500'><IconCheck />Confirmation Ticket</Button>
                    </div>
                </div>
                <div className='w-full border border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2'>
                    <div className='flex items-center gap-2'>
                    <div className='w-16 h-16 bg-primary rounded-xl'>

                    </div>
                    <div className='flex flex-col gap-1'>
                        <Badge variant='outline'>Birthday</Badge>
                        <div className='mx-2'>
                        <h3 className='flex items-center'>Al Saj Arena, nemom, tvm, kerala</h3>
                        <p className='flex items-center'><IconCalendar /> 25th may, 2025</p>
                        </div>
                    </div>
                    </div>
                    <div className='flex gap-2 justify-end w-full'>
                        <Cancel />
                        <Button className='bg-green-500'><IconCheck />Confirmation Ticket</Button>
                    </div>
                </div>
                <div className='w-full border border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2'>
                    <div className='flex items-center gap-2'>
                    <div className='w-16 h-16 bg-primary rounded-xl'>

                    </div>
                    <div className='flex flex-col gap-1'>
                        <Badge variant='outline'>Birthday</Badge>
                        <div className='mx-2'>
                        <h3 className='flex items-center'>Al Saj Arena, nemom, tvm, kerala</h3>
                        <p className='flex items-center'><IconCalendar /> 25th may, 2025</p>
                        </div>
                    </div>
                    </div>
                    <div className='flex gap-2 justify-end w-full'>
                        <Review />
                    </div>
                </div>
            </div>

            
        </div>
    </div>
  )
}

export default page