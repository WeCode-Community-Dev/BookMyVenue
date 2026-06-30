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
import { IconImageGeneration } from '@tabler/icons-react'
import { Badge } from './ui/badge'
import Image from 'next/image'
import { TopRatedVenues } from './topRatedVenues'

interface GalleryProps {
    images: string[];
}

function GalleryViewAll({ images }: GalleryProps) {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline" >
                        <IconImageGeneration stroke={2} />  View All
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm w-full">

                    <DialogTitle>
                        Gallery Which Connects With The Heart
                    </DialogTitle>
                    <DialogDescription>
                        Decide where to spend your valuable time with us.
                    </DialogDescription>
                    <div className='flex flex-col items-center overflow-y-scroll no-scrollbar'>
                        <TopRatedVenues CarousalData={images}/>
                        
                        {/* {
                            images.map((image, index) => (
                                <Image src={image} fill alt={`Gallery Image ${index + 1}`} className='rounded-lg mb-4 object-cover w-full h-40 hover:scale-95 translate-y-[-5px] transition-all duration-300 hover:brightness-75' key={index} />
                            ))
                        } */}
                    </div>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export { GalleryViewAll }