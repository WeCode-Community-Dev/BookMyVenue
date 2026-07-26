import { Card, CardContent } from "@/components/ui/card";

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  color = "text-amber-600",
}) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">

        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="text-3xl font-bold">
            {value}
          </h2>
        </div>

        {Icon && (
          <Icon
            className={`h-9 w-9 ${color}`}
          />
        )}

      </CardContent>
    </Card>
  );
};

export default DashboardCard;