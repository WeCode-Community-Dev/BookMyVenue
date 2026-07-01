import Image from 'next/image';
import React from 'react'

interface BannerProps {
    bgImage: string;
}

function Banner({ bgImage }: BannerProps) {
  return (
    <div className={`w-full h-44 border border-border bg-[url(${bgImage})] bg-cover bg-center bg-no-repeat rounded-3xl flex items-center justify-between`}>
            <Image src={bgImage} alt="BookMyVenue Logo" width={200} height={200} className='w-full h-44 rounded-3xl'/>
    </div>
  )
}

export { Banner }