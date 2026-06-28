import React from 'react'
import { Card,CardContent } from "@/components/ui/card"

const DashboardCard = ({title,value}) => {
  return (
    <Card >
      <CardContent className="bg-white shadow rounded-lg p-6">
        <h2 className='text-sm font-medium text-gray-500'>{title}</h2>
        <p className='text-2xl font-bold text-gray-900'>{value}</p>
      </CardContent>
    </Card>

  )
}

export default DashboardCard