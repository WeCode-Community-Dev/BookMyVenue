import { OverviewPage as OverviewTab } from "../../components/tabs/Overview";
import { USERS, BOOKINGS, VENUES } from "../../components/data";

export default function OverviewPage() {
    const totalRevenue = BOOKINGS.filter((b) => b.status === "Confirmed").reduce((s, b) => s + b.amount, 0);

    return <OverviewTab venues={VENUES} users={USERS} totalRevenue={totalRevenue} />;
}
