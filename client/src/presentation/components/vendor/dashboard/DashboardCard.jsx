import {
  Card,
  CardContent,
} from "@/components/ui/card";

const DashboardCard = ({ title, value }) => {
  return (
    <Card>
      <CardContent className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-sm font-medium text-gray-500">
          {title}
        </h2>

        <p className="text-2xl font-bold text-gray-900">
          {value}
        </p>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;