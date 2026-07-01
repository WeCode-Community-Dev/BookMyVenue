'use client'
import { IconClock, IconDownload, IconLocation, IconTicket } from '@tabler/icons-react'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'


function PaymentPDF() {
    const downloadInvoice = async () => {
        console.log("inside..........")

        // Dynamically load html2pdf inside the client
        const html2pdf = (await import('html2pdf.js')).default;

        const element = document.getElementById('invoiceDocument');

        const options = {
            margin: 0,
            padding: 0,
            filename: 'confirmation-ticket.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                onclone: (clonedDoc: Document) => {
                    // 1. Create a style block to override modern color variables
                    const style = clonedDoc.createElement('style');
                    style.innerHTML = `
        :root {
          /* Force standard RGB/Hex fallbacks for any lab() variables */
          --color-background: #ffffff !important;
          --color-foreground: #000000 !important;
        }
        body {
          background-color: #ffffff !important;
          background-image: none !important;
        }
      `;
                    clonedDoc.head.appendChild(style);

                    // 2. Clear any background images that might be using modern functions
                    const allElements = clonedDoc.querySelectorAll('*');
                    allElements.forEach((el) => {
                        const style = (el as HTMLElement).style;
                        if (style.backgroundImage && style.backgroundImage.includes('lab(')) {
                            style.backgroundImage = 'none';
                        }
                    });
                }
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        } as const; // 1. Freezes strings to exact literals

        // 2. Ensures the element is safely caught before executing
        if (element) {
            html2pdf().set(options).from(element).save();
        }


    }

    return (
        <div>
            <div className='relative border border-[#eaeeeb] rounded-lg p-5 my-4 items-center justify-center hidden md:flex md:w-[210mm] h-[280mm] mx-auto text-[#000] bg-[#fff]' id='invoiceDocument'>

                <Image src='/logo.png' alt='BookMyVenue Logo' width={100} height={50} className='w-96 brightness-50 opacity-50' />
                <div className='absolute top-0 right-0 bottom-0 left-0 p-5 '>
                    <h1 className='text-center font-heading font-bold text-3xl border-b-2 border-[#b93a2b] pb-3 mb-8'>BookMyVenue Confirmation Ticket</h1>
                    {/* <Image src='https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png' alt='Confirmation' width={200} height={200} className='w-[50%] mx-auto h-40 my-5 object-cover rounded-lg grayscale brightness-75' /> */}
                    <div className='w-full flex flex-col items-center gap-3 justify-center'>
                        <div>
                            <div className='flex items-center gap-2'>
                                <IconLocation stroke={2} className='text-[#b93a2b]' /> <span className='font-sans text-lg font-medium'>New Rise Convention Center</span>
                            </div>

                        </div>

                    </div>
                    <div className='w-full flex justify-center'>
                        <span className='font-sans text-lg font-medium flex items-center gap-2 text-center '>Rising Town , New Rise , USA</span>
                    </div>
                    <div className='w-full flex justify-center'>
                        <span className='font-sans text-lg font-medium flex items-center gap-2 text-center '><IconClock /> 10:00 AM - 2:00 PM</span>
                    </div>
                    <div className='w-full my-10 grid grid-cols-3 gap-2'>
                        <div>
                            <h3 className='text-xl font-sans font-bold border-b-2 border-border py-3'>
                                Booking ID : <span className='font-sans font-medium'>#689Y890P</span>
                            </h3>
                        </div>
                        <div>
                            <h3 className='text-xl font-sans font-bold border-b-2 border-border py-3'>
                                Guest Name : <span className='font-sans font-medium'>John Doe</span>
                            </h3>
                        </div>
                        <div>
                            <h3 className='text-xl font-sans font-bold border-b-2 border-border py-3'>
                                Venue Type : <span className='font-sans font-medium'>Birthday</span>
                            </h3>
                        </div>
                        <div>
                            <h3 className='text-xl font-sans font-bold border-b-2 border-border py-3'>
                                Booking Date : <span className='font-sans font-medium'>2023-10-15</span>
                            </h3>
                        </div>
                        <div>
                            <h3 className='text-xl font-sans font-bold border-b-2 border-border py-3'>
                                Booking Date : <span className='font-sans font-medium'>2023-10-15</span>
                            </h3>
                        </div>
                    </div>
                    <div className='w-full flex justify-center'>
                        <span className='font-heading text-2xl font-medium flex items-center gap-2 text-center '>Pricing & Payment</span>
                    </div>
                    <div className='w-full  grid grid-cols-3 gap-2'>
                        <div>
                            <h3 className='text-xl font-sans font-bold border-b-2 border-border py-3'>
                                Rent : <span className='font-sans font-medium'>4000</span>
                            </h3>
                        </div>
                        <div>
                            <h3 className='text-xl font-sans font-bold border-b-2 border-border py-3'>
                                Platform Charge : <span className='font-sans font-medium'>50</span>
                            </h3>
                        </div>
                        <div>
                            <h3 className='text-xl font-sans font-bold border-b-2 border-border py-3'>
                                GST : <span className='font-sans font-medium'>38</span>
                            </h3>
                        </div>
                        <div>
                            <h3 className='text-xl font-sans font-bold border-b-2 border-border py-3'>
                                Total Rent : <span className='font-sans font-medium'>8000</span>
                            </h3>
                        </div>
                        <div>
                            <h3 className='text-xl font-sans font-bold border-b-2 border-border py-3'>
                                Total Price : <span className='font-sans font-medium'>84567</span>
                            </h3>
                        </div>
                    </div>
                    <div className='w-full flex justify-center my-10'>
                        <Button className='h-14 w-56 bg-[#22c55e]'><IconTicket stroke={2} size={30} />Payment Confirmed</Button>
                    </div>
                    <h3 className='font-heading font-bold'>Policies and Conditions</h3>
                    <div className='flex flex-col gap-3'>
                        <div className='w-full flex justify-center'>
                            <span className='font-sans '>
                                This is to confirm that John Deo has successfully completed the payment and we have approved that the venue will be granted to them under the specified time of 10:00AM to 5:00PM and beliving that they will not destroy or damage any of the public property of our venue.
                            </span>
                        </div>
                        <div className='w-full flex justify-center mb-10'>
                            <span className='font-sans '>
                                By this payment, the guest has got the approval to use our property for the given time and its there responsibility to maintain the public properties of the venue from being destroyed and damaged , if so compensation will be availed from the respected guest.
                            </span>
                        </div>
                    </div>
                    <div className='w-full flex items-center justify-between'>
                        <div>
                            <h5 className='font-heading font-bold text-lg'>Ziyaudheen MS</h5>
                            <p>Event Manager, New Rise Group</p>
                        </div>
                        <div>
                            <h5 className='font-heading font-bold text-lg'>Robert Leo</h5>
                            <p>Vp of Finance, BMV</p>
                        </div>
                    </div>


                </div>
                <div className='absolute bottom-2'>
                    <span className='text-center'>BookMyVenue . Your Premium Booking Platform . Book It, Enjoy It and Feel It</span>
                </div>
            </div>
            <div className='w-full flex justify-center my-10'>
                <Button className='h-14 w-64' onClick={() => {
                    downloadInvoice()
                }}><IconDownload stroke={2} size={30} />Download Ticket</Button>
            </div>
        </div>
    )
}

export { PaymentPDF } 