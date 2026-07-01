
import { Banner } from '@/components/banner'
import { PaymentPDF } from '@/components/PaymentPDF'
import { IconTicket } from '@tabler/icons-react'
import React from 'react'

function page() {
  return (
    <div className='w-full max-w-7xl mx-auto px-2 '>
        <h1 className='text-3xl font-heading font-bold text-center my-3'>Booking Confirmation Document</h1>
        <PaymentPDF />
        <div className='my-10'>
          <h3 className='font-heading text-2xl font-bold mt-5 flex items-center gap-2'><IconTicket stroke={2}/>Things To Look After</h3>
          <div className='font-sans flex flex-col gap-2 '>
            <p>
              1,Dont try to create fake booking tickets , since all data are degitalized and since we have a centralized system , this ticket is just a secondary asset.
            </p>
            <p>
              2,If the service of the venue is not good or you felt disrespected , dont be afrid to report us , we have a strong Guest FeedBack Unit , where we will take required decisions,
            </p>
            <p>
              3,Ultimate aim of BMV is to serve our guest with best venues so that they can experience the beauty of memmories.
            </p>
          </div>
        </div>
        <Banner bgImage='/banner4.png'/>
    </div>
  )
}


export default page