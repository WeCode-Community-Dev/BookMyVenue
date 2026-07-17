import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const VendorInfoCard = ({ vendor }) => {

    return (

        <Card>

            <CardHeader>

                <CardTitle>

                    Vendor Information

                </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

                <div>

                    <p className="text-sm text-muted-foreground">

                        Full Name

                    </p>

                    <p className="font-medium">

                        {vendor?.fullName || "-"}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-muted-foreground">

                        Company Name

                    </p>

                    <p className="font-medium">

                        {vendor?.companyName || "-"}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-muted-foreground">

                        Email

                    </p>

                    <p className="font-medium">

                        {vendor?.email || "-"}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-muted-foreground">

                        Phone

                    </p>

                    <p className="font-medium">

                        {vendor?.phone || "-"}

                    </p>

                </div>

            </CardContent>

        </Card>

    );

};

export default VendorInfoCard;