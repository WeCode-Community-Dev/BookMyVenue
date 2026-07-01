import { Cancel } from '@/components/cancel'
import { Review } from '@/components/review'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VenueLister } from '@/components/venueLister'
import { IconBriefcase2, IconBriefcaseFilled, IconBuilding, IconCalendar, IconCash, IconCheck, IconEmailStamp, IconHistory, IconLocation, IconMail, IconNetwork, IconPhone, IconSpeakerphone, IconStar, IconStarFilled, IconUsers, IconVolume } from '@tabler/icons-react'
import React from 'react'

function page() {
    return (
        <div className='w-full px-2 md:max-w-7xl mx-auto my-10 flex flex-col gap-5'>
            <div className='w-full h-64 flex items-end justify-center bg-secondary rounded-2xl border border-border relative'>
                <div className='w-48 h-48 rounded-full bg-border absolute -bottom-16 border border-border p-2'>
                    <div className='w-44 h-44 rounded-full bg-primary mx-auto border border-border'>


                    </div>
                </div>
            </div>
            <div className='w-full border border-border rounded-xl p-2 dark:bg-secondary/30'>
                <h1 className='font-heading text-2xl font-bold'>Robert Martin Agustine</h1>

                <div className='my-5 flex flex-col gap-2'>
                    <h5 className=' text-foreground flex items-center gap-2 text-lg font-sans'><IconMail /> <span className='font-medium'>Email:</span> john.doe@example.com</h5>
                    <h5 className='text-foreground flex items-center gap-2  text-lg'><IconBriefcase2 /> <span className='font-medium'>Profession:</span> Venue Manager , Al Saj Groups</h5>
                    <h5 className='text-foreground flex items-center gap-2  text-lg'><IconNetwork /> <span className='font-medium'>For Guests:</span> We will treat our guests as our owners</h5>
                </div>
            </div>
            <div className='w-full border border-border rounded-xl p-2 dark:bg-secondary/30'>
                <h1 className='font-heading text-xl font-bold flex items-center gap-2 capitalize'><IconSpeakerphone size={30} />A small Intro</h1>
                <p className='mt-3 font-sans'>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta eligendi architecto cum tempora magni, omnis accusantium possimus reprehenderit culpa voluptatum corporis voluptates, veniam consectetur ipsum, consequatur ab dolor laborum animi. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum libero ratione qui eveniet commodi magni exercitationem laborum! Iste fuga consequuntur ullam, corrupti totam quibusdam necessitatibus dolores ab nulla alias? Ducimus. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita commodi soluta, quam delectus libero aut maiores natus dolorem qui esse nesciunt mollitia, odit ad velit enim earum, recusandae perspiciatis ducimus.
                </p>
            </div>

            <div className='w-full '>
                <h1 className='font-heading text-xl font-bold flex items-center gap-2 capitalize'><IconBriefcaseFilled size={30} />BMV Report Case</h1>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                    <div className='border border-border rounded-xl p-4 bg-secondary/30'>
                        <div className='flex items-center gap-2 text-foreground mb-2'>
                            <IconBuilding />
                            <span className='font-medium'>Venues Listed</span>
                        </div>
                        <p className='text-4xl font-bold'>18</p>
                        <p className='text-sm text-muted-foreground mt-2'>Active listings currently managed by BMV.</p>
                    </div>
                    <div className='border border-border rounded-xl p-4 bg-secondary/30'>
                        <div className='flex items-center gap-2 text-foreground mb-2'>
                            <IconStarFilled className='text-primary text-xl' />
                            <span className='font-medium'>Overall Rating</span>
                        </div>
                        <p className='text-4xl font-bold'>4.8 / 5</p>
                        <p className='text-sm text-muted-foreground mt-2'>Average rating from guest reviews.</p>
                    </div>
                    <div className='border border-border rounded-xl p-4 bg-secondary/30'>
                        <div className='flex items-center gap-2 text-foreground mb-2'>
                            <IconHistory />
                            <span className='font-medium'>Years with BMV</span>
                        </div>
                        <p className='text-4xl font-bold'>7</p>
                        <p className='text-sm text-muted-foreground mt-2'>Years surviving and growing through BMV.</p>
                    </div>
                </div>
            </div>
            <div className=' px-2 '>
                <div className='flex items-center justify-between'>
                <h1 className='font-heading text-xl font-bold flex items-center gap-2 capitalize'><IconVolume  size={30} />Robert Martin Agustine's reviews</h1>
                <Badge>312 reviews</Badge>
                </div>
                <div className='my-4 flex gap-2 overflow-x-scroll no-scrollbar'>

                    <div className='flex-none flex flex-col w-full md:w-96 gap-2 border border-border rounded-3xl px-2 py-4 cursor-pointer dark:bg-secondary/30'>
                        <div className='flex items-center w-full gap-2 '>
                            <div className='w-8 h-8 bg-primary rounded-full'></div>
                            <div className='flex flex-col'>
                                <h3 className='font-heading md:text-lg'>Ziyaudheen MS</h3>
                            </div>
                            <Badge variant='outline' className='ml-auto border border-primary flex items-center gap-1'><IconStar stroke={2} className='' /><span className='mt-0.5'>3</span></Badge>
                        </div>
                        <p className='font-sans '>Really we had a great time with the venue , the service was good , we had a great time with the alsaj group's convetion center </p>

                    </div>
                    <div className='flex-none flex flex-col w-full md:w-96 gap-2 border border-border rounded-3xl px-2 py-4 cursor-pointer dark:bg-secondary/30'>
                        <div className='flex items-center w-full gap-2'>
                            <div className='w-8 h-8 bg-primary rounded-full'></div>
                            <div className='flex flex-col'>
                                <h3 className='font-heading md:text-lg'>Ziyaudheen MS</h3>
                            </div>
                            <Badge variant='outline' className='ml-auto border border-primary flex items-center gap-1'><IconStar stroke={2} className='' /><span className='mt-0.5'>3</span></Badge>
                        </div>
                        <p className='font-sans '>Really we had a great time with the venue , the service was good , we had a great time with the alsaj group's convetion center </p>

                    </div>
                    <div className='flex-none flex flex-col w-full md:w-96 gap-2 border border-border rounded-3xl px-2 py-4 cursor-pointer dark:bg-secondary/30'>
                        <div className='flex items-center w-full gap-2'>
                            <div className='w-8 h-8 bg-primary rounded-full'></div>
                            <div className='flex flex-col'>
                                <h3 className='font-heading md:text-lg'>Ziyaudheen MS</h3>
                            </div>
                            <Badge variant='outline' className='ml-auto border border-primary flex items-center gap-1'><IconStar stroke={2} className='' /><span className='mt-0.5'>3</span></Badge>
                        </div>
                        <p className='font-sans '>Really we had a great time with the venue , the service was good , we had a great time with the alsaj group's convetion center </p>

                    </div>
                </div>
                
            </div>
            <div className=' px-2 '>
                <div className='flex items-center justify-between'>
                <h1 className='font-heading text-xl font-bold flex items-center gap-2 capitalize'><IconBuilding  size={30} />Venues Listed</h1>
                <Badge>312 reviews</Badge>
                </div>
                <div className='my-4 flex gap-2 overflow-x-scroll no-scrollbar'>
                    <VenueLister list={[
            {
              id: 1,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 2,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 3,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 4,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            },
            {

              id: 5,
              image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
              name: "Design systems meetup",
              rating: 4.5,
              cats: ["Conference", "Meetup", "Workshop"]
            }

          ]} />
                </div>
                
            </div>
        </div>
    )
}

export default page