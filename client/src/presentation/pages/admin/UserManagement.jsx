import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "@/presentation/components/admin/common/PageHeader";
import UserFilters from "@/presentation/components/admin/userManagement/UserFilters";
import UserTable from "@/presentation/components/admin/userManagement/UserTable";

import Pagination from "@/presentation/components/common/Pagination"

import ViewUserModal from "@/presentation/components/modal/ViewUserModal";
import ConfirmationModal from "@/presentation/components/modal/ConfirmationModal";

import useDebounce from "@/hooks/useDebounce";

import {
    getUsers,
    updateUserStatus,
} from "@/redux/slices/AdminUserSlice";

const UserManagement = () => {

    const dispatch = useDispatch();

    const {
        users,
        loading,
        error,
        pagination,
    } = useSelector((state) => state.adminUser);

    // -----------------------
    // States
    // -----------------------

    const [search, setSearch] = useState("");

    const [isBlocked, setIsBlocked] = useState(undefined);

    const [page, setPage] = useState(1);

    const [activeTab, setActiveTab] = useState("all")

    const limit = 10;

    // -----------------------
    // Debounce
    // -----------------------

    const debouncedSearch = useDebounce(search, 500);

    // -----------------------
    // View Modal
    // -----------------------

    const [selectedUser, setSelectedUser] = useState(null);

    const [isViewModalOpen, setIsViewModalOpen] =
        useState(false);

    // -----------------------
    // Confirmation Modal
    // -----------------------

    const [
        isConfirmationOpen,
        setIsConfirmationOpen,
    ] = useState(false);

    // -----------------------
    // Fetch Users
    // -----------------------

    useEffect(() => {

        dispatch(

            getUsers({

                search: debouncedSearch,

                isBlocked,

                page,

                limit,

            })

        );

    }, [

        dispatch,

        debouncedSearch,

        isBlocked,

        page,

    ]);

    // -----------------------
    // Handlers
    // -----------------------

    const handleView = (user) => {

        setSelectedUser(user);

        setIsViewModalOpen(true);

    };

    const handleBlock = (user) => {

        setSelectedUser(user);

        setIsConfirmationOpen(true);

    };

    const handleConfirm = async () => {

        await dispatch(

            updateUserStatus({

                userId: selectedUser.id,

                isBlocked: !selectedUser.isBlocked,

            })

        );

        setIsConfirmationOpen(false);

        dispatch(

            getUsers({

                search: debouncedSearch,

                isBlocked,

                page,

                limit,

            })

        );

    };
console.log("curr click",activeTab)
    return (

        <div>

            <PageHeader

                title="User Management"

                subtitle="Manage platform users"

            />

           <UserFilters
    search={search}
    onSearchChange={(e) => setSearch(e.target.value)}

    status={activeTab}

    onStatusChange={(value) => {
        console.log("clicked",value)

        setPage(1);

        setActiveTab(value);

        if (value === "all") {

            setIsBlocked(undefined);

        } else if (value === "active") {

            setIsBlocked(false);

        } else {

            setIsBlocked(true);

        }

    }}
/>

            {

                loading ?

                    (

                        <div className="text-center py-10">

                            Loading...

                        </div>

                    )

                    :

                    error ?

                        (

                            <div className="text-center text-red-500 py-10">

                                {error}

                            </div>

                        )

                        :

                        (

                            <>

                                <UserTable

                                    users={users}

                                    onView={handleView}

                                    onBlock={handleBlock}

                                />

                                <div className="mt-6">

                                    <Pagination

                                        currentPage={page}

                                        totalPages={pagination.totalPages}

                                        onPageChange={setPage}

                                    />

                                </div>

                            </>

                        )

            }

            {/* View Modal */}

            <ViewUserModal

                isOpen={isViewModalOpen}

                onClose={() =>

                    setIsViewModalOpen(false)

                }

                user={selectedUser}

            />

            {/* Confirmation Modal */}

            <ConfirmationModal

                isOpen={isConfirmationOpen}

                onClose={() =>

                    setIsConfirmationOpen(false)

                }

                onConfirm={handleConfirm}

                title={

                    selectedUser?.isBlocked

                        ? "Unblock User"

                        : "Block User"

                }

                message={

                    selectedUser?.isBlocked

                        ? "Are you sure you want to unblock this user?"

                        : "Are you sure you want to block this user?"

                }

                confirmText={

                    selectedUser?.isBlocked

                        ? "Unblock"

                        : "Block"

                }

                confirmVariant={

                    selectedUser?.isBlocked

                        ? "secondary"

                        : "destructive"

                }

            />

        </div>

    );

};

export default UserManagement;