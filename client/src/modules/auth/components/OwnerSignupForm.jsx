import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { signupApi } from "../services/auth.service";
import { ownerSignupSchema } from "../validations/signup.validation";
import { useAuth } from "../../../shared/context/AuthContext";

import { ROUTES } from '../../../shared/constants/routes';

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

const OwnerSignupForm = ({ onBack }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ownerSignupSchema),
  });

  const onSubmit = async (data) => {
    const payload = {
      accountType: "OWNER",

      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,

      venue: {
        name: data.venueName,

        type: data.venueType,

        city: data.city,
      },
    };

    const response = await signupApi(payload);
    login(response.data.user, response.data.accessToken);
    navigate(

      ROUTES.OWNER_DASHBOARD,

      {
        state: {
          openVenueSetup: true,
        },
      }
    );
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8">
        {/* User Details */}

        <input
          placeholder="Full Name"
          {...register("name")}
          className={inputClass}
        />

        <input
          placeholder="Email Address"
          {...register("email")}
          className={inputClass}
        />

        <input
          placeholder="Phone Number"
          {...register("phone")}
          className={inputClass}
        />

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className={inputClass}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          className={inputClass}
        />

        <div className="pt-4">
          <h3 className="font-semibold text-lg">Venue Information</h3>
        </div>

        <input
          placeholder="Venue Name"
          {...register("venueName")}
          className={inputClass}
        />

        <select {...register("venueType")} className={inputClass}>
          <option value="">Select Venue Type</option>

          <option value="AUDITORIUM">Auditorium</option>

          <option value="BANQUET_HALL">Banquet Hall</option>

          <option value="CAFE">Cafe</option>

          <option value="RESTAURANT">Restaurant</option>

          <option value="CONFERENCE_ROOM">Conference Room</option>

          <option value="STUDIO">Studio</option>

          <option value="OUTDOOR_SPACE">Outdoor Space</option>

          <option value="OTHER">Other</option>
        </select>

        <input
          placeholder="City"
          {...register("city")}
          className={inputClass}
        />

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
          {isSubmitting ? "Creating Owner Account..." : "Create Owner Account"}
        </button>
      </form>
    </>
  );
};

export default OwnerSignupForm;
