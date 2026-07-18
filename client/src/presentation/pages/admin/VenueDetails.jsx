import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import { isValidElement } from "react";
import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
    getVenueById,
} from "@/redux/slices/AdminVenueSlice";

const AdminVenueDetails = () => {
console.log("AdminVenueDetails rendered");
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { venueId } = useParams();
console.log("venueId =", venueId);
    const {

        selectedVenue,

        loading,

    } = useSelector(
        state => state.adminVenue
    );

    useEffect(() => {
console.log("dispatching getVenueById");
        dispatch(
            getVenueById(venueId)
        );

    }, [dispatch, venueId]);

    if (loading) {

    return (

        <div className="p-10 text-center">

            Loading...

        </div>

    );

}

if (!selectedVenue) {

    return (

        <div className="p-10 text-center">

            Venue not found.

        </div>

    );

}
const DetailRow = ({ label, value }) => {
    let displayValue;

    if (value === null || value === undefined) {
        displayValue = "-";
    } else if (isValidElement(value)) {
        displayValue = value;
    } else if (typeof value === "object") {
        displayValue = JSON.stringify(value, null, 2);
    } else {
        displayValue = value;
    }

    return (
        <div className="grid grid-cols-3 gap-4 py-2 border-b last:border-b-0">
            <span className="font-medium text-gray-600">
                {label}
            </span>

            <span className="col-span-2 text-gray-900">
                {displayValue}
            </span>
        </div>
    );
};
console.log("selectedVenue", selectedVenue);
return (

<div className="p-6 space-y-6">

    <Button

        variant="outline"

        onClick={() => navigate(-1)}

    >

        <ArrowLeft className="w-4 h-4 mr-2"/>

        Back

    </Button>

    <Card>

        <CardContent className="p-6">

            <div className="flex justify-between items-start">

                <div>

                    <h1 className="text-3xl font-bold">

                        {selectedVenue.name}

                    </h1>

                    <p className="text-gray-500 mt-2">

                        {selectedVenue.category}

                    </p>

                </div>

                <Badge

                    className={

                        selectedVenue.isBlocked

                        ? "bg-red-600"

                        : selectedVenue.approvalStatus==="ACTIVE"

                        ? "bg-green-600"

                        : selectedVenue.approvalStatus==="REJECTED"

                        ? "bg-red-100 text-red-700"

                        : "bg-yellow-100 text-yellow-700"

                    }

                >

                    {

                        selectedVenue.isBlocked

                        ? "Blocked"

                        : selectedVenue.approvalStatus

                    }

                </Badge>

            </div>

        </CardContent>

    </Card>
    <Card>

    <CardHeader>

        <CardTitle>

            Venue Images

        </CardTitle>

    </CardHeader>

    <CardContent>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {

                selectedVenue.images?.length > 0 ? (

                    selectedVenue.images.map((image, index) => (

                        <img

                            key={index}

                            src={image.url}

                            alt={`Venue ${index + 1}`}

                            className="h-48 w-full rounded-lg object-cover border"

                        />

                    ))

                ) : (

                    <div className="text-gray-500">

                        No images available

                    </div>

                )

            }

        </div>

    </CardContent>

</Card>
<Card>

    <CardHeader>

        <CardTitle>

            Basic Information

        </CardTitle>

    </CardHeader>

    <CardContent>

        <DetailRow
            label="Venue Name"
            value={selectedVenue.name}
        />

        <DetailRow
            label="Category"
            value={selectedVenue.category}
        />

        <DetailRow
            label="Description"
            value={selectedVenue.description}
        />

       <DetailRow
    label="Website"
    value={
        selectedVenue.websiteUrl ? (
            <a
                href={selectedVenue.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
            >
                {selectedVenue.websiteUrl}
            </a>
        ) : (
            "-"
        )
    }
/>

        <DetailRow
            label="Status"
            value={
                selectedVenue.isBlocked
                    ? "Blocked"
                    : selectedVenue.approvalStatus
            }
        />

    </CardContent>

</Card>
<Card>

    <CardHeader>

        <CardTitle>

            Address

        </CardTitle>

    </CardHeader>

    <CardContent>

        <DetailRow
            label="Address Line"
            value={selectedVenue.address?.addressLine1}
        />

        <DetailRow
            label="City"
            value={selectedVenue.address?.city}
        />

        <DetailRow
            label="State"
            value={selectedVenue.address?.state}
        />

        <DetailRow
            label="Country"
            value={selectedVenue.address?.country}
        />

        <DetailRow
            label="Pincode"
            value={selectedVenue.address?.pincode}
        />

        <DetailRow
            label="Phone"
            value={selectedVenue.address?.phone}
        />

{/*<DetailRow
    label="Google Map"
    value={
        selectedVenue.address?.googleMapLink ? (
            <a
                href={selectedVenue.address.googleMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
            >
                Open Location
            </a>
        ) : (
            "-"
        )
    }
/>*/}

    </CardContent>

</Card>
<Card>
  <CardHeader>
    <CardTitle>Vendor Details</CardTitle>
  </CardHeader>

  <CardContent>
    <DetailRow
      label="Vendor Name"
      value={selectedVenue.vendorId?.fullName}
    />

    <DetailRow
      label="Company"
      value={selectedVenue.vendorId?.companyName}
    />

    <DetailRow
      label="Email"
      value={selectedVenue.vendorId?.email}
    />

    <DetailRow
      label="Phone"
      value={selectedVenue.vendorId?.phone}
    />
  </CardContent>
</Card>
 <Card>

    <CardHeader>

        <CardTitle>

            Pricing

        </CardTitle>

    </CardHeader>

    <CardContent>

        <DetailRow
            label="Price / Hour"
            value={`₹${selectedVenue.pricePerHour?.toLocaleString()}`}
        />

        <DetailRow
            label="Price / Day"
            value={`₹${selectedVenue.pricePerDay?.toLocaleString()}`}
        />

        <DetailRow
            label="Security Deposit"
            value={`₹${selectedVenue.securityDeposit?.toLocaleString()}`}
        />

        <DetailRow
            label="Weekend Surcharge"
            value={`₹${selectedVenue.weekendSurcharge?.toLocaleString()}`}
        />

    </CardContent>

</Card>
<Card>

    <CardHeader>

        <CardTitle>

            Capacity

        </CardTitle>

    </CardHeader>

    <CardContent>

        <DetailRow
            label="Seating Capacity"
            value={selectedVenue.seatingCapacity}
        />

        <DetailRow
            label="Standing Capacity"
            value={selectedVenue.standingCapacity}
        />

        <DetailRow
            label="Minimum Booking Hours"
            value={selectedVenue.minimumBookingHours}
        />

    </CardContent>

</Card>
<Card>

    <CardHeader>

        <CardTitle>

            Availability

        </CardTitle>

    </CardHeader>

    <CardContent>

        <DetailRow
            label="Open Time"
            value={selectedVenue.availabilityRules?.openTime}
        />

        <DetailRow
            label="Close Time"
            value={selectedVenue.availabilityRules?.closeTime}
        />

        <DetailRow
            label="Closed Days"
            value={
                selectedVenue.availabilityRules?.closedDays?.length
                    ? selectedVenue.availabilityRules.closedDays.join(", ")
                    : "None"
            }
        />

    </CardContent>

</Card>
<Card>

    <CardHeader>

        <CardTitle>

            Amenities

        </CardTitle>

    </CardHeader>

    <CardContent>

        <div className="flex flex-wrap gap-2">

            {

                selectedVenue.amenities?.length > 0

                    ? selectedVenue.amenities.map((amenity, index) => (

                        <Badge
                            key={index}
                            variant="secondary"
                        >
                            {amenity}
                        </Badge>

                    ))

                    : (

                        <span className="text-gray-500">

                            No amenities available

                        </span>

                    )

            }

        </div>

    </CardContent>

</Card>
<Card>

    <CardHeader>

        <CardTitle>

            License

        </CardTitle>

    </CardHeader>

    <CardContent>

        {

            selectedVenue.license?.length > 0 ? (

                <Button
                    asChild
                >

                    <a
                        href={selectedVenue.license[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View License
                    </a>

                </Button>

            ) : (

                <span className="text-gray-500">

                    No License Uploaded

                </span>

            )

        }

    </CardContent>

</Card>
{
    selectedVenue.approvalStatus === "REJECTED" && (

        <Card>

            <CardHeader>

                <CardTitle>

                    Rejection Reason

                </CardTitle>

            </CardHeader>

            <CardContent>

                <p className="text-red-600">

                    {selectedVenue.rejectionReason}

                </p>

            </CardContent>

        </Card>

    )
}
</div>

);
};

export default AdminVenueDetails;