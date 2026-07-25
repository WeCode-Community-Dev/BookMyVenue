const BookingPagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
  totalCount,
}) => {

  if (totalPages <= 1) {
    return null;
  }


  const handlePrevious = () => {

    if (currentPage > 1) {

      setCurrentPage(
        currentPage - 1
      );

    }

  };


  const handleNext = () => {

    if (currentPage < totalPages) {

      setCurrentPage(
        currentPage + 1
      );

    }

  };


  return (

    <div className="mt-6 flex items-center justify-between">

      <p className="text-sm text-gray-500">

        Showing page {currentPage} of {totalPages}

        {" "}({totalCount} bookings)

      </p>


      <div className="flex items-center gap-2">

        <button

          type="button"

          onClick={handlePrevious}

          disabled={currentPage === 1}

          className="rounded-lg border bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"

        >

          Previous

        </button>


        <span className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">

          {currentPage}

        </span>


        <button

          type="button"

          onClick={handleNext}

          disabled={
            currentPage === totalPages
          }

          className="rounded-lg border bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"

        >

          Next

        </button>

      </div>

    </div>

  );

};


export default BookingPagination;