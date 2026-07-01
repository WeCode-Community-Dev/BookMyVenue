'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconUserCancel, IconUserDown, IconUsers, IconSearch, IconUser, IconBuilding, IconTicket } from '@tabler/icons-react'
import React, { useState } from 'react'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
function page() {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div className='w-full md:max-w-7xl mx-auto p-2 my-5'>
            <div className='mb-6 w-[60%] mx-auto h-32 flex items-center justify-center'>
                <div className='flex flex-col gap-3 w-full'>
                <InputGroup>
                    <InputGroupInput placeholder="Search..." className='h-45'/>
                    <InputGroupAddon>
                        <IconUser />
                    </InputGroupAddon>
                </InputGroup>
                </div>
            </div>
            <div>
                <div className='flex items-center justify-between'>
                    <h3 className='flex items-center gap-2 font-medium text-xl'><IconUsers />All The Users Signed Through BMV</h3>
                    <Badge>144 users</Badge>
                </div>
                <div className='flex items-center justify-between my-5'>
                    <div className='flex gap-2  '>
                        <Badge variant='outline' className='cursor-pointer'><IconUser />All</Badge>
                        <Badge variant='outline' className='cursor-pointer'><IconUsers />Users</Badge>
                        <Badge variant='outline' className='cursor-pointer'><IconBuilding />Owners</Badge>
                    </div>
                    
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-5'>
                    <div className='px-2 py-3 rounded-xl border border-border dark:bg-secondary/30 flex flex-col gap-4'>
                        <div className='w-20 h-20 rounded-full bg-primary mx-auto'>

                        </div>
                        <div className='text-center'>
                            <h3 className='font-heading'>Ziyaudheen MS</h3>
                            <h6 className='font-sans'>BMV Guest</h6>
                            <p className='italic font-sans text-muted-foreground'>since <span className='text-primary font-bold'>3 years</span></p>
                        </div>
                        <div className='flex items-center gap-2 mx-auto'>
                            <Button ><IconUserCancel /> Suspend User</Button>
                            <Button><IconUserDown /> Delete User</Button>
                        </div>
                    </div>
                    <div className='px-2 py-3 rounded-xl border border-border dark:bg-secondary/30 flex flex-col gap-4'>
                        <div className='w-20 h-20 rounded-full bg-primary mx-auto'>

                        </div>
                        <div className='text-center'>
                            <h3 className='font-heading'>Ziyaudheen MS</h3>
                            <h6 className='font-sans'>BMV Guest</h6>
                            <p className='italic font-sans text-muted-foreground'>since <span className='text-primary font-bold'>3 years</span></p>
                        </div>
                        <div className='flex items-center gap-2 mx-auto'>
                            <Button ><IconUserCancel /> Suspend User</Button>
                            <Button><IconUserDown /> Delete User</Button>
                        </div>
                    </div>
                    <div className='px-2 py-3 rounded-xl border border-border dark:bg-secondary/30 flex flex-col gap-4'>
                        <div className='w-20 h-20 rounded-full bg-primary mx-auto'>

                        </div>
                        <div className='text-center'>
                            <h3 className='font-heading'>Ziyaudheen MS</h3>
                            <h6 className='font-sans'>BMV Guest</h6>
                            <p className='italic font-sans text-muted-foreground'>since <span className='text-primary font-bold'>3 years</span></p>
                        </div>
                        <div className='flex items-center gap-2 mx-auto'>
                            <Button ><IconUserCancel /> Suspend User</Button>
                            <Button><IconUserDown /> Delete User</Button>
                        </div>
                    </div>
                    <div className='px-2 py-3 rounded-xl border border-border dark:bg-secondary/30 flex flex-col gap-4'>
                        <div className='w-20 h-20 rounded-full bg-primary mx-auto'>

                        </div>
                        <div className='text-center'>
                            <h3 className='font-heading'>Ziyaudheen MS</h3>
                            <h6 className='font-sans'>BMV Guest</h6>
                            <p className='italic font-sans text-muted-foreground'>since <span className='text-primary font-bold'>3 years</span></p>
                        </div>
                        <div className='flex items-center gap-2 mx-auto'>
                            <Button ><IconUserCancel /> Suspend User</Button>
                            <Button><IconUserDown /> Delete User</Button>
                        </div>
                    </div>
                    <div className='px-2 py-3 rounded-xl border border-border dark:bg-secondary/30 flex flex-col gap-4'>
                        <div className='w-20 h-20 rounded-full bg-primary mx-auto'>

                        </div>
                        <div className='text-center'>
                            <h3 className='font-heading'>Ziyaudheen MS</h3>
                            <h6 className='font-sans'>BMV Guest</h6>
                            <p className='italic font-sans text-muted-foreground'>since <span className='text-primary font-bold'>3 years</span></p>
                        </div>
                        <div className='flex items-center gap-2 mx-auto'>
                            <Button ><IconUserCancel /> Suspend User</Button>
                            <Button><IconUserDown /> Delete User</Button>
                        </div>
                    </div>
                    <div className='px-2 py-3 rounded-xl border border-border dark:bg-secondary/30 flex flex-col gap-4'>
                        <div className='w-20 h-20 rounded-full bg-primary mx-auto'>

                        </div>
                        <div className='text-center'>
                            <h3 className='font-heading'>Ziyaudheen MS</h3>
                            <h6 className='font-sans'>BMV Guest</h6>
                            <p className='italic font-sans text-muted-foreground'>since <span className='text-primary font-bold'>3 years</span></p>
                        </div>
                        <div className='flex items-center gap-2 mx-auto'>
                            <Button ><IconUserCancel /> Suspend User</Button>
                            <Button><IconUserDown /> Delete User</Button>
                        </div>
                    </div>
                    <div className='px-2 py-3 rounded-xl border border-border dark:bg-secondary/30 flex flex-col gap-4'>
                        <div className='w-20 h-20 rounded-full bg-primary mx-auto'>

                        </div>
                        <div className='text-center'>
                            <h3 className='font-heading'>Ziyaudheen MS</h3>
                            <h6 className='font-sans'>BMV Guest</h6>
                            <p className='italic font-sans text-muted-foreground'>since <span className='text-primary font-bold'>3 years</span></p>
                        </div>
                        <div className='flex items-center gap-2 mx-auto'>
                            <Button ><IconUserCancel /> Suspend User</Button>
                            <Button className='bg-destructive'><IconUserDown /> Delete User</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page