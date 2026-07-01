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
import { IconCalendarCheck, IconCash, IconClock, IconPlus, IconUpload, IconX } from '@tabler/icons-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { GroupDatePicker } from './groupDatePicker'

function Weekly() {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline" >
                        <IconPlus stroke={2} />  Add Weekly Pay
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm w-full">
                    <DialogTitle>
                        Add Weekly Pay
                    </DialogTitle>
                    <DialogDescription>
                        Set special pricing and boost your revenue.
                    </DialogDescription>
                    <div className='w-full md:overflow-x-scroll no-scrollbar'>
                        <div className=' '>
                            <div className='flex items-center gap-2'>
                                <h3 className='font-sans font-medium '>Name the Week Day</h3>
                                {/* <Badge>22-05-2026 to 05-06-2026</Badge> */}
                            </div>
                            <InputGroup className='w-full my-2'>
                                <InputGroupInput placeholder="Name the week day" className='text-muted-foreground ' />
                                <InputGroupAddon>
                                    <IconCalendarCheck />
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                        <div className=' flex flex-col gap-2 w-full'>
                            <div className='flex flex-col md:justify-between  py-3 border border-border rounded-lg px-2'>
                                <h3 className='font-sans font-medium '>New rent</h3>
                                <InputGroup className='w-full '>
                                    <InputGroupInput type='number' placeholder="Search..." defaultValue={1200} className='text-muted-foreground' />
                                    <InputGroupAddon>
                                        <IconCash />
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline"><IconX />Cancel</Button>
                        </DialogClose>
                        <Button > <IconUpload />Add The Dates</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export { Weekly }