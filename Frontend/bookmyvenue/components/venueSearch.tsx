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
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { IconSearch } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

function VenueSearch() {
    return (
        <Dialog>
            <form className='w-[50%]'>
                <DialogTrigger asChild>
                    <div className='w-ful'>
                        <InputGroup className="w-full group">
                            <InputGroupInput placeholder="Search..." />
                            <InputGroupAddon>
                                <IconSearch />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogTitle>
                        Find Your Venues
                    </DialogTitle>
                    <DialogDescription>
                        Search it, book it, enjoy your time with BVM
                    </DialogDescription>
                    <div>
                        <InputGroup className="w-full group">
                            <InputGroupInput placeholder="Search..." />
                            <InputGroupAddon>
                                <IconSearch />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div className='h-52 overflow-y-scroll no-scrollbar flex flex-col gap-2'>
                        <Alert className='hover:bg-primary-foreground cursor-pointer'>
                            <AlertTitle>Al Saj Convention Center</AlertTitle>
                            <AlertDescription>
                                Your payment of $29.99 has been processed. A receipt has been sent to
                                your email address.
                            </AlertDescription>
                        </Alert>
                        <Alert>
                            <AlertTitle>Al Saj Convention Center</AlertTitle>
                            <AlertDescription>
                                Your payment of $29.99 has been processed. A receipt has been sent to
                                your email address.
                            </AlertDescription>
                        </Alert>
                        <Alert>
                            <AlertTitle>Al Saj Convention Center</AlertTitle>
                            <AlertDescription>
                                Your payment of $29.99 has been processed. A receipt has been sent to
                                your email address.
                            </AlertDescription>
                        </Alert>
                        <Alert>
                            <AlertTitle>Al Saj Convention Center</AlertTitle>
                            <AlertDescription>
                                Your payment of $29.99 has been processed. A receipt has been sent to
                                your email address.
                            </AlertDescription>
                        </Alert>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export { VenueSearch }