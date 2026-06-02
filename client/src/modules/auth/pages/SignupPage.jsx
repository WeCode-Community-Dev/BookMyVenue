import SignupForm from '../components/SignupForm';
import logo from '../../../assets/bookmyvenue.webp';

const SignupPage = () => {
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
                  Create Account
               </h1>

               <p className="mt-3 text-gray-500">
                  Join BookMyVenue and discover amazing venues
                  for your next event.
               </p>

               {/* Tags */}
               <div className="flex flex-wrap gap-2 mt-6 mb-8">

                  <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-medium">
                     Venues
                  </span>

                  <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-medium">
                     Events
                  </span>

                  <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-medium">
                     Bookings
                  </span>

               </div>

               <SignupForm />

               <p className="text-center text-sm text-gray-500 mt-6">
                  Already have an account?
                  <a
                     href="/login"
                     className="ml-1 text-red-600 font-medium hover:text-red-700"
                  >
                     Sign In
                  </a>
               </p>

            </div>

         </div>

      </div>
   );
};

export default SignupPage;