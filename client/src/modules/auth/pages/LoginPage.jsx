import logo from '../../../assets/bookmyvenue.webp';

import LoginForm from '../components/LoginForm';

const LoginPage = () => {

   return (

      <div className="min-h-screen bg-white">

         <div className="absolute top-6 left-6">

            <img
               src={logo}
               alt="BookMyVenue"
               className="h-28 w-auto"
            />

         </div>

         <div className="min-h-screen flex items-center justify-center px-4">

            <div className="w-full max-w-md">

               <h1 className="text-4xl font-bold text-gray-900">
                  Welcome Back
               </h1>

               <p className="mt-3 text-gray-500">
                  Sign in to manage bookings and venues.
               </p>

               <LoginForm />

               <p className="text-center text-sm text-gray-500 mt-6">

                  Don't have an account?

                  <a
                     href="/signup"
                     className="
                        ml-1
                        text-red-600
                        font-medium
                        hover:text-red-700
                     "
                  >
                     Create Account
                  </a>

               </p>

            </div>

         </div>

      </div>

   );

};

export default LoginPage;