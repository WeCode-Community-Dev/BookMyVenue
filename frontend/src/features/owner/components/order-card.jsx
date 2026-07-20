import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatUtcForIstDisplay } from '@/utils/datetime';
import  './order-card-style.css'

const OrderCard = ({ orderId, status, customerName, from, to, total, customerEmail, customerNumber, venueId, venueName }) => {
  return (
    <Card className="mx-auto w-full px-5 xl:max-w-[800px] min-w-[300px]">
      <CardHeader className="p-0 py-2">
        <div className="ownerOrderHeaderWrapper flex justify-between">
          <CardTitle className="">
            <h2 className="py-2">OrderId: {orderId}</h2>
          </CardTitle>
          <h4 className="rounded-md bg-green-100 p-2">Status: {status}</h4>
        </div>
      </CardHeader>

      <CardContent>
        <div className='flex flex-col '>
          <div className="customerName placeholderValueWrapper">
            <div className="label">Customer Name</div>
            <div className="value">{customerName}</div>
          </div>
          <div className="bookingFromWrapper placeholderValueWrapper">
            <p className="bookingFromLabel label">Booking from </p>
            <p className="bookingFrom value">
              {formatUtcForIstDisplay(from, {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour12: true,
                hour: 'numeric',
              })}
            </p>
          </div>
          <div className="bookingToWrapper placeholderValueWrapper">
            <p className="bookingToLabel label">Booking To </p>
            <p className="bookingTo value">
              {formatUtcForIstDisplay(to, {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour12: true,
                hour: 'numeric',
              })}
            </p>
          </div>
          <div className="totalPrice placeholderValueWrapper">
            <div className="label">Total Amount: </div>
            <div className="value">{total}</div>
          </div>
          <div className="customerEmail placeholderValueWrapper">
            <div className="label">Customer Email</div>
            <div className="value">{customerEmail}</div>
          </div>
          <div className="customerNumber placeholderValueWrapper">
            <div className="label">Customer Contact Number</div>
            <div className="value">{customerNumber}</div>
          </div>
          <div className="venueId placeholderValueWrapper">
            <div className="label">Venue Unique Id</div>
            <div className="value">{venueId}</div>
          </div>
          <div className="venueName placeholderValueWrapper">
            <div className="label">Venue Name</div>
            <div className="value">{venueName}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
