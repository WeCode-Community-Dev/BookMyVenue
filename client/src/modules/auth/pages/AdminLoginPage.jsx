import logo from '../../../assets/bookmyvenue.webp';
import AdminLoginForm from '../components/AdminLoginForm';



const AdminLoginPage = () => {

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
                  Admin Login
               </h1>

               <p className="mt-3 text-gray-500">
                  Sign in as administrator.
               </p>

               <AdminLoginForm />

            </div>

         </div>

      </div>

   );

};

export default AdminLoginPage;