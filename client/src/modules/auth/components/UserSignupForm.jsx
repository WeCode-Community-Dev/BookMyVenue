import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { signupApi } from '../services/auth.service';
import { userSignupSchema } from '../validations/signup.validation';

const inputClass = `
   w-full
   h-12
   px-4
   rounded-xl
   border
   border-gray-300
   focus:border-red-500
   focus:ring-4
   focus:ring-red-100
   outline-none
   transition
`;

const UserSignupForm = ({ onBack }) => {

   const {
      register,
      handleSubmit,
      formState: {
         errors,
         isSubmitting
      }
   } = useForm({
      resolver: zodResolver(userSignupSchema)
   });

   const onSubmit = async (data) => {

      const payload = {
         accountType: 'USER',
         name: data.name,
         email: data.email,
         phone: data.phone,
         password: data.password
      };

      const response = await signupApi(payload);

      alert(response.message);

   };

   return (
      <>
         <button
            type="button"
            onClick={onBack}
            className="
            mb-6
            text-sm
            text-red-600
            hover:text-red-700
            font-medium
         "
         >
            ← Change Selection
         </button>
         <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 mt-8"
         >

            <input
               placeholder="Full Name"
               {...register('name')}
               className={inputClass}
            />

            {errors.name &&
               <p className="text-red-500 text-sm">
                  {errors.name.message}
               </p>
            }

            <input
               placeholder="Email Address"
               {...register('email')}
               className={inputClass}
            />

            {errors.email &&
               <p className="text-red-500 text-sm">
                  {errors.email.message}
               </p>
            }

            <input
               placeholder="Phone Number"
               {...register('phone')}
               className={inputClass}
            />

            {errors.phone &&
               <p className="text-red-500 text-sm">
                  {errors.phone.message}
               </p>
            }

            <input
               type="password"
               placeholder="Password"
               {...register('password')}
               className={inputClass}
            />

            {errors.password &&
               <p className="text-red-500 text-sm">
                  {errors.password.message}
               </p>
            }

            <input
               type="password"
               placeholder="Confirm Password"
               {...register('confirmPassword')}
               className={inputClass}
            />

            {errors.confirmPassword &&
               <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
               </p>
            }

            <button
               type="submit"
               disabled={isSubmitting}
               className="
               w-full
               h-12
               rounded-xl
               bg-red-600
               text-white
               font-semibold
            "
            >
               {
                  isSubmitting
                     ? 'Creating Account...'
                     : 'Create Account'
               }
            </button>

         </form>
      </>
   );

};

export default UserSignupForm;