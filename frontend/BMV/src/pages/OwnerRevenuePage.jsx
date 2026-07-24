import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OwnerLayout from "../components/VenueOwnerDashboard/OwnerLayout";
import RevenueOverview from "../components/VenueOwnerDashboard/RevenueOverview";
import { fetchRevenueOverviewAsync } from "../modules/venueOwner/venueOwnerSlice";

function OwnerRevenuePage() {
  const dispatch = useDispatch();
  const { revenue, loading } = useSelector((state) => state.venueOwner);
  const [range, setRange] = useState("this_month");

  useEffect(() => {
    dispatch(fetchRevenueOverviewAsync(range));
  }, [dispatch, range]);

  return (
    <OwnerLayout>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Revenue</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Track payments across all your venues
          </p>
        </div>
        <RevenueOverview
          revenue={revenue}
          loading={loading.revenue}
          range={range}
          onRangeChange={setRange}
          showFullReportLink={false}
        />
      </div>
    </OwnerLayout>
  );
}

export default OwnerRevenuePage;
