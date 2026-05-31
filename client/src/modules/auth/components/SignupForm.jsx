import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { signupSchema } from '../validations/signup.validation';
import { signupUser } from '../services/auth.service';

const SignupForm = () => {

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting }
   } = useForm({
      resolver: zodResolver(signupSchema)
   });

   const onSubmit = async (data) => {

      try {

         const payload = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password
         };

         const response = await signupUser(payload);

         console.log(response);

         alert('Signup successful');

      } catch (error) {

         console.error(error);

         alert(
            error?.response?.data?.message ||
            'Signup failed'
         );
      }
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="space-y-4"
      >

         {/* Name */}
         <div>

            <input
               type="text"
               placeholder="Full Name"
               {...register('name')}
               className="
                  w-full
                  h-12
                  px-4
                  p-4
                  rounded-xl
                  border
                  border-gray-300
                  focus:border-red-500
                  focus:ring-4
                  focus:ring-red-100
                  outline-none
                  transition
               "
            />

            {errors.name && (
               <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
               </p>
            )}

         </div>

         {/* Email */}
         <div>

            <input
               type="email"
               placeholder="Email Address"
               {...register('email')}
               className="
                  w-full
                  h-12
                  px-4
                  p-4
                  rounded-xl
                  border
                  border-gray-300
                  focus:border-red-500
                  focus:ring-4
                  focus:ring-red-100
                  outline-none
                  transition
               "
            />

            {errors.email && (
               <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
               </p>
            )}

         </div>

         {/* Phone */}
         <div>

            <input
               type="text"
               placeholder="Phone Number"
               {...register('phone')}
               className="
                  w-full
                  h-12
                  px-4
                  p-4
                  rounded-xl
                  border
                  border-gray-300
                  focus:border-red-500
                  focus:ring-4
                  focus:ring-red-100
                  outline-none
                  transition
               "
            />

            {errors.phone && (
               <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
               </p>
            )}

         </div>

         {/* Password */}
         <div>

            <input
               type="password"
               placeholder="Password"
               {...register('password')}
               className="
                  w-full
                  h-12
                  px-4
                  p-4
                  rounded-xl
                  border
                  border-gray-300
                  focus:border-red-500
                  focus:ring-4
                  focus:ring-red-100
                  outline-none
                  transition
               "
            />

            {errors.password && (
               <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
               </p>
            )}

         </div>

         {/* Confirm Password */}
         <div>

            <input
               type="password"
               placeholder="Confirm Password"
               {...register('confirmPassword')}
               className="
                  w-full
                  p-4
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
               "
            />

            {errors.confirmPassword && (
               <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
               </p>
            )}

         </div>

         <button
            type="submit"
            disabled={isSubmitting}
            className="
               w-full
               h-12
               rounded-xl
               bg-red-600
               hover:bg-red-700
               text-white
               font-semibold
               transition
               disabled:opacity-50
            "
         >
            {
               isSubmitting
                  ? 'Creating Account...'
                  : 'Create Account'
            }
         </button>

      </form>
   );
};

export default SignupForm;