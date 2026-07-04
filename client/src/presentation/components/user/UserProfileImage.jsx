import { Camera } from "lucide-react";

const UserProfileImage = ({
  image,
  name,
  email,
  memberSince,
  onImageChange,
}) => {
  return (
    <div className="flex flex-col items-center">
      {/* Profile Image */}
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="h-36 w-36 rounded-full object-cover border-4 border-white shadow-lg"
        />

        {/* Camera Button */}
        <button
          onClick={onImageChange}
          className="absolute bottom-2 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-600 text-white shadow-md transition hover:bg-gray-700"
        >
          <Camera size={18} />
        </button>
      </div>

      {/* Name */}
      <h2 className="mt-5 text-3xl font-bold text-slate-900">
        {name}
      </h2>

      {/* Email */}
      <p className="mt-2 text-lg text-gray-500">
        {email}
      </p>

      {/* Member Since */}
      <div className="mt-8 rounded-xl bg-slate-50 px-8 py-4 text-center shadow-sm">
        <p className="text-sm text-gray-500">
          Member Since
        </p>

        <p className="mt-1 text-lg font-semibold text-orange-500">
          {memberSince}
        </p>
      </div>
    </div>
  );
};

export default UserProfileImage;