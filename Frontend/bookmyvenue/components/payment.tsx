import { IconCash } from '@tabler/icons-react'
import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

function Payment() {
    return (
        <div className='w-full md:max-w-7xl rounded-3xl mx-auto py-3 px-5 '>
            <div className='flex flex-col md:flex-row items-center w-full'>
            <div className='w-full md:w-1/3 border border-border rounded-3xl  py-3 px-5 '>
                <h3 className='md:text-2xl text-xl font-heading font-bold flex items-center gap-2'><IconCash size={30} />Payment Details</h3>
                <p className='font-sans italic'>Detailed calculation of what we charge you and what you pay for</p>
                <div className=''>
                    <div className='flex items-center justify-between border-b border-border my-10'>
                        <h5 className='text-lg font-sans font-medium'>Rent For One Hour : </h5>
                        <h4 className='font-mono text-lg font-semibold'>$10.00</h4>
                    </div>
                    <div className='flex items-center justify-between border-b border-border my-10'>
                        <h5 className='text-lg font-sans font-medium'>Platform Charge : </h5>
                        <h4 className='font-mono text-lg font-semibold'>$3.00</h4>
                    </div>
                    <div className='flex items-center justify-between border-b border-border my-10'>
                        <h5 className='text-lg font-sans font-medium'>GST : </h5>
                        <h4 className='font-mono text-lg font-semibold'>$4.00</h4>
                    </div>
                    <div className='flex items-center justify-between border-b border-border my-10'>
                        <h5 className='text-lg font-sans font-medium'>Total Rent (4 hours): </h5>
                        <h4 className='font-mono text-lg font-semibold'>$40.00</h4>
                    </div>
                    <div className='flex items-center justify-between my-10'>
                        <h5 className='text-xl font-sans font-bold'>Total Price: </h5>
                        <h4 className='font-mono text-lg font-semibold'>$57.00</h4>
                    </div>
                </div>
            </div>
            <div className='w-full md:w-2/3 flex items-center justify-center my-3 '>
            <div className='w-full flex flex-col justify-center items-center'>
                <Image src='/payment.png' alt='Payment' height={200} width={200} className=''/>
                <h3 className='text-3xl font-heading text-center font-extrabold'>Pay It With 100% Security!</h3>
                <p className="text-center">BMV have a secured payment gateway, pay it, experience the moment</p>
                </div>
            </div>
            </div>
            <div className='w-full flex items-center justify-center my-3 '>
            <Button className='w-full md:w-1/3 h-14 hover:scale-90 translate-y-[-0.5] transition-all duration-300'> <IconCash />Pay it!</Button>
            </div>
        </div>
    )
}

export { Payment }