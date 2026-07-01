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
import { IconCash, IconLocationCheck, IconWriting, IconX } from '@tabler/icons-react'
import { Input } from './ui/input'
import { PaymentCancellation } from './PaymentCancellation'
function Cancel() {
  return (
    <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button className='bg-primary'><IconCash />Cancel & Refund</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogTitle>
                        Apply for Cancellation
                    </DialogTitle>
                    <DialogDescription>
                        Please provide details for your cancellation request.
                    </DialogDescription>
                    <div className='h-96 overflow-y-scroll no-scrollbar'>
                    <div>
                        <h5 className='font-heading font-medium text-md '>We eager to know :</h5>
                            <Input type='text' placeholder='Share your reasons for cancellation...' className=' my-2' />
                        </div>
                    <div>
                        <h3 className='flex items-center gap-1 font-medium font-heading'><IconCash />Refund Details</h3>
                        <PaymentCancellation />
                    </div>
                    </div>
                    <DialogFooter>
                    <DialogClose asChild>
                        <Button><IconX />Close</Button>
                    </DialogClose>
                   
                        <Button className='bg-foreground'><IconWriting />Apply For Cancellation</Button>
                </DialogFooter>
                </DialogContent>
                
            </form>
        </Dialog>
  )
}

export {Cancel}