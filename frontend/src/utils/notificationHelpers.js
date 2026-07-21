const formatBookingDates = (startDate, endDate) => {
  const opts = { year: 'numeric', month: 'short', day: 'numeric' };
  const start = new Date(startDate).toLocaleDateString('en-IN', opts);
  if (!endDate || startDate === endDate) return start;
  const end = new Date(endDate).toLocaleDateString('en-IN', opts);
  return `${start} – ${end}`;
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

export const getNotificationContent = (notification) => {
  const { type, payload = {} } = notification;
  const venueName = payload.venueName || 'Your venue';

  switch (type) {
    case 'BOOKING_CONFIRMED': {
      const dates = formatBookingDates(payload.startDate, payload.endDate);
      const amount = formatCurrency(payload.totalAmount);
      return {
        title: 'New booking confirmed',
        message: `A booking at ${venueName} for ${dates} (${amount}) has been confirmed.`,
        variant: 'success',
        link: '/owner/bookings',
      };
    }
    case 'VENUE_APPROVED':
      return {
        title: 'Venue approved',
        message: `${venueName} has been approved and is now live for bookings.`,
        variant: 'success',
        link: '/owner/venues',
      };
    case 'VENUE_REJECTED':
      return {
        title: 'Venue not approved',
        message: payload.reason
          ? `${venueName} was not approved: ${payload.reason}`
          : `${venueName} was not approved. Please review and resubmit.`,
        variant: 'danger',
        link: '/owner/venues',
      };
    default:
      return {
        title: 'Notification',
        message: 'You have a new update.',
        variant: 'default',
        link: null,
      };
  }
};
