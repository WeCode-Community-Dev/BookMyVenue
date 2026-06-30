import { IconCalendar, IconClock } from '@tabler/icons-react'
import React from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

function UpComing() {
    return (
        <div className='w-full md:max-w-7xl mx-auto flex flex-col gap-1 font-sans'>
            <div>
                <h2 className="text-xl font-heading font-bold tracking-tight text-foreground flex items-center gap-2">
                    <IconClock className="text-primary" /> Upcoming Events
                </h2>
                <p className="text-sm text-muted-foreground">Monitor upcoming events for your venues</p>
            </div>
            <div className='h-64 p-2 rounded-3xl border border-border flex flex-col gap-2 items-center overflow-y-scroll no-scrollbar'>
                <div className='w-full border border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2 '>
                    <div className='flex items-center gap-2 '>
                        <div className='w-16 h-16 bg-primary rounded-xl'>

                        </div>
                        <div className='flex flex-col gap-1'>
                            <Badge variant='outline'>Birthday</Badge>
                            <div className='mx-2'>
                                <h3 className='flex items-center font-heading font-semibold'>Al Saj Arena, nemom, tvm, kerala</h3>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2 items-end w-full flex-col font-sans'>
                        <p className='flex items-center'><IconCalendar /> 25th may, 2025</p>
                        <p className='flex items-center font-mono'><IconClock /> 10:00AM - 5:00PM</p>

                    </div>
                </div>
                <div className='w-full border border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2 '>
                    <div className='flex items-center gap-2 '>
                        <div className='w-16 h-16 bg-primary rounded-xl'>

                        </div>
                        <div className='flex flex-col gap-1'>
                            <Badge variant='outline'>Birthday</Badge>
                            <div className='mx-2'>
                                <h3 className='flex items-center font-heading font-semibold'>Al Saj Arena, nemom, tvm, kerala</h3>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2 items-end w-full flex-col font-sans'>
                        <p className='flex items-center'><IconCalendar /> 25th may, 2025</p>
                        <p className='flex items-center font-mono'><IconClock /> 10:00AM - 5:00PM</p>

                    </div>
                </div>
                <div className='w-full border border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2 '>
                    <div className='flex items-center gap-2 '>
                        <div className='w-16 h-16 bg-primary rounded-xl'>

                        </div>
                        <div className='flex flex-col gap-1'>
                            <Badge variant='outline'>Birthday</Badge>
                            <div className='mx-2'>
                                <h3 className='flex items-center font-heading font-semibold'>Al Saj Arena, nemom, tvm, kerala</h3>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2 items-end w-full flex-col font-sans'>
                        <p className='flex items-center'><IconCalendar /> 25th may, 2025</p>
                        <p className='flex items-center font-mono'><IconClock /> 10:00AM - 5:00PM</p>

                    </div>
                </div>
                <div className='w-full border border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2 '>
                    <div className='flex items-center gap-2 '>
                        <div className='w-16 h-16 bg-primary rounded-xl'>

                        </div>
                        <div className='flex flex-col gap-1'>
                            <Badge variant='outline'>Birthday</Badge>
                            <div className='mx-2'>
                                <h3 className='flex items-center font-heading font-semibold'>Al Saj Arena, nemom, tvm, kerala</h3>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2 items-end w-full flex-col font-sans'>
                        <p className='flex items-center'><IconCalendar /> 25th may, 2025</p>
                        <p className='flex items-center font-mono'><IconClock /> 10:00AM - 5:00PM</p>

                    </div>
                </div>
                <div className='w-full border border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2 '>
                    <div className='flex items-center gap-2 '>
                        <div className='w-16 h-16 bg-primary rounded-xl'>

                        </div>
                        <div className='flex flex-col gap-1'>
                            <Badge variant='outline'>Birthday</Badge>
                            <div className='mx-2'>
                                <h3 className='flex items-center font-heading font-semibold'>Al Saj Arena, nemom, tvm, kerala</h3>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2 items-end w-full flex-col font-sans'>
                        <p className='flex items-center'><IconCalendar /> 25th may, 2025</p>
                        <p className='flex items-center font-mono'><IconClock /> 10:00AM - 5:00PM</p>

                    </div>
                </div>
                <div className='w-full border border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2 '>
                    <div className='flex items-center gap-2 '>
                        <div className='w-16 h-16 bg-primary rounded-xl'>

                        </div>
                        <div className='flex flex-col gap-1'>
                            <Badge variant='outline'>Birthday</Badge>
                            <div className='mx-2'>
                                <h3 className='flex items-center font-heading font-semibold'>Al Saj Arena, nemom, tvm, kerala</h3>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2 items-end w-full flex-col font-sans'>
                        <p className='flex items-center'><IconCalendar /> 25th may, 2025</p>
                        <p className='flex items-center font-mono'><IconClock /> 10:00AM - 5:00PM</p>

                    </div>
                </div>
            </div>
        </div>
    )
}

export { UpComing }