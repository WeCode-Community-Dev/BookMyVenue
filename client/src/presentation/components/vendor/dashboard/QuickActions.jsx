import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const QuickActions = () => {
  const navigate=useNavigate()
  return (
    <div className='flex gap-4 mt-6'>
        <Button  onClick={()=>navigate("/addvenue")}
            className="bg-indigo-600 text-white hover:bg-indigo-700">
          Add Venue
        </Button>
        <Button onClick={()=>navigate("/bookings")}
           className=" bg-gray-200 text-gray-800 hover:bg-gray-300" >
          View Bookings
        </Button>
      
    </div>
  )
}

export default QuickActions
 