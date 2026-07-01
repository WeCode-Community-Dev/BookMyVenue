import Image from 'next/image'
import React from 'react'

function Footer() {
  return (
    <div className='w-full h-56 my-16 border-t-2 border-border'>
        <Image src='/brand2.png' alt="BookMyVenue Logo" width={200} height={200} className='w-full h-full my-10'/>
    </div>
  )
}

export { Footer }