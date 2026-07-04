import {
    User,
    Mail,
    Phone,
    CalendarDays,
    MapPin,
    Pencil,
    Settings,
  } from "lucide-react";
  
  const UserProfileInformation = ({
    user,
    onEditProfile,
    onAccountSettings,
  }) => {
    const profileItems = [
      {
        icon: User,
        label: "Full Name",
        value: user.name,
      },
      {
        icon: Mail,
        label: "Email",
        value: user.email,
      },
      {
        icon: Phone,
        label: "Phone",
        value: user.phone,
      },
      {
        icon: CalendarDays,
        label: "Date of Birth",
        value: user.dob,
      },
      {
        icon: MapPin,
        label: "Location",
        value: user.location,
      },
    ];
  
    return (
      <div className="bg-white rounded-3xl shadow-md p-8 w-full">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">
          Profile Information
        </h2>
  
        <div className="space-y-6">
          {profileItems.map((item) => {
            const Icon = item.icon;
  
            return (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-gray-200 pb-5"
              >
                <div className="flex items-center gap-4 text-gray-500">
                  <Icon size={20} />
  
                  <span>{item.label}</span>
                </div>
  
                <p className="font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
  
        <div className="flex gap-4 mt-10">
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
          >
            <Pencil size={18} />
            Edit Profile
          </button>
  
          <button
            onClick={onAccountSettings}
            className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-600 transition"
          >
            <Settings size={18} />
            Account Settings
          </button>
        </div>
      </div>
    );
  };
  
  export default UserProfileInformation;