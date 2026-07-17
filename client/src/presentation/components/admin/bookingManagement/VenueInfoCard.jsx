import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const VenueInfoCard = ({ venue }) => {

    return (

        <Card>

            <CardHeader>

                <CardTitle>

                    Venue Information

                </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

                <div>

                    <p className="text-sm text-muted-foreground">

                        Venue Name

                    </p>

                    <p className="font-medium">

                        {venue?.name || "-"}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-muted-foreground">

                        Category

                    </p>

                    <p className="font-medium">

                        {venue?.category || "-"}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-muted-foreground">

                        Address

                    </p>

                    <p className="font-medium">

                        {venue?.address
                            ? `${venue.address.addressLine1}, ${venue.address.city}, ${venue.address.state}`
                            : "-"}

                    </p>

                </div>

                <div className="grid grid-cols-1 gap-4">

                    <div>

                        <p className="text-sm text-muted-foreground">

                            Seating Capacity

                        </p>

                        <p className="font-medium">

                            {venue?.seatingCapacity ?? "-"}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-muted-foreground">

                            Standing Capacity

                        </p>

                        <p className="font-medium">

                            {venue?.standingCapacity ?? "-"}

                        </p>

                    </div>

                </div>

            </CardContent>

        </Card>

    );

};

export default VenueInfoCard;