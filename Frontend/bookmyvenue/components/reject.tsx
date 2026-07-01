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

import { IconCash, IconCross, IconLocationCheck, IconWriting, IconX } from '@tabler/icons-react'
import { Input } from './ui/input'
import { PaymentCancellation } from './PaymentCancellation'
function Reject() {
  return (
    <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button className='bg-primary'><IconX />Reject the Venue</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogTitle>
                        This Venue Has Rejected
                    </DialogTitle>
                    <DialogDescription>
                        Share Why This venue failed to showcase.
                    </DialogDescription>
                    <div className=''>
                    <div>
                        <h5 className='font-heading font-medium text-md '>What made as to take this call :</h5>
                            <Input type='text' placeholder='Share your reasons for rejection...' className=' my-2' />
                        </div>
                    </div>
                    <DialogFooter>
                    <DialogClose asChild>
                        <Button><IconX />Close</Button>
                    </DialogClose>
                   
                        <Button className='bg-foreground'><IconWriting />Confirm & sent</Button>
                </DialogFooter>
                </DialogContent>
                
            </form>
        </Dialog>
  )
}

export {Reject}