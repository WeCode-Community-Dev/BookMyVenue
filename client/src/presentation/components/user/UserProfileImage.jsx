import { getInitials } from "@/lib/getInitilas";
import { Pencil, Camera, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

const UserProfileImage = ({
  image,
  name,
  email,
  memberSince,
  onImageChange,
  onRemoveImage,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const fileInputRef = useRef(null);
  return (
    <div className="flex flex-col items-center">
      {/* Profile Image */}
      <div className="relative">
        <div className="w-36 h-36 rounded-full overflow-hidden bg-amber-500 flex items-center justify-center text-white text-4xl font-bold">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(name)
          )}
        </div>

        {/* Pencil Button */}
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="absolute bottom-2 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-600 text-white shadow-md transition hover:bg-gray-700"
        >
          <Pencil size={18} />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-44 w-52 overflow-hidden rounded-xl border bg-white shadow-xl z-20">
            {/* Upload */}
            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                fileInputRef.current.click();
              }}
              className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100"
            >
              <Camera size={18} />
              <span>Upload New Photo</span>
            </button>

            {/* Remove */}
            {image && (
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onRemoveImage();
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50"
              >
                <Trash2 size={18} />
                <span>Remove Photo</span>
              </button>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            if (e.target.files[0]) {
              onImageChange(e.target.files[0]);
            }
          }}
        />
      </div>

      {/* Name */}
      <h2 className="mt-5 text-3xl font-bold text-slate-900">{name}</h2>

      {/* Email */}
      <p className="mt-2 text-lg text-gray-500">{email}</p>

      {/* Member Since */}
      <div className="mt-8 rounded-xl bg-slate-50 px-8 py-4 text-center shadow-sm">
        <p className="mt-2 text-lg text-gray-500">Member Since</p>
        <p className="mt-1 text-lg font-semibold text-orange-500">
          {memberSince || "-"}
        </p>
      </div>
    </div>
  );
};

export default UserProfileImage;
