'use client'
import React, { useState } from 'react'
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
import { IconLocationCheck, IconStarFilled, IconWriting, IconX } from '@tabler/icons-react'
import { Input } from './ui/input'

function Review() {
    const [rating , setRating] = useState(0)
  return (
    <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button className='bg-foreground'><IconWriting />Make a review</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogTitle>
                        Drop your review here
                    </DialogTitle>
                    <DialogDescription>
                        Please share your experience with us.
                    </DialogDescription>
                    <div>
                        <h5 className='font-heading font-medium text-md mb-2'>Rate your experience:</h5>
                        <div className='flex items-center gap-2'>
                                                    {Array.from({ length: 5 }, (_, index) => {
                                                        const starValue = index + 1
                                                        return (
                                                            <button
                                                                key={starValue}
                                                                type='button'
                                                                onClick={() => setRating(starValue)}
                                                                aria-label={`${starValue} star`}
                                                                className={`text-2xl ${rating >= starValue ? 'text-amber-400' : ''}`}
                                                            >
                                                                <IconStarFilled />
                                                            </button>
                                                        )
                                                    })}
                                                </div>

                        <div>
                            <Input placeholder='Share your experience...' className='mt-5' />
                        </div>
                    </div>
                    <DialogFooter>
                    <DialogClose asChild>
                        <Button><IconX />Close</Button>
                    </DialogClose>
                   
                        <Button className='bg-foreground'><IconWriting />Submit My Review</Button>
                </DialogFooter>
                </DialogContent>
                
            </form>
        </Dialog>
  )
}

export {Review}