import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import OwnerLayout from "../components/VenueOwnerDashboard/OwnerLayout";
import StatCardsRow from "../components/VenueOwnerDashboard/StatCardsRow";
import RecentBookingRequests from "../components/VenueOwnerDashboard/RecentBookingRequests";
import AvailabilityCalendar from "../components/VenueOwnerDashboard/AvailabilityCalendar";
import MyVenuesGrid from "../components/VenueOwnerDashboard/MyVenuesGrid";
import RevenueOverview from "../components/VenueOwnerDashboard/RevenueOverview";
import RecentReviews from "../components/VenueOwnerDashboard/RecentReviews";
import NotificationsSummary from "../components/VenueOwnerDashboard/NotificationsSummary";

import {
  fetchBookingRequestsAsync,
  fetchAvailabilityCalendarAsync,
  fetchMyVenuesAsync,
  fetchRevenueOverviewAsync,
  fetchRecentReviewsAsync,
} from "../modules/venueOwner/venueOwnerSlice";

function OwnerDashboardPage() {
  const dispatch = useDispatch();
  const [revenueRange, setRevenueRange] = useState("this_month");

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
    const currentMonth = new Date().toISOString().slice(0, 7);
    dispatch(fetchBookingRequestsAsync());
    dispatch(fetchAvailabilityCalendarAsync({ month: currentMonth }));
    dispatch(fetchMyVenuesAsync());
    dispatch(fetchRecentReviewsAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchRevenueOverviewAsync(revenueRange));
  }, [dispatch, revenueRange]);

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <StatCardsRow summary={summary} loading={loading.summary} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <RecentBookingRequests
              requests={bookingRequests}
              loading={loading.bookingRequests}
            />
          </div>
          <AvailabilityCalendar days={calendar.days} loading={loading.calendar} />
        </div>

        <MyVenuesGrid venues={venues} loading={loading.venues} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <RevenueOverview
              revenue={revenue}
              loading={loading.revenue}
              range={revenueRange}
              onRangeChange={setRevenueRange}
            />
          </div>
          <div className="space-y-5">
            <RecentReviews reviews={reviews} loading={loading.reviews} />
            <NotificationsSummary notifications={notifications} loading={loading.notifications} />
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}

export default OwnerDashboardPage;
