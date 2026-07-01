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
import { IconLocationCheck } from '@tabler/icons-react'

function LocationFinder() {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline" className='hover:bg-destructive/10'>
                        <div className='flex items-center gap-1 cursor-pointer p-2 rounded-lg justify-between '>
                            <p className='italic text-primary md:text-md'>Poovar</p>
                            <IconLocationCheck className='cursor-pointer mt-1' height={20} width={20} />
                        </div>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogTitle>
                        Set Your Location
                    </DialogTitle>
                    <DialogDescription>
                        Please enter your location to find nearby venues.
                    </DialogDescription>
                    <div>

                    </div>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export { LocationFinder }