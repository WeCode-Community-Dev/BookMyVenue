import React from "react";
import { useOutletContext } from "react-router-dom";
import MetricCards from "../MetricCards";
import CampaignTypesChart from "../CampaignTypesChart";
import TopAutomations from "../TopAutomations";
import RecentCampaigns from "../RecentCampaigns";
import OrganizerMsg from "../OrganizerMsg";

export default function Overview() {
  const { user, users, venues, organizers, bookedVenues } = useOutletContext();

  console.log("f...", bookedVenues);

  const isAdmin = user?.role === "admin";

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <MetricCards
        user={user}
        status={{
          users: users,
          venues: venues,
          organizers: organizers,
        }}
        booked={bookedVenues}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-6 min-h-[340px] animate-fade-in-up-stagger delay-375">
          <RecentCampaigns venue={venues} />
        </div>

        <div className="lg:col-span-3  animate-fade-in-up-stagger delay-450">
          <CampaignTypesChart booked={bookedVenues} users={users} isAdmin={isAdmin}/>
        </div>

        <div className="lg:col-span-3  animate-fade-in-up-stagger delay-525">
          {isAdmin ? (
            <TopAutomations organizers={organizers} />
          ) : (
            <OrganizerMsg />
          )}
        </div>
      </div>
    </div>
  );
}
