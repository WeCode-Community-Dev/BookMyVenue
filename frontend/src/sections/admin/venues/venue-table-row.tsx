import { useState, useCallback } from 'react';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Popover, MenuItem, MenuList, IconButton, menuItemClasses } from '@mui/material';

import { AdminApiService } from 'src/api/admin';
import { VenueStatus } from 'src/api/types/venue.type';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type VenueTableRowProps = {
  row: any;
  selected: boolean;
  onSelectRow: () => void;
};

export function VenueTableRow({ row, selected, onSelectRow }: VenueTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [status, setStatus] = useState(row.status)

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleApprove = useCallback(() => {
    handleClosePopover()
    setStatus(VenueStatus.APPROVED)
    AdminApiService.approveVenue(row.id)
  }, []);

  const handleReject = useCallback(() => {
    handleClosePopover()
    setStatus(VenueStatus.REJECTED)
    AdminApiService.rejectVenue(row.id)
  }, []);


  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        {/* <TableCell component="th" scope="row">
          <Box
            sx={{
              gap: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar alt={row.name} src={row.avatarUrl} />
            {row.name}
          </Box>
        </TableCell> */}
        <TableCell>{row.title}</TableCell>
        <TableCell>{row.venueType}</TableCell>
        <TableCell>{row.addressLine1}</TableCell>
        <TableCell>
          <Label color={(status === VenueStatus.APPROVED && 'success') || 'error'}>{status}</Label>
        </TableCell>
        <TableCell align="right">
          {
            status === VenueStatus.PENDING &&
            <IconButton onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          }
        </TableCell>
      </TableRow>
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleApprove} sx={{ color: 'success.dark' }}>
            <Iconify icon="typcn:tick" />
            Approve
          </MenuItem>

          <MenuItem onClick={handleReject} sx={{ color: 'error.main' }}>
            <Iconify icon="iconamoon:close-bold" />
            Reject
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
