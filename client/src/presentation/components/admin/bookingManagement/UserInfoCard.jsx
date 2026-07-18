import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const UserInfoCard = ({ user }) => {

    return (

        <Card>

            <CardHeader>

                <CardTitle>

                    User Information

                </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

                <div>

                    <p className="text-sm text-muted-foreground">

                        Full Name

                    </p>

                    <p className="font-medium">

                        {user?.fullName || "-"}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-muted-foreground">

                        Email

                    </p>

                    <p className="font-medium">

                        {user?.email || "-"}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-muted-foreground">

                        Phone

                    </p>

                    <p className="font-medium">

                        {user?.phone || "-"}

                    </p>

                </div>

            </CardContent>

        </Card>

    );

};

export default UserInfoCard;