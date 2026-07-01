"use client"
import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { IconCategory, IconHeartPlus, IconIcons } from '@tabler/icons-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'


interface categoriesProp {
  name: string
  icon_name: string
}

interface Amenities {
  name: string
  icon_name: string
}

function page() {
  const [active, setActive] = useState('category')
  const [name, setName] = useState("")
  const [icon, setIcon] = useState("")
  const [categories, setCategories] = useState<categoriesProp[]>([])
  const [amenities, setAmenities] = useState<Amenities[]>([])

  const { getToken } = useAuth()
  const HandleAddCategories = () => {
    if (name == "" || icon == "") {
      toast.info("add the required details")
    }
    else {
      let cate = {
        name: name,
        icon_name: icon
      }

      setCategories(prevCategories => [...prevCategories, cate])
      setName('')
      setIcon('')
    }

  }

  const HandleAddAmenities = () => {
    if (name == "" || icon == "") {
      toast.info("add the required details")
    }
    else {
      let amenity = {
        name: name,
        icon_name: icon
      }

      setAmenities(prevCategories => [...prevCategories, amenity])
      setName('')
      setIcon('')
    }

  }


  const HandleCategorySubmisssion = async () => {
    const jwtToken = await getToken()
    axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/admin/category`, {
      category: categories
    }, {
      headers: {
        // Headers are nested under the 'headers' key
        authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      },
    })
      .then((res) => {
        console.log(res)
        if (res.data.status_code == 201) {
          toast.success("successfully created the categories")
        }

        setCategories([])
      })
      .catch((err) => {
        console.log(err.response.data)
        if (err.response.data.status_code == 400) {
          toast.error(err.response.data.message)
        }
      })
  }

  const HandleAmenitySubmisssion = async () => {
    const jwtToken = await getToken()
    axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/admin/amenity`, {
      amenity: amenities
    }, {
      headers: {
        // Headers are nested under the 'headers' key
        authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      },
    })
      .then((res) => {
        console.log(res)
        if (res.data.status_code == 201) {
          toast.success("successfully created the amenities")
        }

        setCategories([])
      })
      .catch((err) => {
        console.log(err.response.data)
        if (err.response.data.status_code == 400) {
          toast.error(err.response.data.message)
        }
      })
  }

  return (
    <div className='w-full md:max-w-7xl mx-auto px-2 lg:px-0'>
      <div className='flex items-center justify-between border-b py-5'>
        <div>
          <h3 className='font-bold text-2xl font-heading'>Admin Control Panel</h3>
          <p className='text-muted-foreground'>create the categories and amenities that servers the venues</p>
        </div>
        <Badge variant={'destructive'}>Admin Panel</Badge>
      </div>
      <div className='flex items-center gap-2 w-full my-5'>
        <div className={`flex items-center justify-center gap-2 px-3 py-2 w-[50%] border rounded-xl hover:scale-95 transition-all duration-300 ${active == 'category' ? ' border-primary bg-destructive/20 text-primary' : 'border-secondary-foreground/30'}`} onClick={() => {
          setName('')
          setIcon('')
          setActive('category')
        }}>
          <IconCategory stroke={2} size={24} />
          Add Category
        </div>
        <div className={`flex items-center justify-center gap-2 px-3 py-2 w-[50%] border rounded-xl hover:scale-95 transition-all duration-300 ${active == 'amenity' ? ' border-primary bg-destructive/20 text-primary' : 'border-secondary-foreground/30'}`} onClick={() => {
          setName('')
          setIcon('')
          setActive('amenity')
        }}>
          <IconHeartPlus stroke={2} size={24} />
          Add amenity
        </div>
      </div>
      {
        active == 'category' ? (
          <div className='w-full md:w-[60%] mx-auto flex flex-col gap-3 my-10'>
            <div>
              <InputGroup>
                <InputGroupInput placeholder="Name Your Category" value={name} onChange={(e) => {
                  setName(e.target.value)
                }} />
                <InputGroupAddon>
                  <IconCategory />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className='flex flex-col gap-1'>
              <InputGroup>
                <InputGroupInput placeholder="Provide the icon name" value={icon} onChange={(e) => {
                  setIcon(e.target.value)
                }} />
                <InputGroupAddon>
                  <IconIcons />
                </InputGroupAddon>
              </InputGroup>
              <Label className='italic text-muted-foreground font-light'>We are using Tabular Icon for icons, so provide valid icon names like IconCategory etc</Label>
            </div>
            <div className='flex items-center w-full overflow-x-scroll no-scrollbar'>
              {
                categories.map(category => {
                  return (
                    <Badge key={category.name}>
                      {category.name}
                    </Badge>
                  )
                })
              }
            </div>
            <div className='flex items-center gap-1 w-full'>
              <Button className='w-[49%]' variant={'destructive'} onClick={HandleAddCategories}>Add to the list</Button>
              <Button className='w-[49%]' onClick={HandleCategorySubmisssion}>Create the categories</Button>
            </div>
          </div>
        ) : (
          <div className='w-full md:w-[60%] mx-auto flex flex-col gap-3 my-10'>
            <div>
              <InputGroup>
                <InputGroupInput placeholder="Name Your Amenity" value={name} onChange={(e) => {
                  setName(e.target.value)
                }} />
                <InputGroupAddon>
                  <IconCategory />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className='flex flex-col gap-1'>
              <InputGroup>
                <InputGroupInput placeholder="Provide the icon name" value={icon} onChange={(e) => {
                  setIcon(e.target.value)
                }} />
                <InputGroupAddon>
                  <IconIcons />
                </InputGroupAddon>
              </InputGroup>
              <Label className='italic text-muted-foreground font-light'>We are using Tabular Icon for icons, so provide valid icon names like IconCategory etc</Label>
            </div>
            <div className='flex items-center w-full overflow-x-scroll no-scrollbar'>
              {
                amenities.map(amenity => {
                  return (
                    <Badge key={amenity.name}>
                      {amenity.name}
                    </Badge>
                  )
                })
              }
            </div>
            <div className='flex items-center gap-1 w-full'>
              <Button className='w-[49%]' variant={'destructive'} onClick={HandleAddAmenities}>Add to the list</Button>
              <Button className='w-[49%]' onClick={HandleAmenitySubmisssion}>Create the Amenity</Button>
            </div>
          </div>
        )
      }


    </div>
  )
}

export default page