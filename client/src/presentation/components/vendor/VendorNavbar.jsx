import React from 'react'
import { Input } from "@/components/ui/input"

const VendorNavbar = () => {
  return (
    <div className='border-b p-4 flex justify-between items-center bg-white'> 
      <Input placeholder='search...'
      className='w-1/3'/>
      <p className='font-semibold'>Vendor</p>
        
    </div>
  )
}

export default VendorNavbar