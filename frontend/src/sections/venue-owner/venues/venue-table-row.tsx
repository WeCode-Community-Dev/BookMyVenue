import { useState, useCallback } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { AdminApiService } from 'src/api/admin';
import { VenueStatus } from 'src/api/types/venue.type';

import { Label } from 'src/components/label';

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
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell>{row.title}</TableCell>
        <TableCell>{row.venueType}</TableCell>
        <TableCell>{row.addressLine1}</TableCell>
        <TableCell>
          <Label color={(status === VenueStatus.APPROVED && 'success') || 'error'}>{status}</Label>
        </TableCell>
      </TableRow>
  );
}
