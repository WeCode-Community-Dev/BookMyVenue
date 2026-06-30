import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { IconCash, IconClock, IconMail, IconPhone, IconPlus, IconUser } from '@tabler/icons-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'

function Offline() {
    return (
        <Dialog>
            <form className="w-full">
                <DialogTrigger asChild>
                    <Button  className='bg-primary text-background dark:text-foreground my-2 w-full'> <IconPlus /> Add Offline Events</Button>

                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogTitle>
                        Add Your Offline Events
                    </DialogTitle>
                    <DialogDescription>
                        Ensure Smooth Experience with the online and offline clients.
                    </DialogDescription>
                    <div className='h-96 overflow-y-scroll no-scrollbar'>
                        <div className=" flex flex-col gap-3">
                            <div>
                                <InputGroup className=''>
                                    <InputGroupInput placeholder="Enter the name " className='text-muted-foreground' />
                                    <InputGroupAddon>
                                        <IconUser />
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>

                            <div>
                                <InputGroup className=''>
                                    <InputGroupInput placeholder="Email Address...." className='text-muted-foreground' />
                                    <InputGroupAddon>
                                        <IconMail />
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                            <div>
                                <InputGroup className=''>
                                    <InputGroupInput type='number' placeholder="Phone Number....." className='text-muted-foreground' />
                                    <InputGroupAddon>
                                        <IconPhone />
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                        
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Time</label>
                                    <InputGroup className=''>
                                        <InputGroupInput type='time' placeholder="starting time" className='text-muted-foreground' />
                                        <InputGroupAddon>
                                            <IconClock />
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End Time</label>
                                    <InputGroup className=''>
                                        <InputGroupInput type='time' placeholder="starting time" className='text-muted-foreground' />
                                        <InputGroupAddon>
                                            <IconClock />
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                            </div>
                            <div>
                                <InputGroup className=''>
                                    <InputGroupInput type='number' placeholder="Hourly Rent..." className='text-muted-foreground' />
                                    <InputGroupAddon>
                                        <IconCash />
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                            <div>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Type Of The Event" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {/* will render the categories of the specific venue for which offline booking is planned */}
                                            <SelectLabel>Fruits</SelectLabel>   
                                            <SelectItem value="apple">Apple</SelectItem>
                                            <SelectItem value="banana">Banana</SelectItem>
                                            <SelectItem value="blueberry">Blueberry</SelectItem>
                                            <SelectItem value="grapes">Grapes</SelectItem>
                                            <SelectItem value="pineapple">Pineapple</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Special Notes</label>
                                <textarea name="notes" rows={4} className="w-full rounded-md border px-3 py-2 bg-background text-foreground" placeholder="Any special requirements or notes..."></textarea>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit" className="w-full">Save Event</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export { Offline }