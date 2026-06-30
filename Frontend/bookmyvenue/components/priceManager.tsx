import React from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { IconBriefcase, IconCash, IconPlus, IconX } from '@tabler/icons-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Seasonal } from './seasonal'
import { Weekly } from './weekly'

function PriceManager() {
    return (
        <div className='w-full my-10 gap-2 flex flex-col'>
            <div className='flex md:flex-row flex-col md:justify-between  py-3 border border-border rounded-lg px-2'>
                <h3 className='font-sans font-medium text-lg'>Standerd rent</h3>
                <InputGroup className='w-full md:w-96'>
                    <InputGroupInput type='number' placeholder="Search..." defaultValue={1200} className='text-muted-foreground' />
                    <InputGroupAddon>
                        <IconCash />
                    </InputGroupAddon>
                </InputGroup>
            </div>
            <div className='flex flex-col md:justify-between gap-2 py-3  rounded-lg'>
                <div className='flex items-center justify-between'>
                    <h3 className='font-sans font-medium text-lg'>Seasonal Pay</h3>
                    <Seasonal />
                </div>
                <div className='flex md:flex-row flex-col md:justify-between  py-3 border border-border rounded-lg px-2'>
                    <div className='flex items-center gap-2'>
                        <h3 className='font-sans font-medium text-lg'>Onam</h3>
                        <Badge>22-05-2026 to 05-06-2026</Badge>
                    </div>
                    <div className='flex items-center gap-2'>
                    <InputGroup className='w-full md:w-96'>
                        <InputGroupInput type='number' placeholder="Search..." defaultValue={1200} className='text-muted-foreground' />
                        <InputGroupAddon>
                            <IconCash />
                        </InputGroupAddon>
                    </InputGroup>
                    <Button variant='outline'>
                    <IconX className='cursor-pointer text-primary' />

                    </Button>
                    </div>
                </div>
                <div className='flex md:flex-row flex-col md:justify-between  py-3 border border-border rounded-lg px-2'>
                    <div className='flex items-center gap-2'>
                        <h3 className='font-sans font-medium text-lg'>Onam</h3>
                        <Badge>22-05-2026 to 05-06-2026</Badge>
                    </div>
                    <div className='flex items-center gap-2'>
                    <InputGroup className='w-full md:w-96'>
                        <InputGroupInput type='number' placeholder="Search..." defaultValue={1200} className='text-muted-foreground' />
                        <InputGroupAddon>
                            <IconCash />
                        </InputGroupAddon>
                    </InputGroup>
                    <Button variant='outline'>
                    <IconX className='cursor-pointer text-primary' />

                    </Button>
                    </div>
                </div>
                <div className='flex md:flex-row flex-col md:justify-between  py-3 border border-border rounded-lg px-2'>
                    <div className='flex items-center gap-2'>
                        <h3 className='font-sans font-medium text-lg'>Onam</h3>
                        <Badge>22-05-2026 to 05-06-2026</Badge>
                    </div>
                    <div className='flex items-center gap-2'>
                    <InputGroup className='w-full md:w-96'>
                        <InputGroupInput type='number' placeholder="Search..." defaultValue={1200} className='text-muted-foreground' />
                        <InputGroupAddon>
                            <IconCash />
                        </InputGroupAddon>
                    </InputGroup>
                    <Button variant='outline'>
                    <IconX className='cursor-pointer text-primary' />

                    </Button>
                    </div>
                </div>
            </div>
            <div className='flex flex-col md:justify-between gap-2 py-3  rounded-lg'>
                <div className='flex items-center justify-between'>
                    <h3 className='font-sans font-medium text-lg'>Weekly Pay</h3>
                    <Weekly />
                </div>
                <div className='flex md:flex-row flex-col md:justify-between  py-3 border border-border rounded-lg px-2'>
                    <div className='flex items-center gap-2'>
                        <h3 className='font-sans font-medium text-lg'>Saturday</h3>

                    </div>
                    <div className='flex items-center gap-2'>
                    <InputGroup className='w-full md:w-96'>
                        <InputGroupInput type='number' placeholder="Search..." defaultValue={1200} className='text-muted-foreground' />
                        <InputGroupAddon>
                            <IconCash />
                        </InputGroupAddon>
                    </InputGroup>
                    <Button variant='outline'>
                    <IconX className='cursor-pointer text-primary' />

                    </Button>
                    </div>
                </div>
                <div className='flex md:flex-row flex-col md:justify-between  py-3 border border-border rounded-lg px-2'>
                    <div className='flex items-center gap-2'>
                        <h3 className='font-sans font-medium text-lg'>Sunday</h3>

                    </div>
                    <div className='flex items-center gap-2'>
                    <InputGroup className='w-full md:w-96'>
                        <InputGroupInput type='number' placeholder="Search..." defaultValue={1200} className='text-muted-foreground' />
                        <InputGroupAddon>
                            <IconCash />
                        </InputGroupAddon>
                    </InputGroup>
                    <Button variant='outline'>
                    <IconX className='cursor-pointer text-primary' />

                    </Button>
                    </div>
                </div>
            </div>
            <Button className='mx-auto mt-4'>
                <IconBriefcase  stroke={2} />  Update Price Managment
            </Button>
        </div>
    )
}

export { PriceManager }