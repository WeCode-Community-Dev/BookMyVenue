
import { Box, Avatar } from "@mui/material";

import { AdminApiService } from "src/api/admin";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";
import { DataTable } from "src/components/data-table";


export function ListUsers() {


    return (
        <DataTable
            dataKey='users-for-admin-list'
            fetchData={AdminApiService.listUsers}
            title='All Users'
            searchPlaceHolder="Search User..."
            addBtn={{
                title: "Add User",
                url: '/admin/users/create'
            }}
            headings={[
                {
                    id: 'name',
                    label: 'Name',
                    component(data) {
                        return (
                            <Box
                                sx={{
                                    gap: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Avatar src={data.avatarUrl} />
                                {data.firstName} {data.lastName}          </Box>

                        )
                    },
                },
                {
                    id: 'role',
                    label: 'Role',
                },
                {
                    id: 'verified',
                    label: 'Verified',
                    component(data) {
                        return <>
                            {data.status === 'ACTIVE' ? (
                                <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
                            ) : (
                                '-'
                            )}
                        </>
                    },
                },
                {
                    id: 'status',
                    label: 'Status',
                    component(data) {
                        return (
                            <Label color={(data.status === 'banned' && 'error') || 'success'}>{data.status}</Label>
                        )
                    },
                },
            ]}
        />
    )
}