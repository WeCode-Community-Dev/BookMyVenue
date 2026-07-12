
import Modal from "./Modal";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const ViewUserModal = ({
    isOpen,
    onClose,
    user,
}) => {

    if (!user) return null;

    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="User Details"
            width="max-w-lg"
        >

            <div className="space-y-4">

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <p className="text-sm text-gray-500">
                            User ID
                        </p>

                        <p className="font-medium">
                            {user.id}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Full Name
                        </p>

                        <p className="font-medium">
                            {user.fullName}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Email
                        </p>

                        <p className="font-medium">
                            {user.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Phone
                        </p>

                        <p className="font-medium">
                            {user.phone}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Status
                        </p>

                        <Badge
                            variant={
                                user.isBlocked
                                    ? "destructive"
                                    : "default"
                            }
                        >
                            {user.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Joined On
                        </p>

                        <p className="font-medium">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                </div>

                <div className="flex justify-end pt-4">

                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Close
                    </Button>

                </div>

            </div>

        </Modal>

    );

};

export default ViewUserModal;