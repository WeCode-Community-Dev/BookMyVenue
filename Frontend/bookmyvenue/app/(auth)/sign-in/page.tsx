"use client"
import React from 'react'
import { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useAuth } from "@clerk/nextjs";

import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { SignIn } from '@clerk/nextjs'


function page() {

  return (
    <>
      <div className='p-5 flex justify-center items-center mx-auto gap-6 '>
        <div className='w-[50%] h-screen flex flex-col justify-center items-center '>
          
          <div className=' flex flex-col gap-4  p-5 w-[70%] items-center justify-center'>

            <SignIn />



            
           
          </div>
        </div>
        <div className='w-[50%] bg-red-200 h-screen'>
          je
        </div>
      </div>
    </>
  )
}

export default page