import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  CircleCheck,
  CircleX,
  LogOut,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { updateProfile, updateProfileImage } from "../../services/authService";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileSection from "../../components/profile/ProfileSection";
import ProfileField from "../../components/profile/ProfileField";
import StatusBadge from "../../components/profile/StatusBadge";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const formatGender = (gender) => {
  if (!gender?.trim()) return null;
  return gender.charAt(0).toUpperCase() + gender.slice(1);
};

const formatDateOfBirth = (dob) => {
  if (!dob) return null;

  const parsed = new Date(dob);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const toDateInputValue = (dob) => {
  if (!dob) return "";

  const parsed = new Date(dob);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString().slice(0, 10);
};

const buildFormFromUser = (user) => ({
  name: user?.name ?? "",
  phone: user?.phone ?? "",
  gender: user?.gender ?? "other",
  dob: toDateInputValue(user?.dob),
  city: user?.city ?? "",
  state: user?.state ?? "",
  address: user?.address ?? "",
  bio: user?.bio ?? "",
});

const Profile = () => {
  const navigate = useNavigate();
  const { user, userRoles, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [formData, setFormData] = useState(() => buildFormFromUser(user));

  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  const clearPreviewImage = () => {
    setPreviewImageUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  };

  const handleProfileImageSelect = async (file) => {
    if (!file) return;

    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewImageUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return localPreviewUrl;
    });

    try {
      setIsUploadingImage(true);

      const formDataPayload = new FormData();
      formDataPayload.append("profileImage", file);

      const data = await updateProfileImage(formDataPayload);

      if (!data.success) {
        throw new Error(data.message || "Failed to upload profile image.");
      }

      await refreshUser();
      clearPreviewImage();
      toast.success(data.message || "Profile image updated successfully");
    } catch (error) {
      clearPreviewImage();
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to upload profile image. Please try again."
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const scrollToDetails = () => {
    document.getElementById("profile-details")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleStartEdit = () => {
    setFormData(buildFormFromUser(user));
    setIsEditing(true);
    scrollToDetails();
  };

  const handleCancelEdit = () => {
    setFormData(buildFormFromUser(user));
    setIsEditing(false);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const data = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob || null,
        city: formData.city,
        state: formData.state,
        address: formData.address,
        bio: formData.bio,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to update profile.");
      }

      await refreshUser();
      setIsEditing(false);
      toast.success(data.message || "Profile updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to update profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <h1 className="sr-only">My Profile</h1>

      <div className="space-y-4 sm:space-y-5">
        <ProfileHeader
          user={user}
          roles={userRoles}
          onEditProfile={handleStartEdit}
          isEditing={isEditing}
          avatarSrc={previewImageUrl}
          isUploadingImage={isUploadingImage}
          onProfileImageSelect={handleProfileImageSelect}
        />

        <div id="profile-details" className="scroll-mt-24 space-y-4 sm:space-y-5">
          <ProfileSection title="Profile Details">
            <div className="grid gap-4 sm:grid-cols-2">
              {isEditing && (
                <ProfileField
                  label="Name"
                  name="name"
                  value={formData.name}
                  placeholder="Add your name."
                  isEditing
                  onChange={handleFieldChange}
                  className="sm:col-span-2"
                />
              )}
              <ProfileField
                label="Phone number"
                name="phone"
                value={isEditing ? formData.phone : user?.phone}
                placeholder="Add a phone number for booking confirmations."
                isEditing={isEditing}
                onChange={handleFieldChange}
                inputType="tel"
              />
              <ProfileField
                label="Gender"
                name="gender"
                value={
                  isEditing ? formData.gender : formatGender(user?.gender)
                }
                placeholder="Add your gender to personalize your profile."
                isEditing={isEditing}
                onChange={handleFieldChange}
                inputType="select"
                options={GENDER_OPTIONS}
              />
              <ProfileField
                label="Date of birth"
                name="dob"
                value={isEditing ? formData.dob : formatDateOfBirth(user?.dob)}
                placeholder="Add your date of birth."
                isEditing={isEditing}
                onChange={handleFieldChange}
                inputType="date"
              />
              <ProfileField
                label="City"
                name="city"
                value={isEditing ? formData.city : user?.city}
                placeholder="Add your city."
                isEditing={isEditing}
                onChange={handleFieldChange}
              />
              <ProfileField
                label="State"
                name="state"
                value={isEditing ? formData.state : user?.state}
                placeholder="Add your state."
                isEditing={isEditing}
                onChange={handleFieldChange}
              />
              <ProfileField
                label="Address"
                name="address"
                value={isEditing ? formData.address : user?.address}
                placeholder="Add your address."
                isEditing={isEditing}
                onChange={handleFieldChange}
                className="sm:col-span-2"
              />
              <ProfileField
                label="Bio"
                name="bio"
                value={isEditing ? formData.bio : user?.bio}
                placeholder="Tell venues a little about yourself."
                isEditing={isEditing}
                onChange={handleFieldChange}
                inputType="textarea"
                className="sm:col-span-2"
              />
            </div>

            {isEditing && (
              <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </ProfileSection>

          <ProfileSection title="Account Status">
            <div className="flex flex-wrap gap-2.5">
              <StatusBadge
                icon={user?.isEmailVerified ? BadgeCheck : Mail}
                label={
                  user?.isEmailVerified ? "Email verified" : "Email not verified"
                }
                tone={user?.isEmailVerified ? "success" : "warning"}
              />
              <StatusBadge
                icon={user?.isActive ? CircleCheck : CircleX}
                label={user?.isActive ? "Account active" : "Account inactive"}
                tone={user?.isActive ? "success" : "danger"}
              />
            </div>
          </ProfileSection>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full min-h-11 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </div>
    </main>
  );
};

export default Profile;
