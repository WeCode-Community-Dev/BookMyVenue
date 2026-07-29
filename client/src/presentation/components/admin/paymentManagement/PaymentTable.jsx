import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import PaymentTableRow from "./PaymentTableRow";

const PaymentTable = ({
    payments,
    onView,
}) => {

    return (

        <div className="rounded-lg border bg-white">

            <Table>

                <TableHeader>

                    <TableRow>

                        <TableHead>Payment ID</TableHead>

                        <TableHead>Booking ID</TableHead>

                        <TableHead>User</TableHead>

                        <TableHead>Vendor</TableHead>

                        <TableHead>Amount</TableHead>

                        <TableHead>Payment Type</TableHead>

                        <TableHead>Payment Status</TableHead>

                        <TableHead>Date</TableHead>

                        <TableHead className="text-center">
                            Actions
                        </TableHead>

                    </TableRow>

                </TableHeader>

                <TableBody>

                    {payments?.length > 0 ? (

                        payments.map((payment) => (

                            <PaymentTableRow
                                key={payment._id}
                                payment={payment}
                                onView={onView}
                            />

                        ))

                    ) : (

                        <TableRow>

                            <td
                                colSpan={9}
                                className="py-10 text-center text-gray-500"
                            >

                                No payments found

                            </td>

                        </TableRow>

                    )}

                </TableBody>

            </Table>

        </div>

    );

};

export default PaymentTable;