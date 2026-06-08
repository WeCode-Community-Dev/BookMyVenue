import { useState } from 'react';

import logo from '../../../assets/bookmyvenue.webp';

import AccountTypeSelector from '../components/AccountTypeSelector';
import UserSignupForm from '../components/UserSignupForm';
import OwnerSignupForm from '../components/OwnerSignupForm';

const SignupPage = () => {

   const [accountType, setAccountType] = useState(null);

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
                  Join BookMyVenue
               </p>

               {!accountType && (

                  <AccountTypeSelector
                     onSelect={setAccountType}
                  />

               )}

               {accountType === 'USER' && (

                  <UserSignupForm onBack={() => setAccountType(null)}
                   />

               )}

               {accountType === 'OWNER' && (

                  <OwnerSignupForm  onBack={() => setAccountType(null)}
                  />

               )}

            </div>

         </div>

      </div>

   );
};

export default SignupPage;