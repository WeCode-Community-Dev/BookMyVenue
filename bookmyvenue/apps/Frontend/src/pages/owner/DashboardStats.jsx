function DashboardStats({
  venues = [],
  bookings = [],
}) {


  const totalVenues = venues.length;


  const totalBookings = bookings.length;


  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === "pending"
  ).length;



  const confirmedBookings = bookings.filter(
    (booking) =>
      booking.status === "confirmed"
  ).length;



  const stats = [
    {
      title: "Total Venues",
      value: totalVenues,
      description: "Your listed venues",
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      description: "All booking requests",
    },
    {
      title: "Pending Requests",
      value: pendingBookings,
      description: "Need your action",
    },
    {
      title: "Confirmed",
      value: confirmedBookings,
      description: "Approved bookings",
    },
  ];



  return (

    <div
      className="
        grid
        grid-cols-1
        gap-5
        sm:grid-cols-2
        lg:grid-cols-4
      "
    >

      {stats.map((stat) => (

        <div
          key={stat.title}
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-6
            shadow-sm
            transition
            hover:shadow-md
          "
        >


          <p
            className="
              text-sm
              font-medium
              text-gray-500
            "
          >

            {stat.title}

          </p>



          <h3
            className="
              mt-3
              text-3xl
              font-extrabold
              text-gray-900
            "
          >

            {stat.value}

          </h3>



          <p
            className="
              mt-2
              text-sm
              text-gray-500
            "
          >

            {stat.description}

          </p>


        </div>

      ))}


    </div>

  );

}


export default DashboardStats;