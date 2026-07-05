import { Eye, Ban, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
    TableCell,
    TableRow,
} from "@/components/ui/table"

const UserTableRow = ({
    user,
    onView,
    onBlock,
}) => {
    console.log(user)

    const isBlocked = user.isBlocked;


    return (

        <TableRow>

            <TableCell>

                {user.id.slice(0,8)}

            </TableCell>

            <TableCell>

                {user.fullName}

            </TableCell>

            <TableCell>

                {user.email}

            </TableCell>

            <TableCell>

                {user.phone}

            </TableCell>

            <TableCell>

                <Badge
                    variant={isBlocked ? "destructive" : "outline"}
                    className={
                        isBlocked
                            ? ""
                            : "bg-green-100 text-green-700 border-green-300 hover:bg-green-100"
                    }
                >
                    {isBlocked ? "Blocked" : "Active"}
                </Badge>

            </TableCell>

            <TableCell>

                <div className="flex justify-center gap-2">

                    <Button

                        variant="outline"

                        size="sm"

                        onClick={() => onView(user)}

                    >

                        <Eye className="w-4 h-4 mr-1" />

                        View

                    </Button>

                    <Button
                        variant={isBlocked ? "outline" : "destructive"}
                        className={
                            isBlocked
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : ""
                        }

                        size="sm"

                        onClick={() => onBlock(user)}

                    >

                        {

                            isBlocked ? (

                                <>

                                    <CheckCircle className="w-4 h-4 mr-1" />

                                    Unblock

                                </>

                            ) : (

                                <>

                                    <Ban className="w-4 h-4 mr-1" />

                                    Block

                                </>

                            )

                        }

                    </Button>

                </div>

            </TableCell>

        </TableRow>

    );

};

export default UserTableRow;