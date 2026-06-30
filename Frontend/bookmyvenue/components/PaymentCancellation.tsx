import React from 'react'

function PaymentCancellation() {
  return (
    <div className='w-full my-2 '>
            <div className='flex flex-col md:flex-row items-center w-full'>
            <div className='w-full border border-border rounded-3xl  py-3 px-5 '>
                <p className='font-sans italic'>Detailed calculation of refund policy</p>
                <div className=''>
                    <div className='flex items-center justify-between border-b border-border my-10'>
                        <h5 className='text-lg font-sans font-medium'>Total Rent : </h5>
                        <h4 className='font-mono text-lg font-semibold'>$189.00</h4>
                    </div>
                    <div className='flex items-center justify-between border-b border-border my-10 p-2 text-primary'>
                        <h5 className='text-lg font-sans font-medium'>Refund Fees : </h5>
                        <h4 className='font-mono text-lg font-semibold'>15%</h4>
                    </div>
                    <div className='flex items-center justify-between my-10'>
                        <h5 className='text-xl font-sans font-bold'>Total Refund: </h5>
                        <h4 className='font-mono text-lg font-semibold'>$28.35</h4>
                    </div>
                </div>
            </div>
    
        </div>
        </div>
  )
}

export { PaymentCancellation }