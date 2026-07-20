import { useGetAllBookingsQuery } from '../api/owner-api';
import { Skeleton } from '@/components/ui/Skeleton';
import OrderCard from './order-card';

const ownerOrdersSkeleton = () => {
  return (
    <div className="">
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
};

const ListOwnerOrders = () => {
  const { data: ownerOrders, isFetching, isLoading, isError } = useGetAllBookingsQuery();

  console.log('data', ownerOrders);
  console.log('isFetching', isFetching);
  console.log('isError', isError);
  if (isError) {
    toast.isError(data.message);
  }
  //loading or first time
  if (isLoading) {
    return Array.from({ length: 3 }, (_, i) => i).map((_, idx) => <Skeleton key={idx} />);
  }

  if (isFetching) {
    <ownerOrdersSkeleton />;
  }

  if (ownerOrders.length === 0) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div>
          <h2 className="text-[40px] text-lg font-bold">NO Orders</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-10">
      {ownerOrders?.length > 0 && (
        <div className="bookingsHeading">
          <h1 className='font-bold text-4xl pb-10'>Your Bookings</h1>
        </div>
      )}
      {ownerOrders?.length > 0 &&
        ownerOrders.map((order, index) => {
          return (
            <OrderCard
              key={order.id}
              orderId={order.id}
              status={order?.status}
              customerName={order.customer?.username}
              from={order.bookingFrom}
              to={order.bookingTo}
              total={order.totalPrice}
              customerEmail={order.customer.email}
              customerNumber={order.status == 'CONFIRMED' ? 9123456789 : null}
              venueId={order.venueId}
              venueName={order.venue.name}
            />
          );
        })}
    </div>
  );
};
export default ListOwnerOrders;
