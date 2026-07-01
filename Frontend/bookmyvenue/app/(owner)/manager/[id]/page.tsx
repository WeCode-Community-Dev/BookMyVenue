import { PriceManager } from '@/components/priceManager'
import { IconCash } from '@tabler/icons-react'
import React from 'react'

function page() {
  return (
    <div className='w-full md:max-w-7xl mx-auto px-2'>
        <div>
            <h1 className='text-2xl font-bold text-foreground flex items-center gap-2'> <IconCash size={30}/> Price Manager</h1>
            <p className='text-sm text-muted-foreground'>Manage your venue's pricing and discounts</p>
        </div>
        <PriceManager />
    </div>
  )
}

export default page