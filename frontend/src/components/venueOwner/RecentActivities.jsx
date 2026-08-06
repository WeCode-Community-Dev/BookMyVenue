import { CheckCircle2, CalendarDays, Clock3, XCircle } from "lucide-react";

const activities = [
    {
        id: 1,
        icon: CheckCircle2,
        title: 'Venue "Royal Hall" approved',
        time: "2 hours ago",
        color: "text-green-600",
    },
    {
        id: 2,
        icon: CalendarDays,
        title: "New booking from Rahul",
        time: "4 hours ago",
        color: "text-blue-600",
    },
    {
        id: 3,
        icon: Clock3,
        title: 'Venue "Grand Resort" submitted for review',
        time: "Yesterday",
        color: "text-yellow-600",
    },
    {
        id: 4,
        icon: XCircle,
        title: 'Venue "ABC Hall" rejected',
        time: "2 days ago",
        color: "text-red-600",
    },
];

export default function RecentActivities() {
    return (
        <div className="divide-y divide-gray-100">
            {activities.map((activity) => {
                const Icon = activity.icon;

                return (
                    <div
                        key={activity.id}
                        className="flex items-center justify-between p-4"
                    >
                        <div className="flex items-center gap-3">
                            <Icon
                                size={18}
                                className={`shrink-0 ${activity.color}`}
                            />

                            <p className="text-sm font-medium text-gray-900">
                                {activity.title}
                            </p>
                        </div>

                        <p className="text-xs mr-5 text-gray-500">
                            {activity.time}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}