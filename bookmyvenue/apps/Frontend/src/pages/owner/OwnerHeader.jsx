import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/image.png";


function OwnerHeader() {

  const navigate = useNavigate();

  const { logout } = useAuth();



  function handleLogout() {

    logout();

    navigate("/login");

  }



  return (

    <header
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-gray-200
        bg-white
      "
    >

      <div
        className="
          mx-auto
          flex
          h-20
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >


        {/* Left Side */}

        <div className="flex items-center gap-4">


          




          {/* Back button */}

          <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-red-600"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </button>


        </div>





        {/* Right Side */}

        <div className="flex items-center gap-3">


          <button
            onClick={() => navigate("/owner/dashboard")}
            className="
              rounded-md
              px-4
              py-2
              text-sm
              font-semibold
              text-gray-800
              transition-colors
              hover:bg-gray-100
            "
          >

            Dashboard

          </button>



        </div>


      </div>


    </header>

  );

}


export default OwnerHeader;