import { useRef } from "react";
import { Camera, Loader2, Pencil, User } from "lucide-react";

const formatRole = (role) => role.charAt(0).toUpperCase() + role.slice(1);

const roleStyles = {
  customer: "bg-gray-100 text-gray-700",
  provider: "bg-red-50 text-red-700",
  admin: "bg-violet-50 text-violet-700",
};

const ProfileHeader = ({
  user,
  roles,
  onEditProfile,
  isEditing = false,
  avatarSrc,
  isUploadingImage = false,
  onProfileImageSelect,
}) => {
  const fileInputRef = useRef(null);
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "?";
  const displaySrc = avatarSrc || user?.profileImage;

  const handleCameraClick = () => {
    if (isUploadingImage) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onProfileImageSelect(file);
    }
    event.target.value = "";
  };

  return (
    <header className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm ring-1 ring-gray-100/80 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            {displaySrc ? (
              <img
                src={displaySrc}
                alt=""
                className={`h-24 w-24 rounded-full object-cover ring-2 ring-red-100 sm:h-28 sm:w-28 ${
                  isUploadingImage ? "opacity-70" : ""
                }`}
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-gray-50 ring-2 ring-red-100 sm:h-28 sm:w-28">
                <span className="text-3xl font-bold text-red-600 sm:text-4xl">
                  {initial}
                </span>
              </div>
            )}

            {isUploadingImage && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-full bg-white/40"
                aria-hidden="true"
              >
                <Loader2 className="h-7 w-7 animate-spin text-red-600" />
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploadingImage}
              aria-hidden="true"
              tabIndex={-1}
            />

            <button
              type="button"
              onClick={handleCameraClick}
              disabled={isUploadingImage}
              aria-label="Change profile photo"
              title="Change profile photo"
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Camera className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="min-w-0 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <User className="hidden h-5 w-5 text-gray-400 sm:block" aria-hidden="true" />
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {user?.name}
              </h1>
            </div>

            <p className="mt-1 truncate text-sm text-gray-600 sm:text-base">
              {user?.email}
            </p>

            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {roles.map((role) => (
                <span
                  key={role}
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    roleStyles[role] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {formatRole(role)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={onEditProfile}
            className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:border-red-200 hover:text-red-600 sm:w-auto"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit Profile
          </button>
        )}
      </div>
    </header>
  );
};

export default ProfileHeader;
