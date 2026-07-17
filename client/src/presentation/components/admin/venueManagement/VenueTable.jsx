import VenueTableRow from "./VenueTableRow";

import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
} from "@/components/ui/table";

const VenueTable = ({
    venues,
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

                        <TableHead>Venue ID</TableHead>
                        <TableHead>Venue Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Price/Day</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">
                            Actions
                        </TableHead>

                    </TableRow>

                </TableHeader>

                <TableBody>

                    {

                        venues.length > 0 ? (

                            venues.map((venue) => (

                                <VenueTableRow

                                    key={venue._id}

                                    venue={venue}

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
                                    No venues found.
                                </td>

                            </TableRow>

                        )

                    }

                </TableBody>

            </Table>

        </div>

    );

};

export default VenueTable;