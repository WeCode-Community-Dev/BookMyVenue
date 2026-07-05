import UserTableRow from "./UserTableRow";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const UserTable = ({
  users,
  onView,
  onBlock,
}) => {

  return (

    <Table>

      <TableHeader>

        <TableRow>

          <TableHead>User ID</TableHead>

          <TableHead>Name</TableHead>

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

          users.length > 0 ? (

            users.map((user) => (

              <UserTableRow

                key={user._id}

                user={user}

                onView={onView}

                onBlock={onBlock}

              />

            ))

          ) : (

            <TableRow>

              <td

                colSpan={6}

                className="text-center py-8 text-gray-500"

              >

                No users found

              </td>

            </TableRow>

          )

        }

      </TableBody>

    </Table>

  );

};

export default UserTable;