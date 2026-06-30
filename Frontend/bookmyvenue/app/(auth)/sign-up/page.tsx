"use client"
import React from 'react'
import { useState } from 'react'
import { SignUp, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import axios from 'axios'


function page() {
  
  return (
    <>
      <div className='p-5 flex justify-center items-center mx-auto gap-6 '>
        <div className='w-[50%] h-screen flex flex-col justify-center items-center '>
          
          <SignUp />
        </div>
        <div className='w-[50%] bg-teal-200 h-screen'>
          je
        </div>
      </div>
    </>
  )
}

export default page