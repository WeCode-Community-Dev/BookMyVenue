import type { Pagination } from 'src/api/types/common';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { TableRow, TableCell, TableHead, type TableCellProps } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';

import { TableToolbar } from './table-toolbar';
import { BlueButton } from '../buttons/blue-button';


// ----------------------------------------------------------------------
export type DataTableProps = {
    title: string
    addBtn?: {
        title: string
        url: string
    }
    headings: {
        id: string
        label?: string
        component?: (data: any) => React.JSX.Element
        align?: TableCellProps['align']
    }[]
    dataKey: string
    fetchData: (query: { search?: string, page: number, limit: number }) => Promise<Pagination<any>>
    searchPlaceHolder?: string
}

export function DataTable({
    title,
    addBtn,
    headings,
    dataKey,
    searchPlaceHolder,
    fetchData
}: DataTableProps) {

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(10)
    const { data } = useQuery({
        queryKey: [dataKey, page, search, limit],
        queryFn: () => fetchData({ search, page, limit })
    })


    return (
        <DashboardContent>
            <Box
                sx={{
                    mb: 5,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                {
                    addBtn &&
                    <BlueButton href={addBtn.url} label={addBtn.title} />
                }
            </Box>

            <Card>
                <TableToolbar
                    searchValue={search}
                    onSearch={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setSearch(event.target.value);
                    }}
                    searchPlaceHolder={searchPlaceHolder}
                />
                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    {headings.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            align={headCell.align || 'left'}
                                        >
                                            {headCell.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(data?.data || []).map((row: any) => (
                                    <TableRow key={row.id}>
                                        {
                                            headings.map(head => (
                                                <TableCell>
                                                    {head.component ? head.component(row) : row[head.id] || ''}
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
                <TablePagination
                    component="div"
                    page={page}
                    count={data?.data.length || 0}
                    rowsPerPage={limit}
                    onPageChange={(_, p) => setPage(p)}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={(e) => setLimit(parseInt(e.target.value || '10'))}
                />
            </Card>
        </DashboardContent>
    );
}
