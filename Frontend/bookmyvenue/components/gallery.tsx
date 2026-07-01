"use client"
import React from 'react'
import { Badge } from './ui/badge'
import { GalleryViewAll } from './galleryViewAll'
import { TopRatedVenues } from './topRatedVenues'

type GalleryProps = {
  images?: string[] // optional array of image URLs; if not provided, placeholders are used
}

function Gallery({ images }: GalleryProps) {
  const defaults = [
    'https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png',
    'https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png',
    'https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png',
    'https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png',
    'https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png',
    // additional photos for "view all" modal or page
    'https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png',
    'https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png',
  ]

  const imgs = images && images.length > 0 ? images : defaults

  return (
    <div className="relative w-full md:max-w-7xl mx-auto my-5">
      {/* Main gallery: 5 photos with varying widths */}
      <h1 className='md:hidden font-heading  font-bold text-xl md:text-2xl my-2 px-2'>Feel The Beauty</h1>
      <div className="hidden md:grid md:grid-cols-6 md:gap-2">
        <div className="col-span-3 row-span-2 overflow-hidden rounded-l-3xl hover:scale-95 translate-y-[-5px] transition-all duration-300 hover:brightness-75">
          <img src={imgs[0]} alt="photo-1" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-1 overflow-hidden hover:scale-95 translate-y-[-5px] transition-all duration-300 hover:brightness-75">
          <img src={imgs[1]} alt="photo-2" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-2 overflow-hidden  rounded-tr-3xl hover:scale-95 translate-y-[-5px] transition-all duration-300 hover:brightness-75">
          <img src={imgs[2]} alt="photo-3" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-1 overflow-hidden  hover:scale-95 translate-y-[-5px] transition-all duration-300 hover:brightness-75">
          <img src={imgs[3]} alt="photo-4" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-2 overflow-hidden rounded-br-3xl hover:scale-95 translate-y-[-5px] transition-all duration-300 hover:brightness-75 ">
          <img src={imgs[4]} alt="photo-5" className="w-full h-full object-cover" />
        </div>
      </div>
        <div className='hidden md:inline md:absolute bottom-5 right-3 '>
            <GalleryViewAll images={imgs} />
        </div>
        <div className='md:hidden '>
        <TopRatedVenues CarousalData={imgs} /> 

        </div>
     
    </div>
  )
}

export { Gallery }