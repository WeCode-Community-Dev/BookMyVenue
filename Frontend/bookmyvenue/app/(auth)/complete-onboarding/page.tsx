"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/ui/navbar'
import { IconCompassFilled, IconDashboard, IconPhone } from '@tabler/icons-react'
import { useAuth } from '@clerk/nextjs'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { useRouter } from 'next/navigation'

function page() {

    const router = useRouter()
    const [phone, setPhone] = useState('')
    const { getToken } = useAuth()
    const [loading ,setLoading] =useState(false)
    const HandleUserOnboarding = async () => {
        setLoading(true)
        console.log("uploading.........")
        const jwtToken = await getToken()
        axios
            .post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/user/onboarding`, {
                phone: phone,
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
                    router.push('/')
                }
                if (res.data.status_code == 201) {
                    toast.success("you have onboarded already!")
                    router.push('/')
                }
            })
            .catch((err) => {
                    console.log(err.response.data)  //contains the details of the error
                    if (err.response && err.response.status === 404) {
                      toast.info(err.response.message)
                    }
                    if (err.response && err.response.status === 403) {
                    //   toast.info(err.response.data)
                    }
                  })
            .finally(() => {
            setLoading(false)
            })

    }



    return (
        <div className='w-full md:max-w-7xl mx-auto p-2 py-10'>

            <h1 className='font-heading font-bold text-2xl capitalize text-center'>Complete Your Onboadring</h1>
            <p className='font-sans text-center text-muted-foreground'>Experience the smoothness we BMV offers!</p>
            <div className='md:w-[60%] mx-auto my-10'>
                <div className='flex flex-col gap-2'>
                    <h3 className='flex items-center gap-1 font-sans font-medium text-lg'><IconPhone />Phone Number</h3>
                    <Input type='number' placeholder='enter your phone' maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <p className='text-sm font-light text-muted-foreground'>We collect your numbers just for the onboarding process and will not use it for any personal data leakage problems and will only share it with the venued where you have booked</p>
                </div>
                <div className='w-full flex justify-center'>
                    <Button className='my-10 mx-auto' onClick={HandleUserOnboarding}> 
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
    )
}

export default page