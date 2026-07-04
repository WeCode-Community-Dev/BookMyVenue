import Header from "@/presentation/components/common/Header";
import UserProfileImage from "@/presentation/components/user/UserProfileImage";
import UserProfileInformation from "@/presentation/components/user/UserProfileInformation";
import UserSidebar from "@/presentation/components/user/UserSidebar";

const UserProfile = () => {
  const user = {
    name: "Navya N",
    email: "navya@example.com",
    phone: "+91 98765 43210",
    dob: "12 May 1998",
    location: "Kozhikode, Kerala, India",
    image: "https://i.pravatar.cc/300",
    memberSince: "May 2024",
  };

  return (
    <>
      <Header />

      <div className="flex">
        <UserSidebar />

        <main className="flex-1 bg-gray-50 p-10">
          <div className="flex gap-10 items-start">
            {/* Left */}
            <div className="w-80">
              <UserProfileImage
                image={user.image}
                name={user.name}
                email={user.email}
                memberSince={user.memberSince}
                onImageChange={() => console.log("Change Image")}
              />
            </div>

            {/* Right */}
            <div className="flex-1">
              <UserProfileInformation
                user={user}
                onEditProfile={() => console.log("Edit Profile")}
                onAccountSettings={() =>
                  console.log("Account Settings")
                }
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserProfile;