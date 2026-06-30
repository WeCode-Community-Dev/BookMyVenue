"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconBriefcase, IconBuilding, IconCompassFilled, IconHeart, IconSpeakerphone } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import { toast } from 'sonner'
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from 'next/navigation'
function page() {
  const router = useRouter()
  const [org, setOrg] = useState("")
  const [profession, setProfession] = useState("")
  const [promise, setPromise] = useState("")
  const [info, setInfo] = useState("")
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)


  const checkOwnerStaus = async () => {
    setChecking(true)
    const jwtToken = await getToken()
    axios
      .get(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/owner/check`, {
        headers: {
          // Headers are nested under the 'headers' key
          authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        },
      })
      .then((res) => {
        console.log(res)
        if (res.data.status_code == 200) {
          toast.success("Owner has onboarded!...")
          router.push('/dashboard')
        }
        if (res.data.status_code == 201) {
          toast.success("you have onboarded already!")
          router.push('/dashboard')
        }
      })
      .catch((err) => {
        console.log(err)
        if (err.response && err.response.status_code === 404) {
          toast.info(err.response.message)
        }
      })
      .finally(() => {
        setChecking(false)
      })
  }


  const handleOnBoarding = async () => {
    setLoading(true)
    console.log("uploading.........")
    const jwtToken = await getToken()
    axios
      .post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/owner/onboarding`, {
        organization: org,
        profession: profession,
        promise: promise,
        self_info: info
      }, {
        headers: {
          // Headers are nested under the 'headers' key
          authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        },
      })
      .then((res) => {
        console.log(res)
        if (res.data.status_code == 200) {
          toast.success("completed the owner onboarding...")
          router.push('/dashboard')
        }
        if (res.data.status_code == 201) {
          toast.success("you have onboarded already!")
          router.push('/dashboard')
        }
      })
      .catch((err) => {
        console.log(err)
        if (err.response && err.response.status_code === 404) {
          toast.info(err.response.message)
          router.push('/')
        }
      })
      .finally(() => {
        setLoading(false)
      })

  }


  useEffect(() => {
    checkOwnerStaus()
  }, [])


  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
        <div className="bg-white/80 backdrop-blur-md border border-border rounded-xl shadow-md p-8 flex flex-col items-center gap-4">
          <Spinner />
          <h2 className="text-xl font-semibold">Checking Owner Profile</h2>
          <p className="text-sm text-muted-foreground">Please wait while we verify your owner status...</p>
        </div>
      </div>
    )
  }


  return (
    <>
      <div className='p-5 flex justify-center items-center mx-auto gap-6 '>
        <div className='md:w-[50%] h-screen flex flex-col justify-center items-center '>
          <h1 className='font-sans text-4xl font-bold text-center'>Become An Owner</h1>
          <h2 className='text-neutral-400 text-sans'>Get Your Venues Listed , Start Earning As a Owner</h2>
          <div className=' flex flex-col gap-4 mt-3 p-2 w-full md:w-[70%] '>
            <div className='flex flex-col gap-2'>
              <h3 className='flex items-center gap-1 font-sans font-medium text-lg'><IconBuilding />Name Of The Organization</h3>
              <Input placeholder='Enter Your Company Name' value={org} onChange={(e) => setOrg(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
              <h3 className='flex items-center gap-1 font-sans font-medium text-lg'><IconBriefcase />Your Profession</h3>
              <Input placeholder='Enter Your Profession' value={profession} onChange={(e) => setProfession(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
              <h3 className='flex items-center gap-1 font-sans font-medium text-lg'><IconHeart />Your Guarenty For Guests</h3>
              <Input placeholder='Tell What you promise them' value={promise} onChange={(e) => setPromise(e.target.value)} />
              <p className='text-sm font-light text-muted-foreground'>Lets guests find it secure , express what your organization can do for them and will ensure them</p>
            </div>
            <div className='flex flex-col gap-2'>
              <h3 className='flex items-center gap-1 font-sans font-medium text-lg'><IconSpeakerphone />Share Who You Are</h3>
              <textarea placeholder='Tell What you promise them' className='border border-border rounded-lg p-2' value={info} onChange={(e) => setInfo(e.target.value)} />
              <p className='text-sm font-light text-muted-foreground'>Share about yourself , let it gain guests for your venues</p>
            </div>
            <div className='flex flex-col gap-2'>
              <Button onClick={handleOnBoarding}>
                {
                  loading ? (
                    <Spinner />
                  ) : (
                    <>
                      <IconCompassFilled />Complete Onboarding
                    </>
                  )
                }

              </Button>
            </div>
          </div>

        </div>
        <div className='hidden md:w-[50%] md:block bg-teal-200 h-screen'>
          je
        </div>
      </div>
    </>
  )
}

export default page