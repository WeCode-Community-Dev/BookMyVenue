"use client"
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import Image from "next/image"

function CalenderView() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return (
        <div className="w-full px-2 md:px-5 md:max-w-7xl mx-auto flex items-center gap-10 my-10 flex-col md:flex-row">
            <div className="md:w-[45%] lg:w-[35%] w-full">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border w-full"
                captionLayout="dropdown"
            />
            </div>
            <div className="flex flex-col gap-3 justify-between md:w-[55%] lg:w-[65%] w-full">
                <Image src="https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png" alt="Venue" width={200} height={200} className='w-full hidden md:block h-48 md:h-64 lg:h-96 rounded-lg'/>
                <div className=" flex flex-row gap-5">
                    <Field className="flex flex-col">
                        <FieldLabel htmlFor="time-picker-optional" className="font-sans text-md">Starting Time</FieldLabel>
                        <Input
                            type="time"
                            id="time-picker-optional"
                            step="1"
                            defaultValue="10:30:00"
                            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                    </Field>
                    <Field className="flex flex-col">
                        <FieldLabel htmlFor="time-picker-optional" className="font-sans text-md">Ending Time</FieldLabel>
                        <Input
                            type="time"
                            id="time-picker-optional"
                            step="1"
                            defaultValue="10:30:00"
                            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                    </Field>  
                    <Field className="   hidden md:flex ">
                        <FieldLabel htmlFor="time-picker-optional" className="font-sans text-md text-background">Ending Time</FieldLabel>
                        <Button>Check Availability</Button>
                    </Field>
                </div>
               <Button className="w-full md:hidden h-12">Check Availability</Button>
            </div>
        </div>

    )
}

export { CalenderView }