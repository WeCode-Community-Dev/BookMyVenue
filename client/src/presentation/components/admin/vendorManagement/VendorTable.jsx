import VendorTableRow from "./VendorTableRow";

import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
} from "@/components/ui/table";

const VendorTable = ({
    vendors,
    onView,
    onApprove,
    onReject,
    onBlock,
    onUnblock,
}) => {

    return (

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

            <Table>

                <TableHeader>

                    <TableRow>

                        <TableHead>Vendor ID</TableHead>

                        <TableHead>Company</TableHead>

                        <TableHead>Owner</TableHead>

                        <TableHead>Email</TableHead>

                        <TableHead>Phone</TableHead>

                        <TableHead>Status</TableHead>

                        <TableHead className="text-center">

                            Actions

                        </TableHead>

                    </TableRow>

                </TableHeader>

                <TableBody>

                    {

                        vendors.length > 0 ? (

                            vendors.map((vendor) => (

                                <VendorTableRow

                                    key={vendor._id}

                                    vendor={vendor}

                                    onView={onView}

                                    onApprove={onApprove}

                                    onReject={onReject}

                                    onBlock={onBlock}

                                    onUnblock={onUnblock}

                                />

                            ))

                        ) : (

                            <TableRow>

                                <td
                                    colSpan={7}
                                    className="py-10 text-center text-gray-500"
                                >
                                    No vendors found.
                                </td>

                            </TableRow>

                        )

                    }

                </TableBody>

            </Table>

        </div>

    );

};

export default VendorTable;