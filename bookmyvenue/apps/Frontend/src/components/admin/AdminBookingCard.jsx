import React from 'react';
import { Link } from '@tanstack/react-router';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  DollarSign,
  MessageSquare,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  approved: {
    label: 'Approved',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const AdminBookingCard = ({
  booking,
  onApprove,
  onReject,
  onCancel,
  onViewDetails,
  showActions = true,
}) => {
  const status = statusConfig[booking?.status] || statusConfig.pending;

  const handleApprove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onApprove?.(booking);
  };

  const handleReject = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onReject?.(booking);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel?.(booking);
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onViewDetails?.(booking);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {booking?.venue?.name || 'Unknown Venue'}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Booking #{booking?.id?.slice(-8) || 'N/A'}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.className}`}
            >
              {status.label}
            </span>
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/admin/bookings/$bookingId"
                      params={{ bookingId: booking?.id }}
                      onClick={handleViewDetails}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View details
                    </Link>
                  </DropdownMenuItem>
                  {booking?.status === 'pending' && (
                    <>
                      <DropdownMenuItem onClick={handleApprove}>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleReject}>
                        <XCircle className="h-4 w-4 mr-2 text-red-600" />
                        Reject
                      </DropdownMenuItem>
                    </>
                  )}
                  {(booking?.status === 'approved' ||
                    booking?.status === 'confirmed') && (
                    <DropdownMenuItem onClick={handleCancel}>
                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                      Cancel booking
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Customer</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {booking?.customer?.name || 'N/A'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {booking?.customer?.email || ''}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Venue Owner</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {booking?.venue?.owner?.name || 'N/A'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {booking?.venue?.owner?.email || ''}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(booking?.date)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Time</p>
              <p className="text-sm font-medium text-gray-900">
                {formatTime(booking?.startTime)} - {formatTime(booking?.endTime)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <DollarSign className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(booking?.totalAmount)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Booked On</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(booking?.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        {booking?.message && (
          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
            <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Customer Message</p>
              <p className="text-sm text-gray-700 line-clamp-2">
                {booking.message}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {showActions && booking?.status === 'pending' && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-3">
          <Button
            variant="default"
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleApprove}
          >
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
            onClick={handleReject}
          >
            <XCircle className="h-4 w-4 mr-1.5" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminBookingCard;
