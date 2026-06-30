'use client'
import Image from 'next/image'
import { IconSearch, IconLocationCheck, IconBuilding } from '@tabler/icons-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useState } from 'react';
import { LocationFinder } from '../locationFinder';
import { VenueSearch } from '../venueSearch';
import { Button } from './button';
import { Show, SignInButton, SignUpButton, UserButton  } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
interface Props {
  type: string
}


function Navbar({ type }: Props) {
  const router  = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className='sticky top-0 z-50 flex items-center justify-between px-3 md:px-5 sm:px-3 py-2 max-w-7xl border border-border mx-auto w-full rounded-full md:rounded-full shadow-xl mb-5 bg-background mt-7 dark:bg-secondary/30'>
      <div className="flex items-center gap-1 sm:gap-2 flex-1 sm:w-[60%]">
        <Image src="/logo.png" alt="BookMyVenue Logo" width={40} height={40} className='mb-2 sm:w-[50px] sm:h-[50px]' />
        <Image src="/brand2.png" alt="BookMyVenue Logo" width={200} height={200} className='mb-2 hidden md:inline' />
        {/* <h6 className='hidden md:inline text-lg lg:text-xl font-semibold tracking-wide text-primary uppercase leading-none font-heading'>BookMyVenue</h6> */}
        <VenueSearch />
      </div>
      <div className='flex items-center  gap-2'>
        {
          type === 'user' ? (
            <LocationFinder />

          ) : (

            <Button variant='outline' size='sm' className='hidden md:inline-flex cursor-pointer'><IconBuilding /> List New Venue</Button>

          )
        }
        <div>
          <Show when="signed-out" >
                <Button variant={'destructive'} className='mx-2'>Sign In</Button>

                <Button className='mx-2' onClick={() => {
                  router.push('/sign-in')
                }}>Sign Up</Button>
            
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
        </div>
      </div>
    </div>
  )
}

export { Navbar }