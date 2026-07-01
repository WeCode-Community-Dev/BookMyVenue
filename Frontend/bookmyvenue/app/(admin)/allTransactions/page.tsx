import { Badge } from '@/components/ui/badge'
import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IconBuilding, IconCashBanknoteHeart, IconCashBanknoteMinus, IconCategoryMinus, IconTicket, IconUser } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'

const invoices = [
    {
        invoice: "INV001",
        guest: "john Deo",
        owner: "ziyau",
        type: "Refund",
        totalAmount: "$250.00",
        refundAmount: "$34.00",
        commision: "$5.00",
        paymentMethod: "Dodo Payments",
        confrormTicket: "kjgg",
    },
    {
        invoice: "INV002",
        guest: "john Deo",
        owner: "ziyau",
        type: "Refund",
        totalAmount: "$250.00",
        refundAmount: "$34.00",
        commision: "$5.00",
        paymentMethod: "Dodo Payments",
        confrormTicket: "kjgg",
    },
    {
        invoice: "INV003",
        guest: "john Deo",
        owner: "ziyau",
        type: "Refund",
        totalAmount: "$250.00",
        refundAmount: "-",
        commision: "$5.00",
        paymentMethod: "Dodo Payments",
        confrormTicket: "kjgg",
    },
    {
        invoice: "INV004",
        guest: "john Deo",
        owner: "ziyau",
        type: "Refund",
        totalAmount: "$250.00",
        refundAmount: "$34.00",
        commision: "$5.00",
        paymentMethod: "Dodo Payments",
        confrormTicket: "kjgg",
    },
    {
        invoice: "INV005",
        guest: "john Deo",
        owner: "ziyau",
        type: "Refund",
        totalAmount: "$250.00",
        refundAmount: "$34.00",
        commision: "$5.00",
        paymentMethod: "Dodo Payments",
        confrormTicket: "kjgg",
    },
    {
        invoice: "INV006",
        guest: "john Deo",
        owner: "ziyau",
        type: "Refund",
        totalAmount: "$250.00",
        refundAmount: "$34.00",
        commision: "-",
        paymentMethod: "Dodo Payments",
        confrormTicket: "kjgg",
    },
    {
        invoice: "INV007",
        guest: "john Deo",
        owner: "ziyau",
        type: "Refund",
        totalAmount: "$250.00",
        refundAmount: "-",
        commision: "$5.00",
        paymentMethod: "Dodo Payments",
        confrormTicket: "kjgg",
    },
]


function page() {
    return (
        <div className='w-full md:max-w-7xl mx-auto px-2'>
            <div className='flex items-center justify-between  border-b border-destructive py-5'>
                <div>
                    <h3 className='font-heading font-bold capitalize text-xl'>Transactions Through BMV</h3>
                    <p className='font-sans text-muted-foreground'>Track the transactions and revenue generations</p>
                </div>
                <Badge variant='destructive'>1202 transactions</Badge>
            </div>
            <div className='my-5'>
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>
                                <div className='flex items-center gap-1'>
                                    <IconUser />Guest
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className='flex items-center gap-1'>
                                    <IconBuilding />Owner
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className='flex items-center gap-1'>
                                    <IconCategoryMinus />Type
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className='flex items-center gap-1'>
                                    <IconCashBanknoteHeart />Amount Paid
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className='flex items-center gap-1'>
                                    <IconCashBanknoteMinus />

                                    Refund Amount
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className='flex items-center gap-1'>
                                    <IconTicket />

                                    Confirmation
                                </div>
                            </TableHead>
                            <TableHead className="text-right bg-destructive/50 text-primary">Commision</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.invoice}>
                                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                <TableCell>{invoice.guest}</TableCell>
                                <TableCell>{invoice.owner}</TableCell>
                                <TableCell>{invoice.type}</TableCell>
                                <TableCell>{invoice.totalAmount}</TableCell>
                                <TableCell>{invoice.refundAmount}</TableCell>
                                <TableCell>
                                    <Alert variant='destructive'><IconTicket />Confirmation Ticket</Alert>
                                </TableCell>
                                <TableCell className="text-right  text-primary font-bold text-lg">{invoice.commision}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </div>
        </div>
    )
}

export default page