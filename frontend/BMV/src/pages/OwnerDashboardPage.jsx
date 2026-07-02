import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import OwnerLayout from "../components/VenueOwnerDashboard/OwnerLayout";
import StatCardsRow from "../components/VenueOwnerDashboard/StatCardsRow";
import RecentBookingRequests from "../components/VenueOwnerDashboard/RecentBookingRequests";
import AvailabilityCalendar from "../components/VenueOwnerDashboard/AvailabilityCalendar";
import MyVenuesGrid from "../components/VenueOwnerDashboard/MyVenuesGrid";
import RevenueOverview from "../components/VenueOwnerDashboard/RevenueOverview";
import RecentReviews from "../components/VenueOwnerDashboard/RecentReviews";
import NotificationsPanel from "../components/VenueOwnerDashboard/NotificationsPanel";

import {
  fetchDashboardSummaryAsync,
  fetchBookingRequestsAsync,
  fetchAvailabilityCalendarAsync,
  fetchMyVenuesAsync,
  fetchRevenueOverviewAsync,
  fetchRecentReviewsAsync,
  fetchNotificationsAsync,
} from "../modules/venueOwner/venueOwnerSlice";

function OwnerDashboardPage() {
  const dispatch = useDispatch();

  const {
    summary,
    bookingRequests,
    calendar,
    venues,
    revenue,
    reviews,
    notifications,
    loading,
  } = useSelector((state) => state.venueOwner);

  useEffect(() => {
    dispatch(fetchDashboardSummaryAsync());
    dispatch(fetchBookingRequestsAsync());
    dispatch(fetchAvailabilityCalendarAsync("2024-05"));
    dispatch(fetchMyVenuesAsync());
    dispatch(fetchRevenueOverviewAsync("this_month"));
    dispatch(fetchRecentReviewsAsync());
    dispatch(fetchNotificationsAsync());
  }, [dispatch]);

  return (
    <OwnerLayout>
      <div className="space-y-6">
        {/* Stat cards */}
        <StatCardsRow summary={summary} loading={loading.summary} />

        {/* Booking requests + calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <RecentBookingRequests
              requests={bookingRequests}
              loading={loading.bookingRequests}
            />
          </div>
          <AvailabilityCalendar days={calendar.days} loading={loading.calendar} />
        </div>

        {/* My venues */}
        <MyVenuesGrid venues={venues} loading={loading.venues} />

        {/* Revenue + reviews + notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <RevenueOverview revenue={revenue} loading={loading.revenue} />
          </div>
          <div className="space-y-5">
            <RecentReviews reviews={reviews} loading={loading.reviews} />
            <NotificationsPanel notifications={notifications} loading={loading.notifications} />
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}

export default OwnerDashboardPage;
